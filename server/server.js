const express = require('express');
const mainRouter = require('./src/routers/mainRouter');

const server = express();

server.use('/', mainRouter);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
