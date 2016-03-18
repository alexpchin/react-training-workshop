var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./header');
var TodoForm = require('./todo-form');

var App = React.createClass({
  getInitialState: function() {
    return { todos: [] };
  },
  renderTodos: function() {
    return this.state.todos.map(function(todo) {
      return <p key={todo}>{todo}</p>;
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
