const config = require('../../config');
const VmRunner = require('./vmrunner');
const GlotRunner = require('./glotrunner');

module.exports = config.vmName && config.vmSnapshot
  ? new VmRunner(config.vmName, config.vmSnapshot)
  : new GlotRunner();
