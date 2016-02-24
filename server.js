var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

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

	if(req.query.hasOwnProperty('completed')) {
		if(req.query.completed === 'true' || req.query.completed  === '1') {
			filteredTodos = _.filter(todos, {completed: true});
		}
		else if(req.query.completed === 'false' || req.query.completed  === '0') {
			filteredTodos = _.filter(todos, {completed: false});
		}
		else {
			filteredTodos = [];
		}
	}

	return res.json(filteredTodos);
	
});

// GET /todos/[ID]
app.get('/todos/:id', function(req, res) {
	var todo = _.find(todos, {id: parseInt(req.params.id, 10)});

	if(todo) {
		return res.json(todo);
    }

	res.status(404).send();
});

app.put('/todos/:id', function(req, res) {
	var todo = _.find(todos, {id: parseInt(req.params.id, 10)});
	var body = _.pick(req.body,'description','completed');
	var validProperties = {};

	if(!todo) {
		return res.status(404).json({"error":"Todo not found with that ID"});
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && todo.description.trim().length > 0) {
		validProperties.description = body.description;
	}
	else if(body.hasOwnProperty('description')) {
		return res.status(400).json({"error":"Property 'description' must be string"});
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validProperties.completed = body.completed;
	}
	else if(body.hasOwnProperty('completed')) {
		return res.status(400).json({"error":"Property 'completed' must be boolean"});
	}

	_.extend(todo, validProperties);

    return res.json(todo);
});

app.post('/todos', function(req, res) {
	var todo = _.pick(req.body,'description','completed');

	if(!_.isString(todo.description) || todo.description.trim().length === 0) {
		return res.status(400).json({"error":"Property 'description' required and must be string"});
	}

	if(!_.isBoolean(todo.completed)) {
		return res.status(400).json({"error":"Property 'completed' must be boolean"});
	}

	todo.id = todoNextId++;
	todo.description = todo.description.trim();
	todos.push(todo);

	console.log('todos',JSON.stringify(todos,null,4));

	res.json(todo);
});

app.listen(PORT, function() {
	console.log("Express listening on port " + PORT);
});

app.delete('/todos/:id', function(req, res) {
	var index = _.findIndex(todos, {id: parseInt(req.params.id, 10)});

	if(!_.isInteger(index) || index === -1) {
		return res.status(404).json({"error":"Todo not found with that ID"});
	}

	var todo = todos[index];

	todos.splice(index, 1);

	res.json(todo);
});