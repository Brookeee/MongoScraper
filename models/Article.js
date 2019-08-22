// Require mongoose
var mongoose = require("mongoose");

// Schema
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  urlLink: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean
  },
  // Note object storing Note id 
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
