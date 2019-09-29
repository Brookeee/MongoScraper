// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// Scraping dependencies
var axios = require('axios');
var cheerio = require('cheerio');

mongoose.Promise = Promise;

var PORT = process.env.PORT || 8080;

var app = express();

app.use(logger('dev'));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.static('public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var routes = require('./controllers/index.js');
app.use('/', routes);

mongoose.connect("mongodb://localhost/Headlines");

var db = mongoose.connection;

db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
});

db.once('open', function() {
  console.log('Mongoose connection success');
});

app.listen(PORT, function() {
  console.log('App running on PORT ' + PORT);
});
