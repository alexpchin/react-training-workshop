var React = require('react');

var connect = require('react-redux').connect;
var deleteTodo = require('./actions').deleteTodo;

var Todo = React.createClass({
  propTypes: {
    todo: React.PropTypes.string.isRequired
  },

  onDeleteClick: function() {
    this.props.dispatch(deleteTodo(this.props.todo));
  },

  render: function() {
    return (
      <div>
        <p>{this.props.todo}</p>
        <button onClick={this.onDeleteClick}>Delete</button>
        <hr />
      </div>
    );
  }
});

var ConnectedTodo = connect()(Todo);

module.exports = ConnectedTodo;
