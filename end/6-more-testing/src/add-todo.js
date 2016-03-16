var React = require('react');

var AddTodo = React.createClass({
  addTodo: function(e) {
    e.preventDefault();
    var newTodoName = this.refs.todoTitle.value;
    if (newTodoName) {
      this.props.onNewTodo({
        name: newTodoName
      });

      this.refs.todoTitle.value = '';
    }
  },
  render: function() {
    return (
      <div className="add-todo">
        <input type="text" placeholder="Walk the dog" ref="todoTitle" />
        <button onClick={this.addTodo}>Add Todo</button>
      </div>
    )
  }
});

module.exports = AddTodo;
