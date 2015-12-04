/*
 * Express server
 */

var express = require('express');

var app_port = 8080;

app = express();
app.use('/', express.static('static'));

app.listen(app_port);
console.log(new Date(), 'Started server on port ' + app_port);

