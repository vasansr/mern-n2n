/*
 * Express server
 */

var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app_port = 8080;
var dbUrl = 'mongodb://localhost:27017/bugsdb';
var db;

app = express();
app.use('/', express.static('static'));

app.get('/api/bugs', function(req, res) {
	var filter = {};
	if (req.query.priority)
		filter.priority = req.query.priority;
	if (req.query.status)
		filter.status = req.query.status;

	db.collection('bugs').find(filter).toArray(function (err, docs) {
		res.status(200).send(docs);
	});
});

var jsonParser = bodyParser.json({strict: false});

app.post('/api/bugs', jsonParser, function(req, res) {
	var newBug = req.body;
	console.log('Adding new bug: ', newBug);
	// In a production app, we would validate this, whether the required fields exist etc..

	db.collection('bugs').insertOne(newBug, function(err, result) {
		db.collection('bugs').findOne({_id: result.insertedId}, function(err, addedBug) {
			res.status(200).send(addedBug);
		});
	});
});

MongoClient.connect(dbUrl, function(err, database) {
	db = database;
	app.listen(app_port);
	console.log(new Date(), 'Started server on port ' + app_port);
});

