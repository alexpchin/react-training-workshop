// this is what our state object looks like
// {
//   activeUser: 'jackfranklin',
//   users: {
//     jackfranklin: {
//       isFetching: false,
//       data: {...github response...}
//     }
//   }
// }

var combineReducers = require('redux').combineReducers;

var activeUser = function(state, action) {
  if (!state) {
    state = '';
  }

  switch (action.type) {
    default:
      return state;
  }
}

var users = function(state, action) {
  if (!state) {
    state = {};
  }

  switch (action.type) {
    default:
      return state;
  }
}

var githubReducer = combineReducers({
  activeUser: activeUser,
  users: users
})

module.exports = githubReducer;
