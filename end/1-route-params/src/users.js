var React = require('react');

var Users = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    this.fetchUser(this.props.params.username);
  },
  componentWillReceiveProps: function(newProps) {
    if (!newProps || !newProps.params || !newProps.params.username) {
      return;
    }

    var newName = newProps.params.username;
    var oldName = this.props.params.username;

    if (oldName !== newName) {
      this.setState({ user: undefined });
      this.fetchUser(newName);
    }
  },
  fetchUser: function(username) {
    fetch('https://api.github.com/users/' + username).then(function(data) {
      return data.json();
    }).then(function(data) {
      this.setState({ user: data });
    }.bind(this));
  },
  render: function() {
    if (this.state.user) {
      return (
        <p>Repositories count: {this.state.user.public_repos}</p>
      );
    } else {
      return <p>Loading</p>;
    }
  }
});

module.exports = Users;
