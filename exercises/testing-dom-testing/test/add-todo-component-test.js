require('./setup');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');

var AddTodo = require('../src/add-todo');

test('Add Todo component', function(t) {
  t.test('it calls the given callback prop with the new text from the form', function(t) {
    t.plan(1);

    var todoCallback = function(todo) {
      t.equal(todo.name, 'Buy Milk');
    };

    var form = TestUtils.renderIntoDocument(
      <AddTodo onNewTodo={todoCallback} />
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
    input.value = 'Buy Milk';

    var button = TestUtils.findRenderedDOMComponentWithTag(form, 'button');
    TestUtils.Simulate.click(button);
  });
});
