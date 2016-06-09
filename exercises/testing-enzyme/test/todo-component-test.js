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
  // come on Jack, write these!
});
