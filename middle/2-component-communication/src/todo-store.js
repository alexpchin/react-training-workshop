var TodoStore = {
  _state: {
    todos: []
  },

  getState: function() {
    return this._state;
  },

  addTodo: function(todo) {
    this._state.todos.push(todo);
    this.onChange();
  },

  deleteTodo: function(todo) {
    this._state.todos = this._state.todos.filter(function(t) {
      return t !== todo;
    });

    this.onChange();
  },

  onChange: function() {}
}

module.exports = TodoStore;
