var actions = {
  fetchIssues: function() {
    return function(dispatch, getState) {
      var issues = getState().issues;

      // if we already have issues in the state, no need to do anything
      if (Object.keys(issues).length > 0) {
        return;
      }

      dispatch(actions.requestIssues());

      return fetch('http://localhost:3002/issues')
        .then(function(r) { return r.json() })
        .then(function(issues) {
          console.log('got issues', issues);
          dispatch(actions.receiveIssues(issues));
        });
    }
  },
  requestIssues: function() {
    return {
      type: 'REQUEST_ISSUES'
    }
  },
  receiveIssues: function(issues) {
    return {
      type: 'RECEIVE_ISSUES',
      issues: issues
    }
  }
};

module.exports = actions;
