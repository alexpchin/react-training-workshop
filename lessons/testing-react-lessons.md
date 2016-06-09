# TESTING


## testing-react

A lot of this content is taken from my [Testing React Applications](http://12devsofxmas.co.uk/2015/12/day-2-testing-react-applications/) blog post.

Typically front end applications can be hard to test; having to fire up browsers and the like to run tests is a pain, and keeping the DOM tidy between tests takes extra effort. Thankfully React is different; we can run many React tests without ever having to actually render components properly. Because React supports being run on the server, we can write NodeJS tests. And when we do need a DOM we can use a Node implementation too.

To start with, run the `end/3-testing-react` application and get familiar with the components and how it works. It's this that we're going to test!

### Testing pure functions

We're going to start by writing some tests on our state functions, which we use in this todo app to manipulate the state. It's basically a cheap version of Redux, but demonstrates an important point: as much as you can you should pull out important logic into JS functions that can be tested independently of React.

We need a test runner, and whilst there's so many to choose from (Jasmine, Mocha) I prefer [tape](https://github.com/substack/tape), along with [babel-tape-runner](https://github.com/wavded/babel-tape-runner) for running tests that first need to be processed with Babel.

Note the `package.json` has all the testing configured for us so we can run `npm test` and get started right away.

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

__Exercise__: We have a failing test. Can you fix it?

__Exercise__: write another test for `toggleDone` that checks that if you have two todos, _only_ the todo with the matching ID is changed.

We won't write tests for all of the state functions, but if this were a real app I'd definitely recommend it. The key takeaway here is with React you should try to move complex logic out into pure functions that are tested in isolation from React.

## testing-shallow-render

Now we'll start to look at how we can test React components but _without_ the need for a DOM.

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

```js
test('Todo component', function(t) {
  t.test('rendering a not-done tweet', function(t) {
    var todo = { id: 1, name: 'Buy Milk', done: false };
    var result = shallowRenderTodo(todo);

    t.test('It renders the text of the todo', function(t) {
      t.plan(1);
      t.equal(result.props.children[0].props.children, 'Buy Milk');
    });

    t.test('it does not include the done-todo class', function(t) {
      t.plan(1);
      t.equal(result.props.className.indexOf('done-todo'), -1);
    });
  });

  t.test('rendering a done tweet', function(t) {
    var todo = { id: 1, name: 'Buy Milk', done: true };
    var result = shallowRenderTodo(todo);

    t.test('It includes the done-todo class', function(t) {
      t.plan(1);
      t.ok(result.props.className.indexOf('done-todo') > -1);
    });
  });
});
```

## dom-testing

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

__Exercise__: write a test like the above for testing being able to __delete__ a todo.

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

__Exercise__: Write a test that confirms that when the user hits the button, the input box is cleared.

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

One of my preferred choices is [faucet](https://github.com/substack/faucet). Install it with:

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

__Exercise__: Can you write a test for the `Todos` component that checks we can add a todo? It should simulate the user filling in the field, clicking the button and then check that a fourth todo item is rendered.

## testing-enzyme

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

__Exercise__: Update some of the other test files to use Enzyme.

