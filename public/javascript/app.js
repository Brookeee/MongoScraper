//Scrape
$(document).on("click", ".scrapebutton", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data) {
    window.location = "/";
  });
});

//Save articles
$(document).on("click", ".saveButton", function() {
  var savedArticleId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/api/savearticle/" + savedArticleId
  }).done(function(data) {
    window.location = "/";
  });
});

//Delete all articles
$(document).on("click", ".deleteAllButton", function() {
  $.ajax({
    method: "DELETE",
    url: "/api/deletearticles/"
  }).done(function(data) {
    window.location = "/";
  });
});

//Delete an article
$(document).on("click", ".deleteButton", function() {
  var deleteArticleId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/api/deletearticle/" + deleteArticleId
  }).done(function(data) {
    window.location = "/";
  });
});

//Delete a saved article
$(document).on("click", ".deleteArticleButton", function() {
  var deleteSavedArticleId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/api/deletesavearticle/" + deleteSavedArticleId
  }).done(function(data) {
    window.location = "/saved";
  });
});

//Save a note
$(document).on("click", ".saveNotesButton", function() {
  var newNoteId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/api/savenote/" + newNoteId,
    data: {
      text: $("#note" + newNoteId).val(),
      created: new Date()
    }
  }).done(function(data) {
    console.log(data);
    $("#note" + newNoteId).val("");
    window.location = "/saved";
  });
});

//Delete a note
$(document).on("click", ".deleteNote", function() {
  var deleteNoteId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/api/deletenote/" + deleteNoteId
  }).done(function(data) {
    window.location = "/saved";
  });
});
