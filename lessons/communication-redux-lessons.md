## component-communication

(This example is largely taken from https://github.com/ryanflorence/react-training/blob/gh-pages/lessons/04-less-simple-communication.md and tweaked slighty).

Let's dive back into component communication, which we tackled briefly earlier.

First note how in this example we have `TodoForm` in its own file that we import into `App.js`.

Passing a function as a prop works great for one level, or even two at most, but it quickly becomes very frustrating and cumbersome to pass these functions down a lot.

Say we suddenly create another component that contains the `TodoForm`. Perhaps it's called `Header` and contains a bunch of other stuff along with the todo form (the specifics don't matter here!). The code for this example works but is cumbersome. Note how we have to pass `onCreate` into `Header`, and then into `TodoForm`. This gets boring very quickly! Imagine if you changed the hierarchy of your app, it would be such a pain to keep doing this.

### actions and stores

At this point we're now dealing with actions. An action is anything a user can do in the system, such as add a new todo. We can create a new `TodoActions` module to hold these. Note how we're just writing plain JavaScript objects here - this is one of the main benefits of React. We don't have to worry about services, factories or anything, we can just write POJOs!

```js
var TodoActions = {
  addTodo: function(todo) {
    // ???
  }
};

module.exports = TodoActions;
```

And then we can dive right into `TodoForm` and use it. Also I'll remove the passing of the `onCreate` prop through the components, it's not required now.

```js
var React = require('react');
var TodoActions = require('./todo-actions');

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    TodoActions.addTodo(this.refs.todoInput.value);
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
```

### Stores

Now we can create a store, which is just an object that holds on to your data.

```js
var TodoStore = {
  _state: {
    todos: []
  },

  getState: function() {
    return this._state;
  },

  addTodo: function(todo) {
    this._state.todos.push(todo);
    this.onChange();
  },
}

module.exports = TodoStore;
```

Any component that wants to listen can define `TodoStore.onChange()` to be notified of the changes.

Now our action can just call into this store:

```
var TodoStore = require('./todo-store');

var TodoActions = {
  addTodo: function(todo) {
    TodoStore.addTodo(todo);
  }
};

module.exports = TodoActions;
```

And finally we need to hoook `App` up to be notified when the store is notified:

```js
var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./header');
var TodoStore = require('./todo-store');

var App = React.createClass({
  getStateFromStore: function() {
    return TodoStore.getState();
  },

  getInitialState: function() {
    return this.getStateFromStore();
  },

  onChange: function() {
    this.setState(this.getStateFromStore());
  },

  componentDidMount: function() {
    TodoStore.onChange = this.onChange;
  },

  renderTodos: function() {
    return this.state.todos.map(function(todo) {
      return <p key={todo}>{todo}</p>;
    });
  },

  render: function() {
    return (
      <div>
        <Header />
        { this.renderTodos() }
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
```

If you think this feels like Flux or Redux, you'd be right! We're missing a few bits and the structure isn't quite right - ideally an action wouldn't directly talk to the store, but instead send it to a dispatcher that would then send it onto the store, such that actions and the store are kept entirely separate. We'll tackle this section next with an Redux example.

__Exercise__: with the code as it is, can you add a 'Delete' button to each todo that when clicked will cause the todo to be removed from the store?

- add an action
- add a delete button to the `Todo` component
- make the delete button send an action
- add a new store method that can delete a todo


## redux-intro

Before we look at Redux with React, let's do a basic Redux example on its own. This will help gain some familiarity with Redux without having to deal with the React specific parts.

