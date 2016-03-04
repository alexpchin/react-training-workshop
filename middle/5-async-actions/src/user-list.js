var React = require('react');
var connect = require('react-redux').connect;
var newActiveUser = require('./actions').newActiveUser;

var UserList = React.createClass({
  userClick: function(username) {
    this.props.dispatch(newActiveUser(username));
  },

  renderUsers: function() {
    return this.props.usernames.map(function(user) {
      return (
        <li key={user} onClick={this.userClick.bind(this, user)}>
          {user}
        </li>
      );
    }, this);
  },

  render: function() {
    return (
      <ul>
        { this.renderUsers() }
      </ul>
    );
  }
});

var ConnectedUserList = connect()(UserList);

module.exports = ConnectedUserList;
