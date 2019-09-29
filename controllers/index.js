var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

// ES6 built in promise
mongoose.Promise = Promise;

var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/saved', function(req, res) {
  // Grabbing from articles array
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      var hbsArticleObj = {
        articles: doc,
      };

      res.render('saved', hbsArticleObj);
    }
  });
});

// GET request to scrape Huff Crime website
router.post('/scrape', function(req, res) {
  axios('https://www.huffpost.com/topic/justice', function(
    error,
    response,
    html
  ) {
    var $ = cheerio.load(html);

    var scrappedArt = {};
    $('article h2').each(function(i, element) {
      // Result object
      var result = {};
      result.title = $(this)
        .children('a')
        .text();
      console.log('Result title ' + result.title);
      result.link = $(this)
        .children('a')
        .attr('href');
      scrappedArt[i] = result;
    });

    console.log('Scrape articles complete: ' + scrappedArt);

    var hbsArticleObj = {
      articles: scrappedArt,
    };
    res.render('index', hbsArticleObj);
  });
});

router.post('/save', function(req, res) {
  console.log('The title is: ' + req.body.title);
  var newArtObj = {};
  newArtObj.title = req.body.title;
  newArtObj.link = req.body.link;

  var newEntry = new Article(newArtObj);
  console.log('You can save this article: ' + newEntry);

  // Saving to DB
  newEntry.save(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // No errors, log doc
    else {
      console.log(doc);
    }
  });

  res.redirect('/save');
});

router.get('/delte/:id', function(req, res) {
  console.log('Delete via ID' + req.params.id);

  Article.findByIdAndRemove({_id: req.params.id}, function(err, offer) {
    if (err) {
      console.log('Sorry, cannot be deleted:' + err);
    } else {
      console.log('You can delete this!');
    }
    res.redirect('/save');
  });
});

router.get('/notes/:id', function(req, res) {
  console.log('Sorry, cannot be deleted' + req.params.id);
  console.log('Delete is an option');

  Note.findByIdAndRemove({_id: req.params.id}, function(err, doc) {
    if (err) {
      console.log('Delete is not an option' + err);
    } else {
      console.log('You can delete this!');
    }
    res.send(doc);
  });
});

// Grabbing articles by objID

router.get('/articles/:id', function(req, res) {
  console.log('Reading ID' + req.params.id);

  //finds the id from above to find on in db
  Article.findOne({_id: req.params.id})
    .populate('notes')
    .exec(function(err, doc) {
      if (err) {
        console.log('Sorry, cannot find article and access notes');
      } else {
        console.log('Notes are here?' + doc);
        res.json(doc);
      }
    });
});

// replace/create new note
router.post('/articles/:id', function(req, res) {
  var newNote = new Note(req.body);
  //saving to db
  newNote.save(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      Article.findOneAndUpdate(
        {_id: req.params.id},
        {$push: {notes: doc._id}},
        {new: true, upsert: true}
      )
        .populate('notes')
        .exec(function(error, doc) {
          if (error) {
            console.log('Cannot find that article');
          } else {
            console.log('Getting notes? ' + doc.notes);
            res.send(doc);
          }
        });
    }
  });
});

// export for server
module.exports = router;