Credit for this example goes to the [Redux README](http://redux.js.org/index.html).

First, I'll install Redux:

```
npm install redux --save
```

The key parts of redux to note:
- your entire app's state is stored in a single object that is called the _store_.
- to change a state you emit an action, an object describing what happened.
- _reducers_ take an action and produce the new state.

Let's build out a simple counter example.

First we define our app as a _reducer_. This takes the current state and the action. Each action has a `type` property to describe it.

The reducer is expected to return the new state based on the existing state and the given user action.

```js
function counter(state, action) {
  if (!state) state = 0;

  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}
```

We then use Redux's `createStore` to create the store, which will hold our application's state. We send actions to the store, and it will create the new state by sending those actions to our reducer.

```js
var store = createStore(counter);

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
store.dispatch({ type: 'INCREMENT' });
console.log('Current store', store.getState());
```

We then `dispatch` actions and log out the current state. And that's it! That's Redux is a nutshell.

__Exercise__: add a new action `RESET` that will set the counter back to 0.


## redux

Now let's look at using [Redux](http://redux.js.org/index.html)  rather than implementing ourselves.

PS: take a deep breath! Redux at first can be confusing and quite tricky to set up, but once you get set up it's then much easier to deal with user actions and data changing. The overhead at first pays off hugely :)

### Key Terminology:

- `Actions`, which are user interactions (add todo, delete todo, etc). We create these actions in response to user input.
- `Reducers`, these take a user action and the current state, and return the new state. They effectively progress the state based on the user's action.
- `Store`, which is the store that holds all our data
- `dispatch` - the function you call to dispatch a user action

Additionally, we then have some extra React-Redux terms:

- `connect`, a function used to hook a React component up to the React Redux system. Any component that needs to interact with the store (either to get data, or dispatch actions) must be explicitly connected to it. This is a good thing because you can't accidentally have any random component talking to the store without you first allowing them to.
- `Provider` this component provided by React-Redux hooks up the store to your app. You typically wrap your most top level component in this component, and that's it.

### Actions

We start by defining our actions in `./actions.js`. In a larger app you would split this into multiple files for different categories of action, but for now we'll leave it in one. We only have one action:

```js
var actions = {
  addTodo: function(todo) {
    return {
      type: 'ADD_TODO',
      todo: todo
    }
  }
};

module.exports = actions;
```

Each action must have a `type` property, and then any other information you need. In our case it's just the text of the todo.

### Reducers

Next let's write the reducer function. This takes the state and an action and returns the new state. It must also deal with no state (eg, defining the initial state):

```js
var todoReducer = function(state, action) {
  if (!state) state = { todos: [] };

  switch (action.type) {
    case 'ADD_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.concat([action.todo])
      });
    }

    default:
      return state
  }
}

module.exports = todoReducer;
```

A reducer should __never__ modifiy the state, but always return a new one, hence the use of `Object.assign`.

Now we'll work through our components from the top down. First, `App.js`:

```js
var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var ReactRedux = require('react-redux');
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;
var todoAppReducers = require('./reducers');
var Header = require('./header');
var store = Redux.createStore(todoAppReducers);

var App = React.createClass({
  renderTodos: function() {
    return this.props.todos.map(function(todo) {
      return <p key={todo}>{todo}</p>;
    });
  },

  render: function() {
    return (
      <div>
        <Header />
        { this.renderTodos() }
      </div>
    );
  }
});

var ConnectedApp = connect(function(state) {
  return {
    todos: state.todos
  };
})(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('app')
)
```

Note:

- we use `createStore` to create a store, which takes the reducer function as its argument
- we use the `connect` function to connect our `App` component up to the store. The function we give returns the object of properties from the store that component is allowed. In our case we say that `App` is only allowed access to the `todos` property in the state.
- we wrap the component in `Provider` when we render, which attaches our React components and the store together so we can `connect` them.
- We don't have `todos` on the state now, but they are provided to the app as props, so when rendering we use `this.props.todos`.
- I've also got rid of all the `onCreate` and stuff from the previous example. It's dead :)

Next we can go to `TodoForm`:

```js
var React = require('react');
var connect = require('react-redux').connect;

var TodoActions = require('./todo-actions');
var addTodo = require('./actions').addTodo;

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.dispatch(addTodo(this.refs.todoInput.value));
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

var ConnectedTodoForm = connect()(TodoForm);

module.exports = ConnectedTodoForm;
```

Notice:

- We connect the `TodoForm` - we need to do this so the `TodoForm` is provided with `this.props.dispatch`, which it uses to dispatch a user action.
- To dispatch an action we pass it to `this.props.dispatch`, and call the `addTodo` action with the text of the todo.
- `TodoForm` doesn't know that the store exists at all, which is great!

And with that we have todos being created through Redux!

The pattern is as follows:

