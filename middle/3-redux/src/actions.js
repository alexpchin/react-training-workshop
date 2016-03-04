var actions = {
  addTodo: function(todo) {
    return {
      type: 'ADD_TODO',
      todo: todo
    }
  }
};

module.exports = actions;
