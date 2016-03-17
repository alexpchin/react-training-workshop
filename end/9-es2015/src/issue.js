import React from 'react';
import { connect } from 'react-redux'

class Issue extends React.Component {
  renderIssue(issue) {
    return (
      <div className="issue">
        <h2>{issue.title}</h2>
        <div>
          <p>{ issue.content }</p>
        </div>
        <p>User Id: { issue.userId }</p>
      </div>
    );
  }

  render() {
    if (this.props.issue) {
      return this.renderIssue(this.props.issue);
    } else {
      return <p>Loading Issue</p>;
    }
  }
};

Issue.propTypes = {
  issue: React.PropTypes.object.isRequired
};

const ConnectedIssue = connect((state, ownProps) => {
  return {
    issue: state.issues.find((issue) => {
      return issue.id === +ownProps.params.id;
    }) || {}
  }
})(Issue);

export default ConnectedIssue;
