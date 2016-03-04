var React = require('react');
var TodoActions = require('./todo-actions');

var Todo = React.createClass({
  propTypes: {
    todo: React.PropTypes.string.isRequired
  },

  deleteTodoClick: function() {
    TodoActions.deleteTodo(this.props.todo);
  },

  render: function() {
    return (
      <div>
        { this.props.todo }
        <button onClick={this.deleteTodoClick}>Delete</button>
      </div>
    );
  }
});

module.exports = Todo;
