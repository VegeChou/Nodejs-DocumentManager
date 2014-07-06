;(function($, undefined){
  var editor = window.UM.getEditor('myEditor');
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
        $("#title_zh").val(data.title_zh);
        $("#title_en").val(data.title_en);
        $("#url").val(data.url);
        $("#area").val(data.area);
        editor.setContent(data.content);
      },
      error: function(err, data, r){
      }
    });
  }


  $("form #confirm").click(function(){
    var data   = {};
    data.title_zh = $("form #title_zh").val();
    data.title_en = $("form #title_en").val();
    data.url = $("form #url").val();
    data.area = $("form #area").val();    
    data.content = editor.getContent();
    $.ajax({
      type: "PUT",
      url: "/papers/"+pid,
      data: data,
      success: function(data){
        location.href = "/papers";
      },
      error: function(err, data, r){
        console.log(r);
        alert("修改失败，请重试");
      }
    });
  });
})(jQuery);
