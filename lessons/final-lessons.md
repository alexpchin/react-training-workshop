# guthib, es2015 and universal

## Putting it all together

You've just been hired by GutHib Ltd to build the next generation issue tracking tool. They've provided you with an API and would like a React frontend. They've been very specific with their requirements though:

- It should use Redux for managing all state and data
- It should use React Router for routing
- Ideally if you have time they'd like at least a couple of tests
- They also don't care _at all_ about the design or how it looks.

You've taken over from another developer who thankfully did a decent job so far and has set up React, Redux and Redux Thunk. You can find the start point in the `exercises/guthib` folder. You can run the API by running `npm start` in the `fake-api` folder.

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

##es2015

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

__Exercise__: go through some of the code in `es2015-react` and update it to run some ES2015. You'll need to install the preset and configure Babel too.

##1universal-react

This example shows how we might run React & React Router on the server.

__Exercise__: Add another route to the server side app.



