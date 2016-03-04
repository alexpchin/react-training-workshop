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

__Exercise__: with the code as it is, can you add a 'Delete' button to each todo that when clicked will cause the todo to be removed from the store?

(Solution is on branch `middle-2-delete-exercise`)
