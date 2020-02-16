/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};


(function () {
	'use strict';

	var Utils = app.Utils;
	
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
		this.todos = Utils.store(key);
		this.onChanges = [];
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		console.log(onChange)
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		Utils.store(this.key, this.todos);
		this.onChanges.forEach(function (cb) { cb(); });
	};	

	app.TodoModel.prototype.addTodo = function (title) {
		for (let text in this.todos) {
			if (this.todos[text].title === title + " " + new Date().getDate() + "/" +  (new Date().getMonth()+1) + "/" + new Date().getFullYear()) {
				return;
			}
		}

		//let currentDate = new Date().getDate() + "/" + (new Date().getMonth() + 1)+ "/" + new Date().getFullYear();
		
		let currentDate = new Date();

		this.todos = this.todos.concat({
			id: Utils.uuid(),
			title: title + " " + currentDate.getDate() + "/" +  (currentDate.getMonth()+1) + "/" + currentDate.getFullYear(),
			date: new Date(currentDate),
			completed: false
		});

		this.inform();
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
		// Note: it's usually better to use immutable data structures since they're
		// easier to reason about and React works very well with them. That's why
		// we use map() and filter() everywhere instead of mutating the array or
		// todo items themselves.
		this.todos = this.todos.map(function (todo) {
			return Utils.extend({}, todo, {completed: checked});
		});

		this.inform();
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {completed: !todo.completed});
		});

		this.inform();
	};

	app.TodoModel.prototype.destroy = function (todo) {
		this.todos = this.todos.filter(function (candidate) {
			return candidate !== todo;
		});

		this.inform();
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.todos = this.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.inform();
	};

	app.TodoModel.prototype.sortByDate = function () {
		
		console.log(app.asc)
		let toBeSorted = this.todos
		let sortedTodos;

		if (app.asc === true) {
			sortedTodos = toBeSorted.sort((a, b) => new Date(b.date) - new Date(a.date))
			app.asc = false;
		} else if (app.asc === false) {
			sortedTodos = toBeSorted.sort((a, b) => new Date(a.date) - new Date(b.date))
			app.asc = true;
		}    
		console.log("toBeSorted", toBeSorted)
		console.log("sorted", sortedTodos)

		this.inform();
	};

})();
