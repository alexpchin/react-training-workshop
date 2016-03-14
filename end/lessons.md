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
