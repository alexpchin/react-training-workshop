var React = require('react');

var connect = require('react-redux').connect;
var actions = require('./actions');

var NewIssue = React.createClass({
  getInitialState: function() {
    return {
      titleValue: '',
      contentValue: '',
      userId: ''
    }
  },
  titleChange: function(e) {
    this.setState({
      titleValue: e.target.value
    });
  },
  contentChange: function(e) {
    this.setState({
      contentValue: e.target.value
    });
  },
  userIdChange: function(e) {
    this.setState({
      userId: e.target.value
    });
  },
  onSubmit: function(e) {
    e.preventDefault();
    var title = this.state.titleValue;
    var content = this.state.contentValue;
    var userId = this.state.userId;

    this.props.dispatch(actions.createNewIssue(title, content, userId));

    this.setState(this.getInitialState());
  },
  render: function() {
    return (
      <form onSubmit={this.onSubmit}>
        <h5>Create a new issue</h5>
        <div>
          <p>Title</p>
          <input type="text" value={this.state.titleValue} onChange={this.titleChange} />
        </div>
        <div>
          <p>Content</p>
          <textarea value={this.state.contentValue} onChange={this.contentChange} />
        </div>
        <div>
          <p>User ID</p>
          <input type="text" value={this.state.userId} onChange={this.userIdChange} />
        </div>
        <button type="submit">New Issue</button>
      </form>
    )
  }
});

var ConnectedNewIssue = connect(function(state) {
  return {};
})(NewIssue);

module.exports = ConnectedNewIssue;
