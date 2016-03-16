var React = require('react');
var Link = require('react-router').Link;
var connect = require('react-redux').connect;
var actions = require('./actions');

var Issues = React.createClass({
  propTypes: {
    issues: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    dispatch: React.PropTypes.func.isRequired
  },
  componentDidMount: function() {
    this.props.dispatch(actions.fetchIssues());
  },
  renderIssueLinks: function() {
    return this.props.issues.map(function(issue) {
      return (
        <li key={issue.id}>
          <Link to={"/issues/" + issue.id}>{issue.title}</Link>
        </li>
      );
    });
  },
  render: function() {
    return (
      <div className="issues">
        <p>All the issues are below</p>
        <ul>{this.renderIssueLinks()}</ul>
        { this.props.children }
      </div>
    )
  }
});

var ConnectedIssues = connect(function(state) {
  return {
    issues: state.issues
  }
})(Issues);

module.exports = ConnectedIssues;
