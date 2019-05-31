const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
var svc = new Service({
  name: 'Code Runner',
  description: 'The Code Break code runner',
  script: path.join(__dirname, 'service.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start();
});

svc.install();
