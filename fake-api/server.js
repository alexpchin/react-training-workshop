var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

var db = require('./database');

app.use(require('cors')());
app.use(bodyParser.json())

app.get('/users', function(req, res) {
  res.json(db.users.getAll());
});

app.get('/users/:id', function(req, res) {
  var user = db.users.get(+req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});

app.post('/users', function(req, res) {
  var user = req.body;
  res.json(db.users.add(user));
});

app.get('/issues', function(req, res) {
  res.json(db.issues.getAll());
});

app.get('/issues/:id', function(req, res) {
  var issue = db.issues.get(+req.params.id);
  if (issue) {
    res.json(issue);
  } else {
    res.sendStatus(404);
  }
});

app.post('/issues', function(req, res) {
  var issue = req.body;
  res.json(db.issues.add(issue));
});

var server = http.createServer(app);

server.listen(3002);

server.on('listening', function() {
  console.log('Fake API server running on 3002');
});


