var stateFunctions = require('../src/state-functions');

var test = require('tape');

test('Toggle done toggles the todo', function(t) {
  t.plan(1);
  var state = {
    todos: [ { id: 1, done: false } ]
  };
  var newState = stateFunctions.toggleDone(state, 2);
  t.deepEqual(newState.todos, {
    id: 1,
    done: true
  });
});
