var combineReducers = require('redux').combineReducers;

var users = function(state, action) {
  if (!state) state = [];

  switch (action.type) {

    default:
      return state;
  }
}

var issues = function(state, action) {
  if (!state) state = [];

  switch (action.type) {
    case 'RECEIVE_ISSUES':
      return Object.assign({}, state, {
        issues: action.issues
      });

    default:
      return state
  }
}

var reducer = combineReducers({
  issues: issues,
  users: users
});

module.exports = reducer;
