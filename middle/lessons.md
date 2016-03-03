So far we've seen some of the basics of React but not how to structure larger applications.

It's not encouraged to have all your components as global variables in one file, rather that we split our files up into modules, with one React component per file, and use a _bundler_ to generate our built JavaScript file.

## CommonJS

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




