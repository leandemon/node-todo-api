var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Company meeting',
	completed: false
}, {
	id: 2,
	description: 'Go shopping',
	completed: false	
}, {
	id: 3,
	description: 'Eat',
	completed: true	
}];

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


app.listen(PORT, function() {
	console.log("Express listening on port " + PORT);
});