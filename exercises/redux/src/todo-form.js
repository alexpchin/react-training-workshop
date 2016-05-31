var React = require('react');
var connect = require('react-redux').connect;

var addTodo = require('./actions').addTodo;

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.dispatch(addTodo(this.refs.todoInput.value));
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="todoInput" />
        <button type="submit">Create</button>
      </form>
    );
  }
});

var ConnectedTodoForm = connect()(TodoForm);

module.exports = ConnectedTodoForm;
