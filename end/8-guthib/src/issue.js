var React = require('react');
var connect = require('react-redux').connect;

var Issue = React.createClass({
  render: function() {
    var issue = this.props.issue;

    return (
      <h1>{ this.props.issue.title }</h1>
    )
  }
});

var ConnectedIssue = connect(function(state, ownProps) {
  // note that the connect CB function can take ownProps
  // which enables us to give a component access to only a very specific
  // part of the state, depending on the props from react router
  return {
    issue: state.issues.find(function(issue) {
      return issue.id === +ownProps.params.id
    }) || {}
  }
})(Issue);
module.exports = ConnectedIssue;
