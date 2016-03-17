import React from 'react';
import ReactDOM from 'react-dom';

import {
  Router,
  Route,
  Link,
  IndexLink,
  IndexRoute,
  hashHistory
} from 'react-router';

import reduxThunk from 'redux-thunk';

import reducers from './reducers';

import {
  createStore,
  compose,
  applyMiddleware
} from 'redux';

import { Provider } from 'react-redux';

const devTools = window.devToolsExtension ?  window.devToolsExtension() : x => x;

const store = createStore(reducers, {}, compose(applyMiddleware(reduxThunk), devTools));

import Index from './index';
import Issues from './issues';
import Issue from './issue';

var App = React.createClass({
  render() {
    return (
      <div>
        <ul>
          <li><IndexLink activeClassName="active" to="/">Home</IndexLink></li>
          <li><IndexLink activeClassName="active" to="/issues">All Issues</IndexLink></li>
        </ul>
        <hr />
        <div className="main">{ this.props.children }</div>
      </div>
    );
  }
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Index} />
        <Route path="issues" component={Issues}>
          <Route path=":id" component={Issue} />
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
