var React = require('react');
var connect = require('react-redux').connect;
var fetchUser = require('./actions').fetchUser;

var UsernameInput = React.createClass({
  handleSubmit: function(e) {
  },

  render: function() {
    return <p>Hello WOrld</p>
  }
});

var ConnectedInput = connect()(UsernameInput);

module.exports = ConnectedInput;
