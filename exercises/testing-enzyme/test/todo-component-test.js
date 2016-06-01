require('./setup');

var enzyme = require('enzyme');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');

var Todo = require('../src/todo');

function shallowRenderTodo(todo) {
  var fn = function() {};
  return enzyme.shallow(<Todo todo={todo} deleteTodo={fn} doneChange={fn} />);
}

test('Todo component', function(t) {
  t.test('rendering a not-done tweet', function(t) {
    var todo = { id: 1, name: 'Buy Milk', done: false };
    var result = shallowRenderTodo(todo);

    t.test('It renders the text of the todo', function(t) {
      t.plan(1);
      t.equal(result.find('p').text(), 'Buy Milk');
    });

    t.test('it does not include the done-todo class', function(t) {
      t.plan(1);
      t.equal(result.hasClass('done-todo'), false);
    });
  });

  t.test('rendering a done tweet', function(t) {
    var todo = { id: 1, name: 'Buy Milk', done: true };
    var result = shallowRenderTodo(todo);

    t.test('It includes the done-todo class', function(t) {
      t.plan(1);
      t.ok(result.hasClass('done-todo'));
    });
  });

  t.test('toggling a TODO calls the given function', function(t) {
    t.plan(1);
    var doneCallback = function(id) { t.equal(id, 1) };
    var todo = { id: 1, name: 'Buy Milk', done: false };

    var result = enzyme.mount(
      <Todo todo={todo} doneChange={doneCallback} deleteTodo={function() {}} />
    );

    result.find('p').simulate('click');
  });
});
