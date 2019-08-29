// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");

// Initialize express
var app = express();

// Requiring models
var db = require("./models");

// Port
var PORT = 3000;

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Middleware
app.use(logger("dev"));
// Parse body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to mongo database
// var MONGODB_URI =
//   process.env.MONGODB_URI ||
//   "mongodb://heroku_crppxzbq:ust8j2ebofp7rkmimae7enhght@ds033153.mlab.com:33153/heroku_crppxzbq";

//   mongoose.connect(MONGODB_URI)

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect("mongodb://localhost/mongoHeadlines", {useNewUrlParser: true});
mongoose.connect(MONGODB_URI, function(err) {
 if (err) {
 console.log(err);
} else {
 console.log("Connection successful");
}
});

// Routes
app.get("/", function(req, res) {
  db.Article.find(function(data) {
    res.render("index", data);
  })
})
app.get("/scrape", function(req, res) {
  axios
    .get("https://www.huffpost.com/topic/crime-and-justice")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      $(".card__headline-text").each(function(i, element) {
        var result = {};
        result.title = $(this).attr("title");
        result.link = $(this).attr("href");
        result.image = $(this)
          .children("img")
          .attr("src");
        db.Article.create(result)
          .then(function(dbArticle) {
            res.json(result);
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.send("Scraping complete");
    });
});

app.get("/article", function(req, res) {
  db.Article.find({})
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/article/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/article/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
