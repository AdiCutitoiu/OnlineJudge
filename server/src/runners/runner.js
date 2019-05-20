const config = require('../../config');
const VmRunner = require('./vmrunner');

module.exports = config.vmName ? VmRunner(config.vmName) : VmRunner('');