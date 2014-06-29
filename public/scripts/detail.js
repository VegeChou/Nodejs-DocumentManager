;(function($, undefined){
  var arr = location.search.replace("?", "").split("&");
  var pid;
  for(var i=0; i<arr.length; i++){
    var a = arr[i].split("=");
    if(a && a[0] === "pid") pid = a[1];
  }
  if(pid){
    $.ajax({
      type: "GET",
      url: "/papers/"+pid,
      success: function(data){      
        $("#title-zh").text(data.title_zh);
        $("#title-en").text(data.title_en);
        $("#url").text(data.url);
        $("#area").text(data.area);
        $("#page-content").html(data.content);
      },
      error: function(err, data, r){
      }
    });
  }
})(jQuery);
