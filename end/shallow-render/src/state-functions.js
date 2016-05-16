exports.toggleDone = function toggleDone(state, id) {
  var todos = state.todos.map(function(todo) {
    if (todo.id === id) {
      todo.done = !todo.done;
    }

    return todo;
  });

  return { todos: todos };
};

exports.addTodo = function addTodo(state, todo) {
  var lastTodo = state.todos[state.todos.length - 1];
  todo.id = lastTodo.id + 1;
  todo.done = false;

  return {
    todos: state.todos.concat([todo])
  };
};

exports.deleteTodo = function deleteTodo(state, id) {
  return {
    todos: state.todos.filter(function (todo) {
      return todo.id !== id;
    })
  };
};
