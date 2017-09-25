$(document).ready(function(){

$(".saveButton").click(function () {
  var thisId = $(".articleLink").attr("article-id");
  console.log(thisId);

  $.ajax({
    method: "PUT",
    url: `/articles/${thisId}`,
  })
    .done(function (data) {
      console.log(data);
    })
  })
});
