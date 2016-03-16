var React = require('react');

var Issues = React.createClass({
  render: function() {
    return (
      <p>View for issue number { this.props.params.id }</p>
    )
  }
});

module.exports = Issues;
