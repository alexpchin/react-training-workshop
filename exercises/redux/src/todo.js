var React = require('react');

var Todo = React.createClass({
  render: function() {
    return (
      <div>
        <p>{ todo }</p>
      </div>
    )
  }
});

module.exports = Todo;
