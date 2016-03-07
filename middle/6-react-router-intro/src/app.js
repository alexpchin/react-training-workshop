var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;


var App = React.createClass({
  render: function() {
    return (
      <div>
        <Link to='/about'>About Page</Link>
        <p>Hello World</p>
      </div>
    );
  }
});

var About = React.createClass({
  render: function() {
    return (
      <div>
        <Link to='/'>Home Page</Link>
        <p>This is the about page</p>
      </div>
    );
  }
});

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App} />
    <Route path="/about" component={About} />
  </Router>,
  document.getElementById('app')
)
