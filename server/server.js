const express = require('express');
const bodyParser = require('body-parser');
const mainRouter = require('./src/routers/mainRouter');

const server = express();

server.use(bodyParser.json());
server.use('/', mainRouter);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
