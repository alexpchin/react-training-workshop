var React = require('react');
var Link = require('react-router').Link;
var connect = require('react-redux').connect;
var actions = require('./actions');

var Issues = React.createClass({
  componentDidMount: function() {
    this.props.dispatch(actions.fetchIssues());
  },
  render: function() {
    return (
      <div className="issues">
        <p>You could show a list of all the issues here, and then have a link that allows you to go and view an individual issue.</p>
        <p>Issues: <code>{ JSON.stringify(this.props.issues) }</code></p>
      </div>
    )
  }
});

var ConnectedIssues = connect(function(state) {
  return {
    issues: state.issues
  }
})(Issues);

module.exports = ConnectedIssues;
