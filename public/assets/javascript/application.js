$("#saveButton").click(function () {
  var thisId = $("#articleLink").attr("article-id");
  console.log(thisId)

  $.ajax({
    method: "POST",
    url: `/saved/${thisId}`,
  })
    .done(function (data) {
      console.log(data);
    })
  })