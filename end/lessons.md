# END

## 1-route-params

Now we're going to dive a little more into React Router and explore how to use it on some more realistic apps.

First, we're going to build an app that lets you view a person's GitHub repositories. It will have one url, `/users/:name`, where `:name` is replaced with the user we want the information on (for example `/users/jackfranklin`).

Load up the code in the browser and click on the "About Jack" link. You'll see "Loading" very briefly and then see the repositories count shown (at the time of writing it's 201). Now, from that page, click the "About Phil" link. Notice how it doesn't change. Why not?

The code for fetching a user is triggered in the `componentWillMount` lifecycle hook:

```js
componentWillMount: function() {
  this.fetchUser(this.props.params.username);
},
```

However, React Router tries to avoid unmounting components and remounting them because it's expensive. So, if you change URLs on your app but both URLs use the same component, it won't be remounted. (You can prove this - clicking from "About Jack" to "Home" and then to "About Phil" _does_ work, because the routes use different components).

Instead, React Router changes the _properties_ given to the component. Therefore, we need to make sure we are notified whenever the properties change, and refetch the data accordingly. The [React Route lifecycle docs](https://github.com/reactjs/react-router/blob/master/docs/guides/ComponentLifecycle.md) are a very worthy read.

When we navigate from `/users/jackfranklin` to `/users/leggetter` the `Users` component will have `componentWillReceiveProps(nextProps)` called. If `this.props.params.username` has changed, we need to refetch the data.

__Exercise__: taking the above into account, fix the application so you can navigate from `/users/jackfranklin` to `/users/leggetter` and have the data change. Solutions are found on `end-1-solutions`.

Solution:

```js
componentWillReceiveProps: function(newProps) {
  if (!newProps || !newProps.params || !newProps.params.username) {
    return;
  }

  var newName = newProps.params.username;
  var oldName = this.props.params.username;

  if (oldName !== newName) {
    this.setState({ user: undefined });
    this.fetchUser(newName);
  }
},
```

Note that `componentWillReceiveProps` is called numerous times, so it's always important to check you do actually have different data before you trigger a new fetch.

Finally, notice how we style the link when it's active, which is a feature React Router provides out of the box. You can pass an `activeClassName` prop to a `Link` to do this.

However, notice that the index route is active always! This is because each route matches `/`. We can fix this using `IndexLink`, which React Router provides for this exact reason.

## 2-dynamic-nav

(This exercise is taken largely from the [React Router tutorial](https://github.com/reactjs/react-router-tutorial/blob/start/lessons/12-navigating.md)).

We've seen how to use `Link` for routing but how can we navigate dynamically? In this lesson you'll let people type in a username into a field and take them to `/users/:username` so they can be shown information on the user from GitHub.

You'll need to write all the code yourself, but first let's discuss how React Router lets you programatically transiton routes.

React has a feature called _context_. This lets you pass data down from parents to children, grandchildren and beyond without manually passing props down the chain. [React docs](https://facebook.github.io/react/docs/context.html).

Note that you should use context sparingly, because it can make it confusing to figure out where data is coming from.

React Router exposes a `router` object onto the context, which we hook into to programatically transition. To access a property on context a child component has to define `contextTypes`, and ask for the right property. In our case that's:

```js
contextTypes: {
  router: React.PropTypes.object
}
```

Now we have access to `this.context.router` within a component. You can call `this.context.router.push('/foo')` to transition to a new route.

__Exercise__: take the code from `/end/2-dynamic-nav` and update it so it:

1. Allows a user to type a username, hit submit and be taken to the right route
2. You'll need to update `src/Home` with some fits of functionality to make this happen:
  - track the input value as it changes
  - define the `onSubmit` method to use `this.context.router.push` to push the new path.

You can check out `end-2-solutions` to see my solution.


## 3-testing-react

A lot of this content is taken from my [Testing React Applications](http://12devsofxmas.co.uk/2015/12/day-2-testing-react-applications/) blog post.

Typically front end applications can be hard to test; having to fire up browsers and the like to run tests is a pain, and keeping the DOM tidy between tests takes extra effort. Thankfully React is different; we can run many React tests without ever having to actually render components properly. Because React supports being run on the server, we can write NodeJS tests. And when we do need a DOM we can use a Node implementation too.

To start with, run the `end/3-testing-react` application and get familiar with the components and how it works. It's this that we're going to test!

### Testing pure functions

We're going to start by writing some tests on our state functions, which we use in this todo app to manipulate the state. It's basically a cheap version of Redux, but demonstrates an important point: as much as you can you should pull out important logic into JS functions that can be tested independently of React.

We need a test runner, and whilst there's so many to choose from (Jasmine, Mocha) I prefer [tape](https://github.com/substack/tape), along with [babel-tape-runner](https://github.com/wavded/babel-tape-runner) for running tests that first need to be processed with Babel.

First, let's install the test dependencies:

```
npm install --save-dev tape babel-tape-runner
```

Now we're running Babel through more than just Webpack, we'll create a `.babelrc` file to configure it.

```js
{
  "presets": ["react"]
}
```

And the finally add a `test` command that will run any file in the `test` directory that ends in `-test.js`:

```js
"test": "babel-tape-runner test/**/*-test.js"
```

You should now be able to run `npm test`, and see that whilst everything runs, there are no tests. Let's write one!

Create `test/state-functions-test.js`.

```js
var test = require('tape');

var stateFunctions = require('../src/state-functions');

test('toggleDone', function(t) {
  t.test('it updates the todo with the ID to be done', function(t) {
    t.plan(1);
    var state = {
      todos: [{ id: 1, done: false }]
    };
    var newState = stateFunctions.toggleDone(state, 1);
    t.deepEqual(newState.todos, [
      { id: 1, done: true }
    ]);
  });
});
```
- Note the use of `t.plan` to tell Tape how many assertions to expect
- `t.deepEqual` is great for comparing objects

__Exercise__: Check out the `3-tests-1` branch and run `npm test`. Note that the test is failing. Why is that, and can you fix it?
__Exercise__: write another test for `toggleDone` that checks that if you have two todos, _only_ the todo with the matching ID is changed.

We won't write tests for all of the state functions, but if this were a real app I'd definitely recommend it. The key takeaway here is with React you should try to move complex logic out into pure functions that are tested in isolation from React.

### Testing React components

Moving onto `4-shallow-render`, we'll start to look at how we can test React components but _without_ the need for a DOM.

We do this by using the React [test utils](https://facebook.github.io/react/docs/test-utils.html) which we can install:

```
npm install --save-dev react-addons-test-utils
```

These provide a number of additional functions that make it easy to test React components. One of these functions allows for shallow rendering. As the docs linked to above explain:

> Shallow rendering is an experimental feature that lets you render a component "one level deep" and assert facts about what its render method returns, without worrying about the behavior of child components, which are not instantiated or rendered. This does not require a DOM.

Let's use this to test our `Todo` component.

When you shallow render a component you get back an object representing what would have been rendered. Here's an example:

```js
{
  "type": "div",
  "key": null,
  "ref": null,
  "props": {
    "className": "todo  todo-1",
    "children": [
      {
        "type": "p",
        "key": null,
        "ref": null,
        "props": {
          "className": "toggle-todo",
          "children": "Buy Milk"
        },
        "_owner": null,
        "_store": {}
      },
      {
        "type": "a",
        "key": null,
        "ref": null,
        "props": {
          "className": "delete-todo",
          "href": "#",
          "children": "Delete"
        },
        "_owner": null,
        "_store": {}
      }
    ]
  },
  "_owner": null,
  "_store": {}
}
```

We can then make assertions on that. Here's our first test:

```js
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');

var Todo = require('../src/todo');

function shallowRenderTodo(todo) {
  var fn = function() {};

  const renderer = TestUtils.createRenderer();
  renderer.render(<Todo todo={todo} deleteTodo={fn} doneChange={fn} />);
  return renderer.getRenderOutput();
}

test('Todo component', function(t) {
  t.test('rendering a not-done tweet', function(t) {
    var todo = { id: 1, name: 'Buy Milk', done: false };
    var result = shallowRenderTodo(todo);

    t.test('It renders the text of the todo', function(t) {
      t.plan(1);
      t.equal(result.props.children[0].props.children, 'Buy Milk');
    });
  });
});
```

__Exercise__: write another test for the todo component:
- When a todo is done, it should have the class `done-todo` applied to the rendered `div` element
- When a todo is not done, it should not have the class `done-todo` applied to the rendered `div` element

The tests for the above exercise are on the branch `end-4-solutions`.

## 5-dom-testing

Sometimes though we have no choice but to fire up the DOM and write tests that interact with it. In React world we do this to test interactions such as button clicks, and users typing into forms.

Thankfully though we can use [jsdom](https://github.com/tmpvar/jsdom), a library that implements the DOM and HTML APIs for use in NodeJS. This is great for running tests in Node without having to fire up browsers.

First, we install it:

```
npm install --save-dev jsdom
```

Then we create `test/setup.js`:

```js
var jsdom = require('jsdom');

function setupDom() {
  if (typeof document !== 'undefined') {
    return;
  }

  global.document = jsdom.jsdom('<html><body></body></html>');
  global.window = document.defaultView;
  global.navigator = window.navigator;
}

setupDom();
```

This file, when required, will set up the DOM using JSDom. All we need to do now is import it. Note that this __MUST__ be imported _before_ React.

```
require('./setup');
```

Let's write a new `Todo` test that tests we can toggle a todo from not done to done by clicking on it.

```js
t.test('toggling a TODO calls the given function', function(t) {
  t.plan(1);
  var doneCallback = function(id) { t.equal(id, 1) };
  var todo = { id: 1, name: 'Buy Milk', done: false };

  var result = TestUtils.renderIntoDocument(
    <Todo todo={todo} doneChange={doneCallback} deleteTodo={function() {}} />
  );

  var todoText = TestUtils.findRenderedDOMComponentWithTag(result, 'p');
  TestUtils.Simulate.click(todoText);
});
```

This test works by telling Tape we expect one assertion, and then calling that assertion in the `doneCallback` function that a `Todo` component expects to be given. If the `doneCallback` isn't called, Tape will time out and our test will fail.

__Exercise__: check out `end-5-tests-1` and write a test like the above for testing being able to __delete__ a todo.

### Adding a Todo

Let's now look at adding a todo in `test/add-todo-component-test.js`:

```js
require('./setup');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');

var AddTodo = require('../src/add-todo');

test('Add Todo component', function(t) {
  t.test('it calls the given callback prop with the new text from the form', function(t) {
    t.plan(1);

    var todoCallback = function(todo) {
      t.equal(todo.name, 'Buy Milk');
    };

    var form = TestUtils.renderIntoDocument(
      <AddTodo onNewTodo={todoCallback} />
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
    input.value = 'Buy Milk';

    var button = TestUtils.findRenderedDOMComponentWithTag(form, 'button');
    TestUtils.Simulate.click(button);
  });
});
```

__Exercise__: check out the `end-5-tests-2` branch and write a new test. This test should check that once the button is clicked, the input box is cleared.

## Aside: Tape output

You might have noticed that the Tape output isn't exactly the most friendly to look at:

```
TAP version 13
# toggleDone
# it updates the todo with the ID to be done
ok 1 should be equivalent
# Todo component
# rendering a not-done tweet
# It renders the text of the todo
ok 2 should be equal
# it does not include the done-todo class
ok 3 should be equal
# rendering a done tweet
# It includes the done-todo class
ok 4 (unnamed assert)

1..4
# tests 4
# pass  4

# ok
```

This is because the output is in TAP format - the Test Anything Protocol which is not designed for humans to read but other programs. What this means though is that people have built nice test outputters for Tape.

One of my preffered choices is [faucet](https://github.com/substack/faucet). Install it with:

```
npm install --save-dev faucet
```

And update the test command in `package.json`:

```js
"test": "babel-tape-runner test/**/*-test.js | faucet"
```

__Exercise__: take a look at [this list](https://github.com/substack/tape#pretty-reporters) of Tape reporters and try setting up the one that you like best.

## 6-more-testing

For our penultimate look at testing React components, let's take a look at the Todos component generally. This component is pretty large and encapsulates our entire application, so it's quite a good place for some higher level tests that test we render Todos, render a new todo when one is added, and so on. The number of tests of this nature that you write depends on your personal preference to testing, but I at least like to have a couple that validate at a high level that my components are all slotting together nicely.

Our first test in the new `test/todos-component-test.js` will test that we render the correct number of components to the DOM. I've hardcoded the state to have three items, so we test that 3 children are rendered. Note here that I use shallow rendering - you should always aim for this when possible.

```js
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');

var Todos = require('../src/todos');

function shallowRender() {
  const renderer = TestUtils.createRenderer();
  renderer.render(<Todos />);
  return renderer.getRenderOutput();
}

test('Todos component', function(t) {
  t.test('it renders a list of Todos', function(t) {
    t.plan(1);
    var result = shallowRender();
    const todoChildren = result.props.children[2].props.children;
    t.equal(todoChildren.length, 3);
  });
});
```

Now we can test the slightly more complicated behaviour: deleting a TODO.

Earlier in another test we tested that in the `Todo` component when we click it calls the callback, but it's nice to have a test here that confirms that our components are wired together completely.

```js
t.test('Deleting a todo', function(t) {
  t.plan(1);
  var result = TestUtils.renderIntoDocument(<Todos />);
  var firstDelete = TestUtils.scryRenderedDOMComponentsWithClass(result, 'delete-todo')[0];
  TestUtils.Simulate.click(firstDelete);

  var todos = TestUtils.scryRenderedDOMComponentsWithClass(result, 'todo');
  t.equal(todos.length, 2);
});
```

Here, `scryRenderedDOMComponentsWithClass` looks for all elements with a particular class and returns an array. Wondering why it's called `scry` ?

> Scrying (also called seeing or peeping) is the practice of looking into a translucent ball

([Wikipedia](https://en.m.wikipedia.org/wiki/Scrying))

__Exercise__: check out `6-end-tests-1`. Can you write a test for the `Todos` component that checks we can add a todo? It should simulate the user filling in the field, clicking the button and then check that a fourth todo item is rendered.

### Testing in browser

Using a combination of Browserify, Babelify and Tape Run we can run our tests in the browser too. Check out `end-6-tests-browser`, `npm install` and try it for yourself.

## 7-enzyme

Finally for our testing adventures we're going to quickly look at how [Enzyme](https://github.com/airbnb/enzyme) can make testing React components much easier.

```
npm install --save-dev enzyme
```

Enzyme helps both with shallow rendered tests and DOM tests. Let's rewrite some of our shallow rendered `Todo` tests using Enzyme.

```js
require('./setup');

var React = require('react');
var enzyme = require('enzyme');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');

var Todo = require('../src/todo');

function shallowRenderTodo(todo) {
  var fn = function() {};
  return enzyme.shallow(<Todo todo={todo} deleteTodo={fn} doneChange={fn} />);
}

test('Todo component', function(t) {
  t.test('rendering a not-done tweet', function(t) {
    var todo = { id: 1, name: 'Buy Milk', done: false };
    var result = shallowRenderTodo(todo);

    t.test('It renders the text of the todo', function(t) {
      t.plan(1);
      t.equal(result.find('p').text(), 'Buy Milk');
    });

    t.test('it does not include the done-todo class', function(t) {
      t.plan(1);
      t.equal(result.hasClass('done-todo'), false);
    });
  });

  t.test('rendering a done tweet', function(t) {
    var todo = { id: 1, name: 'Buy Milk', done: true };
    var result = shallowRenderTodo(todo);

    t.test('It includes the done-todo class', function(t) {
      t.plan(1);
      t.ok(result.hasClass('done-todo'));
    });
  });

  ... more tests
```

Note how Enzyme tidies up the shallow rendering function and provides nice helper calls to check the shallow rendered result; this is much nicer than navigating the data structure that is given to us by the React Test Utils.

Now let's see how Enzyme deals with tests that use the DOM, using `enzyme.mount`.

```js
t.test('toggling a TODO calls the given function', function(t) {
  t.plan(1);
  var doneCallback = function(id) { t.equal(id, 1) };
  var todo = { id: 1, name: 'Buy Milk', done: false };

  var result = enzyme.mount(
    <Todo todo={todo} doneChange={doneCallback} deleteTodo={function() {}} />
  );

  result.find('p').simulate('click');
});
```

__Exercise__: check out `end-7-tests-1` and rewrite some of our `Todos` tests using Enzyme.

## Putting it all together

You've just been hired by GutHib Ltd to build the next generation issue tracking tool. They've provided you with an API and would like a React frontend. They've been very specific with their requirements though:

- It should use Redux for managing all state and data
- It should use React Router for routing
- Ideally if you have time they'd like at least a couple of tests
- They also don't care _at all_ about the design or how it looks.

You've taken over from another developer who thankfully did a decent job so far and has set up React, Redux and Redux Thunk.

The functional requirements are:

- The ability to navigate to a single issue (this is nearly done for you in the starting app).
- The ability to create a new issue (and provide a title, longer form content and a user ID).
- (Bonus): the ability to select a user from a dropdown when creating an issue, rather than just typing the user ID into the form.

Study the application and how it's structured before diving in. Think about the component you'll need to create for adding an issue, and what actions you'll need to dispatch.

Tip: here's how you POST some JSON using the `fetch` API:

```js
return fetch('http://localhost:3002/issues', {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: title,
    content: content,
    userId: userId
  })
}).then(function(r) {
  return r.json();
}).then(function(newIssue) {
  // newIssue is the new issue from the API
});
```

##9-es2015

Now we're going to look at how some of the features of ES2015 can make our code clearer. To set it up we just need to add the ES2015 Babel preset and then Babel will start transpiling ES2015 for us.

First we just need to install the ES2015 preset:

```
npm install --save-dev babel-preset-es2015
```

And then update the `.babelrc` (if you have one) and webpack config.

- Firstly, we can use the ES2015 module syntax to dramatically reduce and tidy up imports.
- We can swap `var` out for `const` when we don't need to modify a value again.
- We can also take advantage of object literal syntax improvements, which change `render: function() {` into simply `render() {` within an object literal.
- We can use ES2015 syntax for exporting too
- We can swap to the class version of React components (`src/issue.js` on the `end-9-solutions` branch)
- We can use arrow functions to reduce the amount of boilerplate
- Be careful with the binding of methods - this happens automatically in `React.createClass` but not in ES2015 classes.

__Exercise__: go through some of the code in `9-es2015` and update it to run some ES2015. You'll need to install the preset and configure Babel too.

##10-universal-react

This example shows how we might run React & React Router on the server.

__Exercise__: Add another route to the server side app.



