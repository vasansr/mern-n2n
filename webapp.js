/*
 * Express server
 */

var express = require('express');
var bodyParser = require('body-parser');

var app_port = 8080;

app = express();
app.use('/', express.static('static'));

var allBugs = [
	{_id: 1, owner: 'Vasan', title: '404 Not Found on some files'},
	{_id: 2, owner: 'Sandeep', title: 'Error on console: no property "set" in undefined'},
	{_id: 3, owner: 'Fazle', title: 'Warning: validateDOMNesting(...): <tr> cannot appear as a child of <table>.'}
];

app.get('/api/bugs', function(req, res) {
	res.status(200).send(JSON.stringify(allBugs));
});

var jsonParser = bodyParser.json({strict: false});
app.post('/api/bugs', jsonParser, function(req, res) {
	var newBug = req.body;
	console.log('Adding new bug: ', newBug);
	// In a production app, we would validate this, whether the required fields exist etc..
	newBug._id = allBugs.length + 1;
	allBugs.push(newBug);
	res.status(200).send(JSON.stringify(newBug));
});

app.listen(app_port);
console.log(new Date(), 'Started server on port ' + app_port);

