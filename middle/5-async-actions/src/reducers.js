var combineReducers = require('redux').combineReducers;

var activeUser = function(state, action) {
  if (!state) {
    state = '';
  }

  switch (action.type) {
    case 'GITHUB_RESPONSE':
      return action.username;
    default:
      return state;
  }
}

var users = function(state, action) {
  if (!state) {
    state = {};
  }

  switch (action.type) {
    case 'GITHUB_REQUEST':
      var newUserObj = {}
      newUserObj[action.username] = {
        isFetching: true,
        data: {}
      }

      return Object.assign({}, state, newUserObj);

    case 'GITHUB_RESPONSE':
      var newState = {};
      newState[action.username] = {
        isFetching: false,
        data: action.data
      }

      return Object.assign({}, state, newState);

    default:
      return state;
  }
}

var githubReducer = combineReducers({
  activeUser: activeUser,
  users: users
})

module.exports = githubReducer;
