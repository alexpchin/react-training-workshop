var React = require('react');

var Home = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      formValue: ''
    };
  },
  onTextChange: function(e) {
    // update the state with the new text value
  },
  onSubmit: function(e) {
    // get the value of the form, submit it
    // and pass it to the router to transition to a new route
  },
  render: function() {
    return (
      <div>
        <p>Enter a username to find on GitHub</p>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.formValue} onChange={this.onTextChange} />
          <button type="submit">Go</button>
        </form>
      </div>
    );
  }
});

module.exports = Home;

