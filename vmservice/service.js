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
const rmdir = util.promisify(fs.rmdir);

async function createTempDir() {
    const r1 = Math.round(Math.random() * 10000);
    const r2 = Math.round(Math.random() * 10000);
    const directory = path.join(os.tmpdir(), `judge-${r1}-${r2}`);

    await mkdir(directory);
    return directory;
}

function deleteFolder(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

async function execProcess(command, input) {
    return new Promise((resolve, reject) => {
        const proc = child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }

            resolve({ stdout, stderr });
        });

        proc.stdin.write(input, () => {
            proc.stdin.end();
        })
    });
}

const runner = {
    cpp: async (code, input) => {
        const directory = createTempDir();

        const result = {
            stdout: '',
            stderr: '',
        };

        deleteFolder(directory);

        return result;
    },
    javascript: async (code, input) => {
        const directory = await createTempDir();

        const mainFile = path.join(directory, 'main.js');

        await writeFile(mainFile, code);

        const result = await execProcess(`node "${mainFile}"`, input);

        deleteFolder(directory);

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
            console.log(`malformed [language=${language}] [input=${input}] [code=${code}]`);
        }

        if (!runner[language]) {
            console.log('language not found');
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

console.log(JSON.stringify({
    language: 'cpp',
    input: 'input',
    code: `console.log('Hello world!')`,
}));