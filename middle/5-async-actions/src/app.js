var React = require('react');
var ReactDOM = require('react-dom');

var Redux = require('redux');
// this is because redux-thunk ships as ES2015 module by default
var thunkMiddleware = require('redux-thunk').default;

var ReactRedux = require('react-redux');
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

var githubReducers = require('./reducers');
var UsernameInput = require('./username-input');

var devTools = window.devToolsExtension ? window.devToolsExtension() : function(x) { return x };


var store = Redux.createStore(
  githubReducers
);

var App = React.createClass({
  render: function() {
    return (
      <div>
        <UsernameInput />
      </div>
    );
  }
});

var ConnectedApp = connect(function(state) {
  return {
    activeUser: state.activeUser,
    users: state.users
  };
})(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('app')
)
