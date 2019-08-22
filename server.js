// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var axios = require("axios");

// Initialize express
var app = express();

// Requiring models
var db = require("./models");

// Port
var PORT = process.env.PORT || 3000;

// public directory
app.use(express.static("public"));

// Routes
app.get("/scrape", function(req, res) {
  axiost
    .get("https://www.cnn.com/specials/us/crime-and-justice")
    .then(function(response) {
      var $ = cheerio.load(response.data);
    });
});
