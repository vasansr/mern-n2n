/*
 * Express server
 */

var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var app_port = 8080;
var dbUrl = 'mongodb://localhost:27017/bugsdb';
var db;

app = express();
app.use('/', express.static('static'));

/* Get a filtered set of records */
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

/* Get a single record */
app.get('/api/bugs/:id', function(req, res) {
	db.collection('bugs').findOne({_id: ObjectId(req.params.id)}, function(err, bug) {
		res.status(200).send(bug);
	});
});

var jsonParser = bodyParser.json({strict: false});

/* Add a new record */
app.post('/api/bugs', jsonParser, function(req, res) {
	var newBug = req.body;
	console.log('Adding new bug:', newBug);
	// In a production app, we would validate this, whether the required fields exist etc..

	db.collection('bugs').insertOne(newBug, function(err, result) {
		db.collection('bugs').findOne({_id: result.insertedId}, function(err, addedBug) {
			res.status(200).send(addedBug);
		});
	});
});

/* Modify an existing record */
app.put('/api/bugs/:id', jsonParser, function(req, res) {
	var bug = req.body;
	delete bug._id;		// cannot modify _id, so just in case it's there, remove it.
	console.log('Modifying bug:', req.params.id, bug);
	db.collection('bugs').updateOne({_id: ObjectId(req.params.id)}, bug, function(err, result) {
		if (err) {
			res.status(400).send(err);
		} else {
			db.collection('bugs').findOne({_id: ObjectId(req.params.id)}, function(err, updatedBug) {
				res.status(200).send(updatedBug);
			});
		}
	});
});

MongoClient.connect(dbUrl, function(err, database) {
	db = database;
	app.listen(app_port);
	console.log(new Date(), 'Started server on port ' + app_port);
});