1. A component triggers a user action with `this.props.dispatch(...)`.
2. Redux calls your reducer function with the current state and the user action.
3. When the reducer returns the new state, Redux updates the props given to the components and in doing so causes React to rerender.

__Exercise__: Add the ability to delete a todo, but this time using Redux. You'll need to:

- create a new action

- update the reducer

- hook the existing `Todo` component up so it can dispatch actions

- Have a button that dispatches the new action type.

https://github.com/jackfranklin/react-training-workshop/commit/67a0ff1ae2c976ecc00d05c51393d4708d5d250e

## better-redux

As your app grows you'll want to split your reducers up a little to make them easier to work with. Additionally, you'll probably want some handy developer tools!

Redux ships with developer tools that you can integrate into your project.

If you're using Google Chrome, you can use the [Redux Devtools Extension](https://github.com/zalmoxisus/redux-devtools-extension). You just need to update your `createStore` call:

```js
var store = Redux.createStore(
  todoAppReducers,
  window.devToolsExtension ? window.devToolsExtension() : undefined
);
```

And then you have dev tools available!

If you're not on Chrome, you can [set it up manually with a bit more effort](https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md). We won't go through this in the workshop, but I'll leave it as an exercise to the reader :)

### More reducers

Our current state only contains `todos`, but in reality you're probably going to have more data to deal with. To fake this we're going to store a `user` object on our state to represent the logged in user, imagining in reality there's a full authentication system backing this.


First, let's update our reducer to deal with this new `user` key in our state:

```js
var todoReducer = function(state, action) {
  if (!state) state = {
    todos: [],
    user: {}
  };
  ...
}
```

And let's define an action to log the user in:

```js
logIn: function(username) {
  return {
    type: 'USER_LOGIN',
    username: username
  }
}
```

And lets update `<Header />` to have a button to log a user in - we'll also use `connect` so it has access to the `user` from the state.

```js
var React = require('react');
var TodoForm = require('./todo-form');
var connect = require('react-redux').connect;

var logIn = require('./actions').logIn;

var Header = React.createClass({

  logInClick: function() {
    this.props.dispatch(logIn('jack'));
  },

  renderLoggedInBanner(username) {
    return <p>Logged in as {username}</p>;
  },

  renderLogInButton() {
    return <button onClick={this.logInClick}>Log In</button>;
  },

  render: function() {
    var user = this.props.user;

    return (
      <div>
        { user.username && this.renderLoggedInBanner(user.username) }
        { !user.username && this.renderLogInButton() }
        <p>Totally awesome todo app</p>
        <TodoForm />
      </div>
    );
  }
});

var ConnectedHeader = connect(function(state) {
  return { user: state.user };
})(Header);

module.exports = ConnectedHeader;
```

I've hard coded the username to 'jack' just to save time and space on code.

Finally, we need our reducer to deal with this action happening.

```js
case 'USER_LOGIN': {
  return Object.assign({}, state, {
    user: { username: action.username }
  });
}
```

And now we can log a user in.

### combineReducers

If you take a look at our reducer, it's a bit of a mess. It deals with reducing either a list of todos, or a user object:

```
var todoReducer = function(state, action) {
  if (!state) state = {
    todos: [],
    user: {}
  };

  switch (action.type) {
    case 'ADD_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.concat([action.todo])
      });
    }

    case 'USER_LOGIN': {
      return Object.assign({}, state, {
        user: { username: action.username }
      });
    }

    default:
      return state
  }
}

module.exports = todoReducer;
```

It would be best instead to split the reducer into two functions, one that can reduce todos, and one that can reduce user actions.

__Exercise__: before continuing with this, have a think about how you might split up `todoReducer`.

First, we'll write a `todos` function that can reduce todos:

```js
var todos = function(state, action) {
  if (!state) state = [];

  switch (action.type) {
    case 'ADD_TODO': {
      return state.concat([action.todo]);
    }

    default:
      return state;
  }
}
```

Note that this reducer doesn't get the full state, but instead just an array of todos. This is much better! We can do the same with the users to create a `user` reducer:

```js
var user = function(state, action) {
  if (!state) state = {};

  switch (action.type) {
    case 'USER_LOGIN': {
      return { username: action.username }
    }

    default:
      return state
  }
}
```

