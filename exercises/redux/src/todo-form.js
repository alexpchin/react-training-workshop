var React = require('react');
var connect = require('react-redux').connect;

var addTodo = require('./actions').addTodo;

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
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

module.exports = TodoForm;
