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
    this.setState({
      formValue: e.target.value
    });
  },
  onSubmit: function(e) {
    e.preventDefault();
    var name = this.state.formValue;

    var path = '/users/' + name;

    this.context.router.push(path);
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

