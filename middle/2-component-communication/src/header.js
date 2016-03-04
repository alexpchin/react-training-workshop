var React = require('react');
var TodoForm = require('./todo-form');

var Header = React.createClass({
  render: function() {
    return (
      <div>
        <p>Totally awesome todo app</p>
        <TodoForm />
      </div>
    );
  }
});

module.exports = Header;
