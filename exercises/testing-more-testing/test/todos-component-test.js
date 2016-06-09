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
  });

  t.test('Deleting a todo', function(t) {
  });
});
