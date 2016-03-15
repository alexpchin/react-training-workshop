var test = require('tape');

var stateFunctions = require('../src/state-functions');

test('toggleDone', function(t) {
  t.test('it updates the todo with the ID to be done', function(t) {
    t.plan(1);
    var state = {
      todos: [{ id: 1, done: false }]
    };
    var newState = stateFunctions.toggleDone(state, 1);
    t.deepEqual(newState.todos, [
      { id: 1, done: false }
    ]);
  });
});
