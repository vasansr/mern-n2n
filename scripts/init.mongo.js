var db = new Mongo().getDB('bugsdb');

db.bugs.remove({});

db.bugs.insert([
	{status: 'Open', priority: 'P3', owner: 'Vasan',
	   	title: '404 Not Found on some files'},
	{status: 'Open', priority: 'P3', owner: 'Sandeep',
	   	title: 'Error on console: no property "set" in undefined'},
	{status: 'Open', priority: 'P3', owner: 'Fazle',
	   	title: 'Warning: validateDOMNesting(...): <tr> cannot appear as a child of <table>.'}
]);

