var express = require('express');
var bodyParser = require('body-parser')
var __ID_SEED__ = 0;
var app = express();

app.use(bodyParser.json());

var data = require('./comments.json').map(function(row) {
  row.id = ++__ID_SEED__;
  return row ;
});

app.get('/api/comments', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
});
app.post('/api/comments', function(req, res) {
  var row = {
    id: ++__ID_SEED__,
    author: req.body.author,
    text: req.body.text
  };
  data.push(row);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(row));
});

module.exports = {
  start: function() {
    app.listen(8081);
  }
};
