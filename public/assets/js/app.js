$(document).on("click", "#scrapeBtn", function() {
  $.ajax({
    method: "GET",
    url: "/scrape",
  });
  window.location.replace("/scrape");
});

$(document).on("click", ".rmv-article", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/saved/" + thisId,
  }).then(function(data) {
    console.log(data);
    location.reload();
  });
});

$(document).on("click", ".save-article", function() {
  var thisId = $(this).attr("data-id");
  $(this).hide();
  var data = {};
  data.title = $("#title-" + thisId).text();
  data.link = $("link-" + thisId).text();
  data.summary = $("summary-" + thisId).text();
  $.ajax({
    method: "POST",
    dataType: "json",
    url: "/api/saved",
    data: data,
  });
});

$(document).on("click", ".comment-comment", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  });
  window.location.replace("/articles/" + thisId);
});

$(document).on("click", "#enter-note", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#noteone").val(),
      body: $("#description").val(),
    },
  }).then(function(data) {
    console.log(data);
    window.location.replace("/articles/" + data._id);
  });

  $("#noteone").val('');
  $("#description").val('');
});

$(document).on("click", ".delete-notes", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
  }).then(function(data) {
    console.log(data);
    location.reload();
  });
});
