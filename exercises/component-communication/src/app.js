var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./header');
var TodoStore = require('./todo-store');
var Todo = require('./todo');

var App = React.createClass({
  getStateFromStore: function() {
    return TodoStore.getState();
  },

  getInitialState: function() {
    return this.getStateFromStore();
  },

  onChange: function() {
    this.setState(this.getStateFromStore());
  },

  componentDidMount: function() {
    TodoStore.onChange = this.onChange;
  },

  renderTodos: function() {
    return this.state.todos.map(function(todo) {
      return <Todo key={todo} todo={todo}>{todo}</Todo>;
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
