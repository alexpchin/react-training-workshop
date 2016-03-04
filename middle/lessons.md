## 1-webpack-intro

So far we've seen some of the basics of React but not how to structure larger applications.

It's not encouraged to have all your components as global variables in one file, rather that we split our files up into modules, with one React component per file, and use a _bundler_ to generate our built JavaScript file.

### CommonJS

To do this we'll use CommonJS modules (if you were feeling fancy you could go for ES2015 modules), which will be familiar to anyone who has done Node:

```js
//input.js
var InputForm = React.createClass({...});
module.exports = InputForm;

//app.js
var InputForm = require('./input');
```

Babel understands these and can parse them, all we need to do now is use a tool that can take a bunch of CommonJS files and:

- Run them through Babel so the JSX is converted to JavaScript.
- Merge them all together into one file that e can give to the browser.

To do this we will use Webpack. Webpack is crazy large and can do tonnes, but in this workshop we'll only use it to bundle our React apps and keep it straight forward.

## Creating a new Webpack project

We'll install all our dependencies as npm ones, so let's make a new directory and get to work!

```
npm init -y
npm install webpack babel-loader babel-core babel-preset-react --save-dev
```

`babel-loader` is the Babel plugin for Webpack.

Now we can configure Webpack with `webpack.config.dev.js`:

```js
var path = require('path');

module.exports = {
  entry: path.join(process.cwd(), 'src', 'app.js'),
  output: {
    path: './built',
    filename: 'webpack-dev-build.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        cacheDirectory: true
      }
    }]
  }
}
```

Let's throw `src/app.js` together:

```js
var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function() {
    return (
      <p>Hello World</p>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
```

And `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>React & Webpack 1</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="built/webpack-dev-build.js"></script>
  </body>
</html>
```

And now we need to install React and ReactDOM:

```
npm install react react-dom --save
```

And lets install our favourite `live-server` too:

```
npm install live-server --save-dev
```

And lets set up some scripts in `package.json`:

```js
"scripts": {
  "start": "live-server --port=3001 --ignore=src/",
  "build": "webpack --config webpack.config.dev.js --watch"
},
```

And now we can run both those commands to have our app built and running!

## 2-component-communication

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

  onChange: function() {}
}
```

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

__Exercise__: with the code as it is, can you add a 'Delete' button to each todo that when clicked will cause the todo to be removed from the store? You might find it easier if you move the rendering of Todos and make a `Todo` component that is rendered for each todo.

(Solution is on branch `middle-2-delete-exercise`)

## 3-redux

Now let's look at using [Redux](http://redux.js.org/index.html)  rather than implementing ourselves.

First, we need to install. Note that Redux can be used without React, so we'll install the react-redux package too.

```
npm install --save redux react-redux
```

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
- create a new `Todo` component to represent a todo (like we did in exercise 2), and hook it up to the store so it can `dispatch()`.
- Have a button that dispatches the new action type.

The solution for this exercise is on `middle-3-delete-exercise`.




