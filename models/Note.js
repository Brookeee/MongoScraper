// Require mongoose
var mongoose = require("mongoose");

// Schema
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  body: String
});

// Model for note scehma
var Note = mongoose.model("Note", NoteSchema);

// Export model
module.exports = Note;
