var React = require('react');
var render = require('react-dom').render;

var Todos = require('./todos');

var App = React.createClass({
  render: function() {
    return (
      <div><Todos /></div>
    );
  }
});

render(
  <App />,
  document.getElementById('app')
);
