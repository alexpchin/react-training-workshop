var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;

var App = React.createClass({
  render: function() {
    return (
      <p>Hello World</p>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
