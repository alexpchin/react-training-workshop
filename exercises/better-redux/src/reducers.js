var todoReducer = function(state, action) {
  if (!state) state = {
    todos: [],
    user: {}
  };

  switch (action.type) {
    case 'ADD_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.concat([action.todo])
      });
    }

    case 'USER_LOGIN': {
      return Object.assign({}, state, {
        user: { username: action.username }
      });
    }

    default:
      return state
  }
};

module.exports = todoReducer;
