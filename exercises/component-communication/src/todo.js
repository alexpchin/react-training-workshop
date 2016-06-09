var React = require('react');

var Todo = React.createClass({
  render: function() {
    return (
      <div>
        <p>TODO: { this.props.todo }</p>
      </div>
    )
  }
});

module.exports = Todo
