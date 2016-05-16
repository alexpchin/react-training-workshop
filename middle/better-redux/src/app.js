var React = require('react');
var ReactDOM = require('react-dom');

var Redux = require('redux');

var ReactRedux = require('react-redux');
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

var todoAppReducers = require('./reducers');

var Header = require('./header');

var store = Redux.createStore(
  todoAppReducers,
  window.devToolsExtension ? window.devToolsExtension() : function(x) { return x }
);

var App = React.createClass({
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
