var todoReducer = function(state, action) {
  if (!state) state = { todos: [] };

  switch (action.type) {
    case 'ADD_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.concat([action.todo])
      });
    }

    default:
      return state
  }
}

module.exports = todoReducer;
