var React = require('react');
var connect = require('react-redux').connect;
var fetchUser = require('./actions').fetchUser;

var UsernameInput = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.dispatch(fetchUser(this.refs.userInput.value));
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="userInput" />
        <button type="submit">Fetch User</button>
      </form>
    );
  }
});

var ConnectedInput = connect()(UsernameInput);

module.exports = ConnectedInput;
