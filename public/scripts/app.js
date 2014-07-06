;(function($, undefined){
  $("tbody tr td #remove").click(function(){
    var flag = confirm("删除是不可恢复的，你确认要删除吗？")
    if(flag){
      var that = this.parentNode.parentNode.parentNode;
      var view = this.parentNode.parentNode;
      var pid = view.id;
      $.ajax({
        type: "DELETE",
        url: "papers/"+pid,
        success: function(data){
          view.remove();
        },
        error: function(){
          alert("删除错误，请重试");
          location.reload();
        }        
      })
    }
  });

  $("#search-papers").on('keydown', function(e){
     if(e.keyCode === 13){
       var wd = $("#search-papers").val().trim();
       if(wd){
         location.href = "papers?wd="+wd;
       }else {
         location.href = "papers";
       }
     }
  });
})(jQuery);