And now finally, our `todoReducer` can just defer its actions to the two smaller reducers:

```js
var todoReducer = function(state, action) {
  if (!state) state = {};

  return {
    user: user(state.user, action),
    todos: todos(state.todos, action)
  }
}
```

Now our main reducer is much nicer, and we have a bunch of smaller functions to deal with, which are also easier to test (we'll look at testing later!).

It turns out that this is such a useful, common pattern that Redux provides `combineReducers` to do just this.


```
var combineReducers = require('redux').combineReducers;

var todoReducer = combineReducers({
  todos: todos,
  user: user
});
```

Here we map each key in our `state` object to a reducer that is responsible for dealing with just that part of the state. This is a cleaner separation of concerns, and much nicer to work with.

__Exercise__: add a button to let me log out when I'm logged in. It should only appear when the user is logged in.

## redux-async-actions

So far we've only dealt with actions that are synchronous. Normally though we will have some form of async action, the most common of which being an HTTP request to fetch some data.

This part of the guide is heavily inspired by the [async actions](http://redux.js.org/docs/advanced/AsyncActions.html) part of the Redux docs.

Let's build an app that gets some data from the GitHub API for a specific user. We'll need a text box first to get the username we want to fetch data for. We'll use Redux to store a list of all the users that we have fetched and store them in state.

If you're following along here, you will want to check out `middle-5-starter-branch` for the starting point.

When we have an async action we need to have multiple events for them:

- one to notify that the request has started
- one to notify that the request was successful
- one to noify that the request failed

In our case we'll pretend we live in a lovely world where no HTTP requests ever fail, and ignore the failure case. Don't do this in a real app!

Let's define our actions:

```
var actions = {
  requestGithub: function(username) {
    return {
      type: 'GITHUB_REQUEST',
      username: username
    }
  },
  receiveGithub: function(username, json) {
    return {
      type: 'GITHUB_RESPONSE',
      username: username,
      data: json
    }
  }
};

module.exports = actions;
```

We'll store an object in our state with one key per username that looks like so:

```js
{
  activeUser: 'jackfranklin',
  users: {
    jackfranklin: {
      isFetching: false,
      data: {...github response...}
    }
  }
}
```

The `activeUser` key will define which user we're looking at currently. Now we can start writing our reducer - we'll use the `combineReducers` trick we learned previously to make smaller reducers.

```js
var combineReducers = require('redux').combineReducers;

var activeUser = function(state, action) {
  if (!state) {
    state = '';
  }

  switch (action.type) {
    case 'GITHUB_RESPONSE':
      return action.username;
    default:
      return state;
  }
}

var users = function(state, action) {
  if (!state) {
    state = {};
  }

  switch (action.type) {
    case 'GITHUB_REQUEST':
      var newUserObj = {}
      newUserObj[action.username] = {
        isFetching: true,
        data: {}
      }

      return Object.assign({}, state, newUserObj);

    case 'GITHUB_RESPONSE':
      var newState = {};
      newState[action.username] = {
        isFetching: false,
        data: action.data
      }

      return Object.assign({}, state, newState);

    default:
      return state;
  }
}

var githubReducer = combineReducers({
  activeUser: activeUser,
  users: users
})

module.exports = githubReducer;
```

I find it really nice being able to think about how to update the state with each user action ahead of time. If you're thinking we could maybe tidy up the `users` reducer you'd be right, you could write a reducer that just deals with the object for a given user, and have another reducer for all the users. [There's an example in the Redux docs](http://redux.js.org/docs/advanced/AsyncActions.html), and if you'd like to give it a try please do at the end of this section along with the exercises :)

### Triggering events

Now we can write the code to trigger the `GITHUB_REQUEST` action, but to do so we need some Redux middleware, thunk.

A thunk is defined as a subroutine in computer programming, but in the case of Redux, a thunk is an action creator that returns a function instead of an action object. Crucially for us, it's allowed to have side effects, such as _triggering HTTP requests_. When you have an action that needs to be asynchronous, you probably want to use a thunk. This lets us wrap up the entire process of triggering a reqeust and dealing with the response in one action.

Before we look at how to set up support for thunks (they come in their own package, `redux-thunk`), let's write the action. We'll call this one `fetchUser`:

```js
fetchUser: function(username) {
  // this is what make a thunk creator different
  // it returns a function that will be called with the dispatch method from redux
  // so it can dispatch multiple actions
  return function(dispatch) {
    // first, dispatch the GITHUB_REQUEST action
    dispatch(actions.requestGithub(username));

    return fetch('http://github-proxy-api.herokuapp.com/users' + username)
      .then(function(resp) { return resp.json() })
      .then(function(json) {
        dispatch(actions.receiveGithub(username, json));
      });
    // in a real app we would deal with an error
  }
}
```

A thunk action creator is an action creator that will trigger at least one other action. Note that we don't ever give this action a `type` property. A thunk action can never be directly given to a reducer, but instead should trigger actions that will be.

PS: if `fetch` isn't implemented in your browser of choice, you can install the [window.fetch polyfill](https://github.com/github/fetch).

Now we need to configure our app with support for thunks. First, let's install `redux-thunk`:

```
npm install redux-thunk --save
```

And then configure it using `applyMiddleware`. Redux's middleware is similar to that in Node, it's just a way of passing an action through a series of functions. We won't go into them in much detail, but there is a [detailed guide on the Redux site](http://redux.js.org/docs/advanced/Middleware.html).

> Redux middleware solves different problems than Express or Koa middleware, but in a conceptually similar way. It provides a third-party extension point between dispatching an action, and the moment it reaches the reducer. People use Redux middleware for logging, crash reporting, talking to an asynchronous API, routing, and more.

```js
var store = Redux.createStore(
  githubReducers,
  {},
  Redux.compose(
    Redux.applyMiddleware(
      thunkMiddleware
    ),
    devTools
  )
);
```

Our store creation is now a little more complex; now we need to pass middleware into `createStore`, we also have to pass the second argument to set the initial state of the store, which will be an empty object. We then apply the middleware and add on the dev tool extension too, which we merge into one function using `Redux.compose` ([docs](http://redux.js.org/docs/api/compose.html).

Finally, we can now write the code to start getting this running! Let's make the button create a `fetchUser` action with the username from the text input:


```js
var React = require('react');
var connect = require('react-redux').connect;
var fetchUser = require('./actions').fetchUser;

var UsernameInput = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.dispatch(fetchUser(this.refs.userInput.value));
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="userInput" />
        <button type="submit">Fetch User</button>
      </form>
    );
  }
});

var ConnectedInput = connect()(UsernameInput);

module.exports = ConnectedInput;
```

And then we can update `App` to render some of this data:

```js
var thunkMiddleware = require('redux-thunk').default;
// requires left out
var devTools = window.devToolsExtension ? window.devToolsExtension() : function(x) { return x };

var store = Redux.createStore(
  githubReducers,
  {},
  Redux.compose(
    Redux.applyMiddleware(
      thunkMiddleware
    ),
    devTools
  )
);

var App = React.createClass({
  render: function() {
    var userObj = this.props.users[this.props.activeUser];
    return (
      <div>
        <UsernameInput />
        <p>Current user: { this.props.activeUser }</p>
        { userObj && userObj.data.public_repos }
      </div>
    );
  }
});

var ConnectedApp = connect(function(state) {
  return {
    activeUser: state.activeUser,
    users: state.users
  };
})(App);

// ReactDOM render left out
```

And with that we can now make requests to GitHub and dispatch actions as expected!

At this point take a deep breath - we've set up a lot and there was a lot to learn there! The good thing is once you've got this set up in your application it's now easy to leave it be and focus on your app - the beauty of Redux is once you have it configured you can usually forget about it.

__Exercise__: the `App` component has got pretty large. Can you pull a `UserData` component out that will render the data from the store for the active user?

__Exercise__: Show a list of all users we've previously fetched information for and allow them to be clicked to update the data being displayed.

You'll need to:
- create an action that is dispatched when the user clicks on a new username to become active
- update the reducer to set `activeUser` when the new action is dispatched
- create a new component that renders a list of all users and allows them to be clicked on, dispatching the new action and hence making them active
