var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/DMDB');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

var Schema = mongoose.Schema;

var MetricalInformationSchema = new Schema({
	name_cn: String,
	name_en: String,
	url: String,
	region: String,
	brief_info: String,
	publication: String
})

var MetricalInformation = mongoose.model('MetricalInformation',MetricalInformationSchema);

exports.add = function(name_cn,name_en,url,region,brief_info,publication,callback){
  if(name_cn == "" && name_en == ""){
    return callback(1,"名称不能均为空");
  } else{
    MetricalInformation.where('name_cn',name_cn).or().where("name_en",name_en).exec(function(error,mis){
      if(mis.length > 0){
        return callback(1,"已经存在")
      }
      var mi = new MetricalInformation();
      var pid = mi._id;

      mi.name_cn = name_cn;
      mi.name_en = name_en;
      mi.url = url;
      mi.region = region;
      mi.brief_info = brief_info;
      mi.publication = publication;

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

exports.update = function(pid,name_cn,name_en,url,region,brief_info,publication,callback){
    if(name_cn == "" && name_en == ""){
        return callback(1,"名称不能均为空");
    } else {
        MetricalInformation.find({_id: pid}, function (error, mis) {
            if (mis.length > 0) {
                callback(1, "记录不存在")
            } else {
                MetricalInformation.update({_id:pid},{$set:{name_cn:name_cn,name_en:name_en,url:url,region:region,brief_info:brief_info,publication:publication}},{},function(error,mis){
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

exports.query = function(name_cn,name_en,callback){
    if(!name_cn && !name_en){
        MetricalInformation.find({},function(error,mis){
            if(error){
                callback(1,error);
            } else{
                callback(0,mis);
            }
        });
    }else if(!name_cn && name_en){        
        MetricalInformation.find({name_en:name_en},function(error,mis){
            if(error){
                callback(1,error);
            } else{
                callback(0,mis);
            }
        });
    } else if(!name_en && name_cn){
        MetricalInformation.find({name_cn:name_cn},function(error,mis){
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


