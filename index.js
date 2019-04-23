var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;


var server = http.createServer(function(req, res) {
  // Get the url
  var parseUrl = url.parse(req.url, true);

  // Get the pathname
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'')

  // Define the decoder that will be used for getting the payload
  var decoder = new StringDecoder('utf-8');
  // Get the payload
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handler that will deal with the request
    var choosenHandler = typeof(routers[trimmedPath]) !== 'undefined' ? routers[trimmedPath] : handlers.notFound;

    var data = {
      method: req.method,
      headers: req.headers,
      payload: buffer
    };

    // Route the request
    choosenHandler(data, function(statusCode, payload) {

      payload = typeof(payload) == 'object' ? payload : {};

      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHeader(statusCode);
      res.end(payloadString);

      console.log('Choosen Handler: ', trimmedPath, '. Returned response : ', payload, ' - ', statusCode);
    })
  });
});

server.listen('4000', function() {
  console.log('The - HOMEWORK ASSIGNMENT 1 - server is listening on port 4000');

});

var handlers = {};

handlers.hello = function(data, callback) {
  var statusCode = 200;
  var payload = {
    'data': data,
    'payload': "Homework Assignment 1 - Pirple"
  };

  callback(statusCode, payload);
}

handlers.notFound = function(data, callback) {
  var statusCode = 404;
  var payload = {
    'message': 'WELCOME TO PIRPLE !!!',
    'data': data,
    'payload': undefined
  };

  callback(statusCode, payload);
}

var routers = {
  'hello': handlers.hello
}
