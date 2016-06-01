var React = require('react');
var Link = require('react-router').Link;

module.exports = React.createClass({
  displayName: 'app',
  render: function() {
    return (
      <div>
        <h2>Welcome to my App</h2>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/about'>About</Link></li>
        </ul>
        { this.props.children }
      </div>
    );
  }
});
