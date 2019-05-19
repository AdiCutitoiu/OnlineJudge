const fs = require('fs');
const EventEmitter = require('events');
const util = require('util');
const os = require('os');
const path = require('path');
const child_process = require('child_process');

const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    const encodedURI = encodeURIComponent(str)
    let result = Buffer.from(encodedURI.replace(/%([0-9A-F]{2})/g,
        (match, p1) => {
            let s = String.fromCharCode('0x' + p1);
            return s;
        }
    ));
    return result.toString('base64');
}

function b64DecodeUnicode(str) {
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
            console.log(error);
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
}

const propertyGetterSetter = {
    getHostProps: async () => {
        const inputFile = './vmservice/test.in';

        let data = await readFile(inputFile, { encoding: 'utf8' });

        data = data.toString().trim();

        let props = [];

        if (data.length) {
            lines = data.split('\r\n').filter(line => line.trim().length);

            props = lines.map(line => {
                const pairs = line.split(', ');

                const rawName = pairs[0].split(': ')[1];
                const name = rawName.substr(rawName.lastIndexOf('/') + 1);
                const value = b64DecodeUnicode(pairs[1].split(': ')[1]);
                
                return { name, value };
            });
        }

        writeFile(inputFile, '');

        return props;
    },
    deleteHostProp: async (name) => {
        await appendFile('./vmservice/test.out', `HOST/${name} deleted\n`);
    },
    setGuestProp: async (name, value) => {
        await appendFile('./vmservice/test.out', `GUEST/${name} ${b64EncodeUnicode(JSON.stringify(value))}\n`);
    }
}

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
        console.log(error);
    } finally {
        await propertyGetterSetter.deleteHostProp(name, '');
    }

});

setInterval(async () => {
    try {
        let props = await propertyGetterSetter.getHostProps();
        props.forEach((prop) => eventEmitter.emit('solution', prop.name, JSON.parse(prop.value)));
    } catch (error) {
        console.log(error);
    }
}, 1000);
