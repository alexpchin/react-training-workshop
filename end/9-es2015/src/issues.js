import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from './actions';

import NewIssue from './new-issue';

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
        <NewIssue />
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
