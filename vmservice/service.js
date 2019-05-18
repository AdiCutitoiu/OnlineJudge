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
        if(!result.stderr || !result.stderr.length) {
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
    getProps: async () => {
        const inputFile = './vmservice/test.in';

        let data = await readFile(inputFile, { encoding: 'utf8' })

        data = data.toString().trim();

        let props = [];

        if (data.length) {
            lines = data.split('\r\n').filter(line => line.trim().length);

            props = lines.map((line, index) => {
                return {
                    name: `${index}`,
                    value: line
                }
            });
        }

        writeFile(inputFile, '');

        return props;
    },
    setProp: async (name, value) => {
        await appendFile('./vmservice/test.out', `${name} ${JSON.stringify(value)}\n`);
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
        await propertyGetterSetter.setProp(name, result);
    } catch (error) {
        console.log(error);
    }

});

setInterval(async () => {
    try {
        let props = await propertyGetterSetter.getProps();
        props.forEach((prop) => eventEmitter.emit('solution', prop.name, JSON.parse(prop.value)));
    } catch (error) {
        console.log(error);
    }
}, 500);
