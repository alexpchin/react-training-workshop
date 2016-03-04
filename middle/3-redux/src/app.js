var React = require('react');
var ReactDOM = require('react-dom');

var Redux = require('redux');

var ReactRedux = require('react-redux');
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;


var todoAppReducers = require('./reducers');

var Header = require('./header');
var TodoStore = require('./todo-store');

var store = Redux.createStore(todoAppReducers);

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
    return this.props.todos.map(function(todo) {
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

var ConnectedApp = connect(function(state) {
  return {
    todos: state.todos
  };
})(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('app')
)
