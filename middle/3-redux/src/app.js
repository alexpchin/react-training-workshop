var React = require('react');
var ReactDOM = require('react-dom');

// all the Redux related requires
var Redux = require('redux');
var ReactRedux = require('react-redux');
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

var todoAppReducers = require('./reducers');

var Header = require('./header');

// create the react store
var store = Redux.createStore(todoAppReducers);

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

// TODO: connect the app and render it, wrapped in Provider

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
