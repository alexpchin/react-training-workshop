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

Instead, React Router changes the _properties_ given to the component. Therefore, we need to make sure we are notified whenever the properties change, and refetch teh data accordingly. The [React Route lifecycle docs](https://github.com/reactjs/react-router/blob/master/docs/guides/ComponentLifecycle.md) are a very worthy read.

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

We've seen how to use `Link` for routing but hwo can we navigate dynamically? In this lesson you'll let people type in a username into a field and take them to `/users/:username` so they can be shown information on the user from GitHub.

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


