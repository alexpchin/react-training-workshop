import React from 'react';
import { connect } from 'react-redux';
import { createNewIssue } from './actions';

class NewIssue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleValue: '',
      contentValue: '',
      userId: ''
    }

    this.titleChange = this.titleChange.bind(this);
    this.contentChange = this.contentChange.bind(this);
    this.userIdChange = this.userIdChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  titleChange(e) {
    this.setState({
      titleValue: e.target.value
    });
  }

  contentChange(e) {
    this.setState({
      contentValue: e.target.value
    });
  }

  userIdChange(e) {
    this.setState({
      userId: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const title = this.state.titleValue;
    const content = this.state.contentValue;
    const userId = this.state.userId;

    this.props.dispatch(createNewIssue(title, content, userId));

    this.setState({
      titleValue: '',
      contentValue: '',
      userId: ''
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h5>Create a new issue</h5>
        <div>
          <p>Title</p>
          <input type="text" value={this.state.titleValue} onChange={this.titleChange} />
        </div>
        <div>
          <p>Content</p>
          <textarea value={this.state.contentValue} onChange={this.contentChange} />
        </div>
        <div>
          <p>User ID</p>
          <input type="text" value={this.state.userId} onChange={this.userIdChange} />
        </div>
        <button type="submit">New Issue</button>
      </form>
    )
  }
}

const ConnectedNewIssue = connect(() => ({}))(NewIssue);

export default ConnectedNewIssue;
