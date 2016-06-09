var React = require('react');
var ReactDOM = require('react-dom');

var Redux = require('redux');
var ReactRedux = require('react-redux');
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

var todoAppReducers = require('./reducers');

var Header = require('./header');


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

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
