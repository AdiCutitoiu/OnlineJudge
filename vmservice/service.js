const fs = require('fs');
const EventEmitter = require('events');
const util = require('util');
const os = require('os');
const path = require('path');
const child_process = require('child_process');
var EventLogger = require('node-windows').EventLogger;

var log = new EventLogger('Code Runner');

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

function base64Encode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  const encodedURI = encodeURIComponent(str)
  return Buffer.from(encodedURI.replace(/%([0-9A-F]{2})/g,
    (match, p1) => {
      let s = String.fromCharCode('0x' + p1);
      return s;
    }
  )).toString('base64');
}

function base64Decode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(Buffer.from(str, 'base64').toString().split('').map(function (c) {
    let s = '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    return s;
  }).join(''));
}

async function createTempDir() {
  const r1 = Math.round(Math.random() * 10000);
  const r2 = Math.round(Math.random() * 10000);
  const directory = path.join(os.tmpdir(), `judge-${r1}-${r2}`);

  await mkdir(directory);
  return directory;
}

async function execProcess(command, input) {
  const options = { timeout: 5000, maxBuffer: 50 * 1024 * 1024 };

  return new Promise((resolve, reject) => {
    const proc = child_process.exec(command, options, (error, stdout, stderr) => {
      resolve({ stdout, stderr });
    });

    if (input) {
      proc.stdin.write(input, () => {
        proc.stdin.end();
      });
    }
  });
}

function deleteDir(path) {
  setImmediate(async () => {
    try {
      await execProcess(`rmdir /Q /S ${path}`);
    } catch (error) {
      log.error(error);
    }
  })
};

const runner = {
  cpp: async (code, input) => {
    const directory = await createTempDir();

    const mainFile = path.join(directory, 'main.cpp');
    await writeFile(mainFile, code);

    const exeFile = path.join(directory, 'main.exe');

    let result = await execProcess(`clang "${mainFile}" --output "${exeFile}"`);
    if (!result.stderr || !result.stderr.length) {
      result = await execProcess(`"${exeFile}"`, input);
    }

    deleteDir(directory);

    return result;
  },
  javascript: async (code, input) => {
    const directory = await createTempDir();

    const mainFile = path.join(directory, 'main.js');
    await writeFile(mainFile, code);

    const result = await execProcess(`node "${mainFile}"`, input);

    deleteDir(directory);

    return result;
  }
};

const propertyGetterSetter = {
  getHostProps: async () => {
    let data = await execProcess('VBoxControl guestproperty enumerate --patterns /Host/*');

    data = data ? data.stdout : data;

    let props = [];

    if (data && data.length) {
      lines = data.split('\r\n').splice(3).filter(line => line.trim().length);

      props = lines.map(line => {
        const pairs = line.split(', ');

        const rawName = pairs[0].split(': ')[1];
        const name = rawName.substr(rawName.lastIndexOf('/') + 1);
        const value = base64Decode(pairs[1].split(': ')[1]);

        return { name, value };
      });
    }

    return props;
  },
  deleteHostProp: async (name) => {
    await execProcess(`VBoxControl guestproperty delete "/Host/${name}"`);
  },
  setGuestProp: async (name, value) => {
    await execProcess(`VBoxControl guestproperty set "/Guest/${name}" "${base64Encode(JSON.stringify(value))}"`);
  },
  ping: async () => {
    await execProcess(`VBoxControl guestproperty set "/ping" ""`);
  }
};

const eventEmitter = new EventEmitter();
eventEmitter.on('solution', async (name, value) => {
  try {
    const { language, input, code } = value;
    if (!language || !input || !code) {
      throw new Error(`malformed [language=${language}] [input=${input}] [code=${code}]`);
    }

    if (!runner[language]) {
      throw new Error('language not found');
    }

    const result = await runner[language](code, input);
    await propertyGetterSetter.setGuestProp(name, result);

  } catch (error) {
    await propertyGetterSetter.setGuestProp(name, 'error');
    log.error(error);
  } finally {
    await propertyGetterSetter.deleteHostProp(name, '');
  }

});

setInterval(async () => {
  try {
    let props = await propertyGetterSetter.getHostProps();
    props.forEach((prop) => eventEmitter.emit('solution', prop.name, JSON.parse(prop.value)));
  } catch (error) {
    log.error(error);
  }
}, 500);

setInterval(async () => {
  try {
    await propertyGetterSetter.ping();
  } catch (error) {
    log.error(error);
  }
}, 500);
