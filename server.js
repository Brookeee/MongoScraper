// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Scraping dependencies
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger('dev'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(express.static("public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));

app.set("view engine", "handlebars");

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/MongoScraping";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/scrape", function(req, res) {
  axios
    .get("https://www.nytimes.com/section/technology")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      $("article h2").each(function(i, element) {
        var result = {};

        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("h2 href")
          .attr("href");
        // result.img = $(this)
        //   .children("img")
        //   .attr("src");
        result.summary = $(this)
          .children("p")
          .text();
        console.log(result);

        db.Article.create(result)
          .then(function(dbArticle) {})
          .catch(function(err) {
            console.log(err);
          });
      });

      res.redirect("saved");
    });
});

app.get("/saved", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.render("saved", {
        saved: dbArticle,
      });
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/api/saved", function(req, res) {
  db.Article.create(req.body)
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  console.log(req.params.id);
  db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
      console.log(dbArticle);
      if (dbArticle) {
        res.render("articles", {
          data: dbArticle,
        });
      }
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/saved/:id", function(req, res) {
  db.Article.deleteOne({_id: req.params.id})
    .then(function(removed) {
      res.json(removed);
    })
    .catch(function(err, removed) {
      res.json(err);
    });
});

app.delete("/articles/:id", function(req, res) {
  db.Note.deleteOne({_id: req.params.id})
    .then(function(removed) {
      res.json(removed);
    })
    .catch(function(err, removed) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      db.Article.findOneAndUpdate(
        {_id: req.params.id},
        {$push: {note: dbNote._id}},
        {new: true}
      )
        .then(function(dbArticle) {
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function(err) {
          res.json(err);
        });
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on http://localhost:" + PORT);
});
