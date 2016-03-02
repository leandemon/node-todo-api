var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res) {
	var where = {};

	if (req.query.hasOwnProperty('completed')) {
		if (req.query.completed === 'true' || req.query.completed === '1') {
			where.completed = true;
		}
		else if (req.query.completed === 'false' || req.query.completed === '0') {
			where.completed = false;
		}
	}

	if (req.query.hasOwnProperty('q') && req.query.q.length > 0) {
		where.description = {
			$like: '%' + req.query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}).catch(function(e) {
		res.status(500).json(e);
	});
});

// GET /todos/[ID]
app.get('/todos/:id', function(req, res) {
	var id = parseInt(req.params.id);

	db.todo.findById(id).then(function(todo) {
		if (todo) {
			res.json(todo);
		}
		else {
			res.status(404).send();
		}
	}).catch(function(e) {
		res.status(500).json(e);
	});
});

app.put('/todos/:id', function(req, res) {
	var id = parseInt(req.params.id);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	db.todo.update(attributes, {
		where: {
			id: id
		}
	}, function(e) {
		res.status(400).json(e);
	}).then(function(result) {
		if(_.isArray(result) && result[0] === 1) {
			db.todo.findById(id).then(function(todo) {
				if(todo) {
					res.json(todo);
				}
				else {
					res.status(404).send();
				}
			});
		}
		else {
			res.status(404).send();
		}
		
	}).catch(function(e) {
		res.status(400).json(e);
	});
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo);
	}).catch(function(e) {
		res.status(400).json(e);
	});
});

app.delete('/todos/:id', function(req, res) {
	var id = parseInt(req.params.id);

	db.todo.destroy({
		where: {
			id: id
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted > 0) {
			res.status(204).send();
		}
		else {
			return res.status(404).json({
				"error": "Todo not found with that ID"
			});
		}
	}).catch(function(e) {
		res.status(500).json(e);
	});
});

app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		res.json(user);
	}).catch(function(e) {
		res.status(400).json(e);
	});
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on port " + PORT);
	});
});