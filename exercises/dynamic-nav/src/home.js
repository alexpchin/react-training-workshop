var withRouter = require('react-router').withRouter
var React = require('react');

var Home = React.createClass({
  getInitialState: function() {
    return {
      formValue: ''
    };
  },
  onTextChange: function(e) {
    // update the state with the new text value
  },
  onSubmit: function(e) {
    e.preventDefault();
    // get the value of the form, submit it
    // and pass it to the router to transition to a new route
    // tip: this.props.router.push!
    console.log(this.props.router);
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

module.exports = withRouter(Home);

