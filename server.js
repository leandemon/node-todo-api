var express = require('express');
var bodyParser = require('body-parser');

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
	for(var i = 0; i < todos.length; i++) {
		if(todos[i].id === Number(req.params.id)) {
			return res.json(todos[i]);
		}
	}

	res.status(404).send();
});

app.post('/todos', function(req, res) {
	var todo = req.body;
	todo.id = todoNextId++;
	todos.push(todo);

	console.log('todos',JSON.stringify(todos,null,4));

	res.json(todo);
});

app.listen(PORT, function() {
	console.log("Express listening on port " + PORT);
});