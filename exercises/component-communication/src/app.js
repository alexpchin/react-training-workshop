var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./header');
var TodoStore = require('./todo-store');
var Todo = require('./todo');

var App = React.createClass({
  getInitialState: function() {
    return { todos: [] };
  },
  renderTodos: function() {
    return this.state.todos.map(function(todo) {
      return <Todo todo={todo} key={todo} />;
    });
  },

  render: function() {
    return (
      <div>
        <Header />
        { this.renderTodos() }
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
