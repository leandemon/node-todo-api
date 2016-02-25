var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res) {
	var filteredTodos = todos;
	var filter = {};

	if (req.query.hasOwnProperty('completed')) {
		if (req.query.completed === 'true' || req.query.completed === '1') {
			filter.completed = true;
		}
		else if (req.query.completed === 'false' || req.query.completed === '0') {
			filter.completed = false;
		}
	}

	if (req.query.hasOwnProperty('q') && req.query.q.length > 0) {
		filter.q = req.query.q;
	}

	if (!_.isEmpty(filter)) {
		filteredTodos = _.filter(todos, function(t) {
			var res = true;

			if (filter.hasOwnProperty('completed')) {
				res = (t.completed === filter.completed)
			}

			if (filter.hasOwnProperty('q')) {
				res = res && (t.description.toLowerCase().indexOf(filter.q.toLowerCase()) !== -1);
			}

			return res;
		});
	}

	return res.json(filteredTodos);
});

// GET /todos/[ID]
app.get('/todos/:id', function(req, res) {
	var todo = _.find(todos, {
		id: parseInt(req.params.id, 10)
	});

	if (todo) {
		return res.json(todo);
	}

	res.status(404).send();
});

app.put('/todos/:id', function(req, res) {
	var todo = _.find(todos, {
		id: parseInt(req.params.id, 10)
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validProperties = {};

	if (!todo) {
		return res.status(404).json({
			"error": "Todo not found with that ID"
		});
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && todo.description.trim().length > 0) {
		validProperties.description = body.description;
	}
	else if (body.hasOwnProperty('description')) {
		return res.status(400).json({
			"error": "Property 'description' must be string"
		});
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validProperties.completed = body.completed;
	}
	else if (body.hasOwnProperty('completed')) {
		return res.status(400).json({
			"error": "Property 'completed' must be boolean"
		});
	}

	_.extend(todo, validProperties);

	return res.json(todo);
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).json({
			"error": "Property 'description' required and must be string"
		});
	}

	if (!_.isBoolean(body.completed)) {
		return res.status(400).json({
			"error": "Property 'completed' must be boolean"
		});
	}

	db.todo.create(body).then(function(todo) {
		res.json(todo);
	}).catch(function(e) {
		res.status(400).json(e);
	});
});

app.delete('/todos/:id', function(req, res) {
	var index = _.findIndex(todos, {
		id: parseInt(req.params.id, 10)
	});

	if (!_.isInteger(index) || index === -1) {
		return res.status(404).json({
			"error": "Todo not found with that ID"
		});
	}

	var todo = todos[index];

	todos.splice(index, 1);

	res.json(todo);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on port " + PORT);
	});
});