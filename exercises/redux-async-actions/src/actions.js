var actions = {
  requestGithub: function(username) {
    return {
      type: 'GITHUB_REQUEST',
      username: username
    }
  },

  receiveGithub: function(username, json) {
    return {
      type: 'GITHUB_RESPONSE',
      username: username,
      data: json
    }
  },

  fetchUser: function(username) {
    // this is what make a thunk creator different
    // it returns a function that will be called with the dispatch method from redux
    // so it can dispatch multiple actions
    return function(dispatch) {
      // first, dispatch the GITHUB_REQUEST action
      dispatch(actions.requestGithub(username));

      return fetch('https://api.github.com/users/' + username)
        .then(function(resp) { return resp.json() })
        .then(function(json) {
          dispatch(actions.receiveGithub(username, json));
        });
      // in a real app we would deal with an error
    }
  }
};

module.exports = actions;
