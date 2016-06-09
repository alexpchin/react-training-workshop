var React = require('react');

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="todoInput" />
        <button type="submit">Create</button>
      </form>
    );
  }
});

module.exports = TodoForm;
