/** how our state will look
{
  activeUser: 'jackfranklin',
  users: {
    jackfranklin: {
      isFetching: false,
      data: {...github response...}
    }
  }
}
 **/
var combineReducers = require('redux').combineReducers;

var activeUser = function(state, action) {
}

var users = function(state, action) {
}

var githubReducer = combineReducers({
  activeUser: activeUser,
  users: users
})

module.exports = githubReducer;
