var React = require('react');

var Todo = React.createClass({
  propTypes: {
    deleteTodo: React.PropTypes.func.isRequired,
    doneChange: React.PropTypes.func.isRequired
  },
  toggleDone: function() {
    this.props.doneChange(this.props.todo.id);
  },

  deleteTodo: function(e) {
    e.preventDefault();
    this.props.deleteTodo(this.props.todo.id);
  },

  render: function() {
    var todo = this.props.todo;
    var className = todo.done ? 'done-todo' : '';

    var classes = [
      'todo',
      className,
      'todo-' + todo.id
    ].join(' ');
    return (
      <div className={classes}>
        <p className="toggle-todo" onClick={this.toggleDone}>{ todo.name }</p>
        <a className="delete-todo" href="#" onClick={this.deleteTodo}>Delete</a>
      </div>
    )
  }
});

module.exports = Todo;
