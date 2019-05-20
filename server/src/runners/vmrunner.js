const generateGuid = require('uuid/v4');
const child_process = require('child_process');

const PROC_OPTIONS = { timeout: 5000, maxBuffer: 50 * 1024 * 1024 };

async function execProcess(command) {
    return new Promise((resolve, reject) => {
        child_process.exec(command, PROC_OPTIONS, (error, stdout, stderr) => {
            resolve({ stdout, stderr });
        });
    });
}

function execProcessSync(command) {
    return child_process.execSync(command, PROC_OPTIONS);
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
    constructor(vmName) {
        this.vmName = vmName;

        let vms = execProcessSync('VBoxManage list vms')
            .trim()
            .split('\n')
            .map(line => line.split('{')[1].trim());

        if (!vms.find(`"${vmName}"`)) {
            throw Error(`${vmName} does not exist`);
        }

        let isPoweredOff = execProcessSync(`VBoxManage showvminfo ${vmName}`).includes('powered off (since');
        if (isPoweredOff) {
            execProcessSync(`VBoxManage startvm ${vmName}`)
        }
    }

    async deleteGuestProp(name) {
        await execProcess(`VBoxManage guestproperty delete ${this.vmName} "/Guest/${name}"`);
    }

    async setHostProp(name, value) {
        await execProcess(`VBoxControl guestproperty set ${this.vmName} "/Host/${name}" "${base64Encode(JSON.stringify(value))}"`);
    }

    async waitForUpdatedGuestProp(name) {
        const { stdout } = await execProcess(`VBoxManage guestproperty wait ${this.vmName} "/Guest/${name}"`);
        if (!stdout) {
            return '';
        }

        const valueString = stdout.split(', ');
        const value = valueString.split(': ')[1];

        return base64Decode(value);
    }
};

class VmRunner {
    constructor(vmName) {
        this.virtualbox = new Virtualbox(vmName);
    }

    async runCpp(code, input) {
        return this.run('cpp', code, input);
    }

    async runJavascript(code, input) {
        return this.run('javascript', code, input);
    }

    async run(language, code, input) {
        const propName = generateGuid();

        const [_, result] = await Promise.all([
            this.virtualbox.setHostProp(propName, { language, code, input }),
            this.virtualbox.waitForUpdatedGuestProp(propName)
        ]);

        setImmediate(async () => {
            try {
                await virtualbox.deleteGuestProp(propName);
            } catch (error) {

            }
        });

        return result;
    }
}

module.exports = VmRunner;
