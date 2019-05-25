const generateGuid = require('uuid/v4');
const child_process = require('child_process');
const isRunning = require('is-running')

async function execProcess(command, spawnedCallback) {
  const options = { maxBuffer: 50 * 1024 * 1024 };

  return new Promise((resolve, reject) => {
    const proc = child_process.exec(command, options, (error, stdout, stderr) => {
      resolve({ stdout, stderr });
    });

    if (spawnedCallback) {
      let interval = setInterval(() => {
        if (isRunning(proc.pid)) {
          clearInterval(interval);
          spawnedCallback();
        }
      }, 10);
    }
  });
}

function execProcessSync(command) {
  const options = { maxBuffer: 50 * 1024 * 1024 };

  return child_process.execSync(command, options).toString();
}

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

class Virtualbox {
  constructor(vmName, vmSnapshot) {
    this.vmName = vmName;

    let vms = execProcessSync('VBoxManage list vms')
      .trim()
      .split('\n')
      .map(line => line.split('{')[0].trim());

    if (!vms.includes(`"${vmName}"`)) {
      throw Error(`${vmName} does not exist`);
    }

    let vmInfo = execProcessSync(`VBoxManage showvminfo ${vmName}`);

    let isRunning = vmInfo.includes('running (since');
    if (isRunning) {
      execProcessSync(`VBoxManage controlvm ${vmName} poweroff`);
    }

    execProcessSync(`VBoxManage snapshot ${vmName} restore ${vmSnapshot}`);
    execProcessSync(`VBoxManage startvm ${vmName}`)

    execProcessSync(`VBoxManage guestproperty wait ${this.vmName} "/ping"`);
  }

  async deleteGuestProp(name) {
    await execProcess(`VBoxManage guestproperty unset ${this.vmName} "/Guest/${name}"`);
  }

  async setHostProp(name, value) {
    await execProcess(`VBoxManage guestproperty set ${this.vmName} "/Host/${name}" "${base64Encode(JSON.stringify(value))}"`);
  }

  async waitForUpdatedGuestProp(name, waitingStartedCallback) {
    const { stdout } = await execProcess(`VBoxManage guestproperty wait ${this.vmName} "/Guest/${name}"`, waitingStartedCallback);
    if (!stdout) {
      console.log('waiting failed');
      return '';
    }

    const valueString = stdout.split(', ')[1];
    const value = valueString.split(': ')[1];

    return JSON.parse(base64Decode(value));
  }
};

class VmRunner {
  constructor(vmName, vmSnapshot) {
    this.virtualbox = new Virtualbox(vmName, vmSnapshot);
  }

  async runCpp(code, input) {
    return this.run('cpp', code, input);
  }

  async runJavascript(code, input) {
    return this.run('javascript', code, input);
  }

  async run(language, code, input) {
    const propName = generateGuid();

    const waitUpdatePromise = this.virtualbox.waitForUpdatedGuestProp(propName, () => {
      this.virtualbox.setHostProp(propName, { language, code, input })
        .then(() => { })
        .catch(() => { });
    });

    const result = await waitUpdatePromise;

    setImmediate(async () => {
      try {
        await this.virtualbox.deleteGuestProp(propName);
      } catch (error) {
        console.log(error);
      }
    });

    return result;
  }
}

module.exports = VmRunner;
