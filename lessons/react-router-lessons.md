# REACT ROUTER

## react-router-intro

Leaving Redux for now, we're going to look at how to set up routing with [React Router](https://github.com/reactjs/react-router), the standard routing solution for ReactJS applications.

At its core React Router is just a bunch of React components. We create a router with the `Router` component, and routes with the `Route` component. We also have to tell React Router how to manage URLs - whether to use the hashbang approach or HTML 5 pushState API. For now we'll use hashbangs to avoid having to set up a server, but later we'll see how we can avoid that. Let's take a look at a basic app:

```js
var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;

var App = React.createClass({
  render: function() {
    return (
      <p>Hello World</p>
    );
  }
});

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App} />
  </Router>,
  document.getElementById('app')
)
```

__Exercise__: add another route for the `/about` URL, and a new component that will be rendered on it.
__Exercise__: explore how you can use React Router's `Link` component to have links between routes. [Here's the docs to get you started](https://github.com/reactjs/react-router/blob/master/docs/API.md#link).

## nested-routing

Often we want to have a shared component for all routes that contains common content such as navigation, and so on. We can achieve this with nested routes.

Taking the following components:

```js
var App = React.createClass({
  render: function() {
    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        { this.props.children }
      </div>
    );
  }
});

var Home = React.createClass({
  render: function() {
    return (
      <p>Home</p>
    );
  }
});

var About = React.createClass({
  render: function() {
    return (
      <p>About</p>
    );
  }
});
```

We can render them as follows:

```js
<Router history={hashHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/about" component={About} />
  </Route>
</Router>
```

- The real power of React Router comes from this ability to nest routes within routes to any level needed.
- We use the `IndexRoute` when we want to have a route nested within a parent route at the same URL. It's akin to how browsers always look for `index.html`.
- Note the use of `{this.props.children}` to render the child routes.

## route-params

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

## dynamic-nav

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

