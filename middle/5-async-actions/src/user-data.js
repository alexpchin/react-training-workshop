var React = require('react');
var connect = require('react-redux').connect;
var UserList = require('./user-list');

var UserData = React.createClass({
  render: function() {
    var userObj = this.props.users[this.props.activeUser];
    return (
      <div>
        <UserList usernames={Object.keys(this.props.users)} />
        <p>Current user: { this.props.activeUser }</p>
        { userObj && userObj.data.public_repos }
      </div>
    )
  }
});

var ConnectedUserData = connect(function(state) {
  return {
    activeUser: state.activeUser,
    users: state.users
  }
})(UserData);

module.exports = ConnectedUserData;
