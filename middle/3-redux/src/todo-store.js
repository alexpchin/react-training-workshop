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

  onChange: function() {}
}

module.exports = TodoStore;
