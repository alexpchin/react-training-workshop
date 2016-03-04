var React = require('react');
var ReactDOM = require('react-dom');

var Redux = require('redux');

var ReactRedux = require('react-redux');
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

var githubReducers = require('./reducers');
var UsernameInput = require('./username-input');

var store = Redux.createStore(
  githubReducers,
  window.devToolsExtension ? window.devToolsExtension() : function(x) { return x }
);

var App = React.createClass({
  render: function() {
    return (
      <div>
        <UsernameInput />
        <p>List data here...</p>
      </div>
    );
  }
});

var ConnectedApp = connect(function(state) {
  return {
    userData: state.userData
  };
})(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('app')
)
