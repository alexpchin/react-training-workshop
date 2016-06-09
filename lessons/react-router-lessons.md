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

```js
var React = require('react');

var Users = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    this.fetchUser(this.props.params.username);
  },
  fetchUser: function(username) {
    fetch('http://github-proxy-api.herokuapp.com/users/' + username).then(function(data) {
      return data.json();
    }).then(function(data) {
      this.setState({ user: data });
    }.bind(this));
  },
  render: function() {
    if (this.state.user) {
      return (
        <p>Repositories count: {this.state.user.public_repos}</p>
      );
    } else {
      return <p>Loading</p>;
    }
  }
});

module.exports = Users;
```

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

However, notice that the index route is active always! This is because each route matches `/`. We can fix this by setting `onlyActiveOnIndex` to true on links, so that they are only valid when their exact URL is active.

Rather than repeat this we can create a higher order component that will do this for us.

Rather than repeat this we can create a higher order component that will do this for us.

```
var AppLink = React.createClass({
  render: function() {
    return <Link {...this.props} activeClassName="active" onlyActiveOnIndex={true} />;
  }
});
```


## dynamic-nav

We've seen how to use `Link` for routing but how can we navigate dynamically? In this lesson you'll let people type in a username into a field and take them to `/users/:username` so they can be shown information on the user from GitHub.

You'll need to write all the code yourself, but first let's discuss how React Router lets you programatically transiton routes.

ReactRouter exposes a function called `withRouter` that takes a component and returns another component that is the same but with access to `this.props.router`.


```js
module.exports = withRouter(Home);
```

You can call `this.props.router.push('/foo')` to transition to a new route.

__Exercise__: take the code from `/end/2-dynamic-nav` and update it so it:

1. Allows a user to type a username, hit submit and be taken to the right route
2. You'll need to update `src/Home` with some fits of functionality to make this happen:
  - track the input value as it changes
  - define the `onSubmit` method to use `this.context.router.push` to push the new path.

