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
  }
};

module.exports = actions;
