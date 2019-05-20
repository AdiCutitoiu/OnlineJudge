const config = require('../../config');
const VmRunner = require('./vmrunner');
const GlotRunner = require('./glotrunner');

module.exports = config.vmName ? new VmRunner(config.vmName) : new GlotRunner();
