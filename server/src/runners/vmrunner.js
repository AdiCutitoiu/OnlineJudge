const generateGuid = require('uuid/v4');
const child_process = require('child_process');

async function execProcess(command) {
    const options = { maxBuffer: 50 * 1024 * 1024 };

    return new Promise((resolve, reject) => {
        child_process.exec(command, options, (error, stdout, stderr) => {
            resolve({ stdout, stderr });
        });
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
    constructor(vmName) {
        this.vmName = vmName;

        let vms = execProcessSync('VBoxManage list vms')
            .trim()
            .split('\n')
            .map(line => line.split('{')[0].trim());

        if (!vms.includes(`"${vmName}"`)) {
            throw Error(`${vmName} does not exist`);
        }

        const vmInfo = execProcessSync(`VBoxManage showvminfo ${vmName}`);
        let isPoweredOff = vmInfo.includes('powered off (since') || vmInfo.includes('saved (since');
        if (isPoweredOff) {
            execProcessSync(`VBoxManage startvm ${vmName}`)
        }

        execProcessSync(`VBoxManage guestproperty wait ${this.vmName} "/ping"`);
    }

    async deleteGuestProp(name) {
        await execProcess(`VBoxManage guestproperty unset ${this.vmName} "/Guest/${name}"`);
    }

    async setHostProp(name, value) {
        await execProcess(`VBoxManage guestproperty set ${this.vmName} "/Host/${name}" "${base64Encode(JSON.stringify(value))}"`);
    }

    async waitForUpdatedGuestProp(name) {
        const { stdout } = await execProcess(`VBoxManage guestproperty wait ${this.vmName} "/Guest/${name}"`);
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
                await this.virtualbox.deleteGuestProp(propName);
            } catch (error) {
                console.log(error);
            }
        });

        return result;
    }
}

module.exports = VmRunner;
