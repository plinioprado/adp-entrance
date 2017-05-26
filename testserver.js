var express = require('express');
var port = 3000;

var app = express();
app.disabled('x-powered-by');

app.use(express.static(__dirname + '/src'));

// Run
app.listen(port, function() {
  console.log('Server running on localhost:' + port);
});
