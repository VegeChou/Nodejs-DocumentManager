;(function($, undefined){
  var editor = window.UM.getEditor('myEditor');
  $("form #confirm").click(function(){
    var data   = {};
    data.title_zh = $("form #title_zh").val();
    data.title_en = $("form #title_en").val();
    data.url = $("form #url").val();
    data.area = $("form #area").val();    
    data.content = editor.getContent();
    $.ajax({
      type: "POST",
      url: "/papers",
      data: data,
      success: function(data){
        location.href = "/prapers"
      },
      error: function(err, data, r){
        alert("添加失败，请重试");
      }
    });
  });
})(jQuery);
