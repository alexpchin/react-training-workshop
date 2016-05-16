var React = require('react');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');

var Todos = require('../src/todos');

function shallowRender() {
  const renderer = TestUtils.createRenderer();
  renderer.render(<Todos />);
  return renderer.getRenderOutput();
}

test('Todos component', function(t) {
  t.test('it renders a list of Todos', function(t) {
    t.plan(1);
    var result = shallowRender();
    const todoChildren = result.props.children[2].props.children;
    t.equal(todoChildren.length, 3);
  });

  t.test('Deleting a todo', function(t) {
    t.plan(1);
    var result = TestUtils.renderIntoDocument(<Todos />);
    var firstDelete = TestUtils.scryRenderedDOMComponentsWithClass(result, 'delete-todo')[0];
    TestUtils.Simulate.click(firstDelete);

    var todos = TestUtils.scryRenderedDOMComponentsWithClass(result, 'todo');
    t.equal(todos.length, 2);
  });
});
