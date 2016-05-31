var combineReducers = require('redux').combineReducers;

var todos = function(state, action) {
  if (!state) state = [];

  switch (action.type) {
    case 'ADD_TODO': {
      return state.concat([action.todo]);
    }

    default:
      return state;
  }
}

var user = function(state, action) {
  if (!state) state = {};

  switch (action.type) {
    case 'USER_LOGIN': {
      return { username: action.username }
    }

    default:
      return state
  }
}

var todoReducer = combineReducers({
  todos: todos,
  user: user
});

module.exports = todoReducer;
