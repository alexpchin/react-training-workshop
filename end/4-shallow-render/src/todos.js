var React = require('react');
var Todo = require('./todo');
var AddTodo = require('./add-todo');

var stateFns = require('./state-functions');
var toggleDone = stateFns.toggleDone;
var addTodo = stateFns.addTodo;
var deleteTodo = stateFns.deleteTodo;

var Todos = React.createClass({
  getInitialState: function() {
    return {
      todos: [
        { id: 1, name: 'Write the blog post', done: false },
        { id: 2, name: 'Buy Christmas presents', done: false },
        { id: 3, name: 'Leave Santa his mince pies', done: false },
      ]
    };
  },

  toggleDone: function(id) {
    this.setState(toggleDone(this.state, id));
  },

  addTodo: function(todo) {
    this.setState(addTodo(this.state, todo));
  },

  deleteTodo: function(id) {
    this.setState(deleteTodo(this.state, id));
  },

  renderTodos: function() {
    return this.state.todos.map(function(todo) {
      return (
        <li key={todo.id}>
          <Todo
            todo={todo}
            doneChange={this.toggleDone}
            deleteTodo={this.deleteTodo} />
        </li>
      );
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        <p>The <em>best</em> todo app out there.</p>
        <h1>Things to get done:</h1>
        <ul className="todos-list">{ this.renderTodos() }</ul>
        <AddTodo onNewTodo={this.addTodo} />
      </div>
    )
  }
});

module.exports = Todos;
