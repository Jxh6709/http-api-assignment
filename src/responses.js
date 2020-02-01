const fs = require('fs'); // pull in the file system module
const url = require('url');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, content, type, statusCode) => {
  response.writeHead(statusCode, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => {
  respond(request, response, index, 'text/html', 200);
};

const getStyle = (request, response) => {
  respond(request, response, style, 'text/css', 200);
};

const makeJSONContent = (msg, id) => {
  const response = {
    message: msg,
  };
  if (id !== 'success') {
    response.id = id;
  }
  return JSON.stringify(response);
};

const makeXML = (msg, id) => {
  let xml = '<response>';
  xml = `${xml} <message>${msg}</message>`;
  if (id !== 'success') {
    xml = `${xml} <id>${id}</id>`;
  }
  return `${xml} </response>`;
};

const responses = {
  '/success': ['This is a successful response', '200', 'success'],
  '/badRequest': ['Missing valid query parameter set to true', '400', 'badRequest'],
  '/unauthorized': ['Missing loggedIn query parameter set to yes', '401', 'unauthorized'],
  '/forbidden': ['You do not have access to this content', ' 403', 'forbidden'],
  '/internal': ['Internal Server Error. Something went wrong', '500', 'internalError'],
  '/notImplemented': ['A get request for this page has not been implemented yet. '
       + 'Check again later for updated content', '501', 'notImplemented'],
  '/notFound': ['The page you are looking for was not found', '404', 'notFound'],
  badRequestWithQuery: ['This request has the requested parameters', '200', 'success'],
  unauthorizedWithQuery: ['You have successfully viewed the content ', '200', 'success'],
};

const generateResponse = (request, response, acceptedTypes) => {
  let parts = responses['/notFound'];
  let message = null;
  let code = null;
  let id = null;

  const potentialQueryParams = url.parse(request.url, true).query;

  if (request.url.includes('/badRequest') && potentialQueryParams.valid === 'true') {
    parts = responses.badRequestWithQuery;
  } else if (request.url.includes('/unauthorized') && potentialQueryParams.loggedIn === 'yes') {
    parts = responses.unauthorizedWithQuery;
  } else if (responses[request.url]) {
    parts = responses[request.url];
  }
  // this is what makes eslint happy
  [message, code, id] = parts;

  if (acceptedTypes[0] === 'text/xml') {
    return respond(request, response, makeXML(message, id), 'text/xml', code);
  }
  return respond(request, response, makeJSONContent(message, id), 'application/json', code);
};

module.exports = {
  getIndex,
  getStyle,
  generateResponse,
};
