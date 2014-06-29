var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/DMDB');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

var Schema = mongoose.Schema;

var MetricalInformationSchema = new Schema({
	title_zh: String,
	title_en: String,
	url: String,
	area: String,
	content: String,
    ctime: Number
})

var MetricalInformation = mongoose.model('MetricalInformation',MetricalInformationSchema);

exports.add = function(title_zh,title_en,url,area,content,callback){
  if(title_zh == "" && title_en == ""){
    return callback(1,"名称不能均为空");
  } else{
    MetricalInformation.where('title_zh',title_zh).or().where("title_en",title_en).exec(function(error,mis){
      if(mis.length > 0){
        return callback(1,"已经存在")
      }
      var mi = new MetricalInformation();
      var pid = mi._id;

      mi.title_zh = title_zh;
      mi.title_en = title_en;
      mi.url = url;
      mi.area = area;
      mi.content = content;
      mi.ctime = new Date().getTime();

      mi.save(function(error){
        if(error){
          callback(1,error);
        } else{
          callback(0,pid);
        }
      });

    });
  }
}

exports.delete = function(pid,callback){
    MetricalInformation.remove({_id:pid},function(error,mis){
        if(error){
            callback(1,error);
        } else{
            callback(0,pid);
        }
    });

}

exports.update = function(pid,title_zh,title_en,url,area,content,callback){
    if(title_zh == "" && title_en == ""){
        return callback(1,"名称不能均为空");
    } else {
        MetricalInformation.find({_id: pid}, function (error, mis) {
            if (mis.length > 0) {
                callback(1, "记录不存在")
            } else {
                var ctime = new Date().getTime();
                MetricalInformation.update({_id:pid},{$set:{name_cn:title_zh,name_en:title_en,url:url,region:area,brief_info:content,ctime:ctime}},{},function(error,mis){
                    if(error){
                        callback(1,error);
                    } else{
                        callback(0,"更新成功");
                    }
                });
            }
        });
    }
}

exports.queryByPid = function(pid,callback){
    if(!pid){
        callback(1,"pid不能为空");
    } else{
        MetricalInformation.findById(pid,{},{},function(error,mis){
            if(error){
                callback(1,error);
            } else{
                callback(0,mis);
            }
        });
    }
};

exports.query = function(title_zh,title_en,callback){
    if(!title_zh && !title_en){
        MetricalInformation.find({},function(error,mis){
            if(error){
                callback(1,error);
            } else{
                callback(0,mis);
            }
        });
    }else if(!title_zh && title_en){
        MetricalInformation.find({title_en:title_en},function(error,mis){
            if(error){
                callback(1,error);
            } else{
                callback(0,mis);
            }
        });
    } else if(!title_en && title_zh){
        MetricalInformation.find({title_zh:title_zh},function(error,mis){
            if(error){
                callback(1,error);
            } else{
                callback(0,mis);
            }
        });

    }else {
      callback(null, []);
    }

}


