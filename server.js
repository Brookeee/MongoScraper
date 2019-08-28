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
var PORT = 3000;

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Parse body as JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Connect to mongo database
var MONGO_URI = process.env.MONGO_URI || "mongodb://heroku_crppxzbq:ust8j2ebofp7rkmimae7enhght@ds033153.mlab.com:33153/heroku_crppxzbq";

mongoose.connect(MONGO_URI);
console.log("Mongoose connected" + MONGO_URI);
// Routes
app.get("/", function(req, res) {
  db.Article.find(function(data) {
    res.render("index", data);
  });
});
app.get("/scrape", function(req, res) {
  axios
    .get("https://www.cnn.com/specials/us/crime-and-justice")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      $(".cd__headline-text").each(function(i, element) {
        var result = {};
        result.title = $(this).attr("title");
        result.link = $(this).attr("href");
        result.image = $(this)
          .children("img")
          .attr("src");
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.send("Scraping complete");
    });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
