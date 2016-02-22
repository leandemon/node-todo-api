var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
	return res.json(todos);
});

// GET /todos/[ID]
app.get('/todos/:id', function(req, res) {
	var todo = _.findWhere(todos, {id: parseInt(req.params.id, 10)});
	
	if(todo) {
		return res.json(todo);
    }

	res.status(404).send();
});

app.post('/todos', function(req, res) {
	var todo = _.pick(req.body,'description','completed');

	if(!_.isString(todo.description) || todo.description.trim().length === 0) {
		return res.status(400).send("Property 'description' required and must be string");
	}

	if(!_.isBoolean(todo.completed)) {
		return res.status(400).send("Property 'completed' must be boolean");
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