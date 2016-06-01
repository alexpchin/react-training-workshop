var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexLink = ReactRouter.IndexLink;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = ReactRouter.hashHistory;

var Redux = require('redux');
var reduxThunk = require('redux-thunk').default;
var reducers = require('./reducers');
var Provider = require('react-redux').Provider;

var devTools = window.devToolsExtension ?
  window.devToolsExtension() : function(x) { return x }

var store = Redux.createStore(
  reducers,
  {},
  Redux.compose(
    Redux.applyMiddleware(reduxThunk),
    devTools
  )
);


var Index = require('./index');
var Issues = require('./issues');
var Issue = require('./issue');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ul>
          <li><IndexLink activeClassName="active" to="/">Home</IndexLink></li>
          <li><IndexLink activeClassName="active" to="/issues">All Issues</IndexLink></li>
        </ul>
        <div className="main">{ this.props.children }</div>
      </div>
    );
  }
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Index} />
        <Route path="issues" component={Issues}>
          <Route path=":id" component={Issue} />
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
