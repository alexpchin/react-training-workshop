var actions = {
  fetchIssues: function() {
    return function(dispatch) {
      dispatch(actions.requestIssues());

      return fetch('http://localhost:3002/issues')
        .then(function(r) { return r.json() })
        .then(function(issues) {
          dispatch(actions.receiveIssues(issues));
        });
    }
  },
  requestIssues: function() {
    // although we're not doing so in this app
    // you would probably act upon this by updating the state with loading: true
    // and show a spinner or something similar
    return {
      type: 'REQUEST_ISSUES'
    }
  },
  receiveIssues: function(issues) {
    return {
      type: 'RECEIVE_ISSUES',
      issues: issues
    }
  },
  createNewIssue: function(title, content, userId) {
    return function(dispatch) {
      return fetch('http://localhost:3002/issues', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          content: content,
          userId: userId
        })
      }).then(function(r) {
        return r.json();
      }).then(function(newIssue) {
        dispatch(actions.newIssue(newIssue));
      });
    }
  },
  newIssue: function(issue) {
    return {
      type: 'RECEIVE_ISSUE',
      issue: issue
    }
  }
};

module.exports = actions;
