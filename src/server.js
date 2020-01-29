const http = require('http');

const responseHandler = require('./responses');

const port = process.env.PORT || process.env.NODE_PORT || 3030;

const onRequest = (req, res) => {
  console.log(req.url);
  const acceptedTypes = req.headers.accept.split(',');

  if (req.url === '/') {
    responseHandler.getIndex(req, res);
  } else if (req.url === '/style.css') {
    responseHandler.getStyle(req, res);
  } else {
    responseHandler.generateResponse(req, res, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port);
console.log(`Listening on port ${port}`);
