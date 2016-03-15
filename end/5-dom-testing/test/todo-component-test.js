var React = require('react');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');

var Todo = require('../src/todo');

function shallowRenderTodo(todo) {
  var fn = function() {};

  const renderer = TestUtils.createRenderer();
  renderer.render(<Todo todo={todo} deleteTodo={fn} doneChange={fn} />);
  return renderer.getRenderOutput();
}

test('Todo component', function(t) {
  t.test('rendering a not-done tweet', function(t) {
    var todo = { id: 1, name: 'Buy Milk', done: false };
    var result = shallowRenderTodo(todo);

    t.test('It renders the text of the todo', function(t) {
      t.plan(1);
      t.equal(result.props.children[0].props.children, 'Buy Milk');
    });

    t.test('it does not include the done-todo class', function(t) {
      t.plan(1);
      t.equal(result.props.className.indexOf('done-todo'), -1);
    });
  });

  t.test('rendering a done tweet', function(t) {
    var todo = { id: 1, name: 'Buy Milk', done: true };
    var result = shallowRenderTodo(todo);

    t.test('It includes the done-todo class', function(t) {
      t.plan(1);
      t.ok(result.props.className.indexOf('done-todo') > -1);
    });
  });
});
