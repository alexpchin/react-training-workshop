var React = require('react');
var TodoForm = require('./todo-form');
var connect = require('react-redux').connect;

var logIn = require('./actions').logIn;

var Header = React.createClass({

  logInClick: function() {
    this.props.dispatch(logIn('jack'));
  },

  renderLoggedInBanner(username) {
    return <p>Logged in as {username}</p>;
  },

  renderLogInButton() {
    return <button onClick={this.logInClick}>Log In</button>;
  },

  render: function() {
    var user = this.props.user;

    return (
      <div>
        { user.username && this.renderLoggedInBanner(user.username) }
        { !user.username && this.renderLogInButton() }
        <p>Totally awesome todo app</p>
        <TodoForm />
      </div>
    );
  }
});

var ConnectedHeader = connect(function(state) {
  return { user: state.user };
})(Header);

module.exports = ConnectedHeader;
