var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite',
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 255]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync(/*{force: true}*/).then(function() {
	console.log('Everything synced');

	Todo.findById(1).then(function(t) {
		if(t) {
			console.log(t.toJSON());
		}
		else {
			console.log("todo not found");
		}
	});

	/*Todo.create({
		description: "Sleep"
	}).then(function(todo) {
		return Todo.create({
			description: "Feed the dog"
		});
	}).then(function() {
		return Todo.findAll({
			where: {
				description: {
					$like: '%dog%'
				}
			}
		});
	}).then(function(todos) {
		if(todos) {
			todos.forEach(function(t) {
				console.log(t.toJSON());
			});
		}
		else {
			console.log("no todos found");
		}
	}).catch(function(error) {
		console.log(error.message);
	});*/
});