var actions = {
  addTodo: function(todo) {
    return {
      type: 'ADD_TODO',
      todo: todo
    }
  },
  logIn: function(username) {
    return {
      type: 'USER_LOGIN',
      username: username
    }
  }
};

module.exports = actions;
