var React = require('react');
var connect = require('react-redux').connect;
var actions = require('./actions');

var Issue = React.createClass({
  propTypes: {
    issue: React.PropTypes.object.isRequired
  },
  renderIssue: function(issue) {
    return (
      <div>
        <h2>{issue.title}</h2>
      </div>
    );
  },
  render: function() {
    if (this.props.issue) {
      return this.renderIssue(this.props.issue);
    } else {
      return <p>Loading Issue</p>;
    }
  }
});

var ConnectedIssue = connect(function(state, ownProps) {
  return {
    issue: state.issues.find(function(issue) {
      return issue.id === +ownProps.params.id;
    }) || {}
  }
})(Issue);

module.exports = ConnectedIssue;
