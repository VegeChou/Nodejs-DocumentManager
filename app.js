var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ejs = require('ejs');
var _ = require('underscore');
var app = express();

var mongo = require('./mongo');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser({keepExtensions : true, uploadDir:__dirname+"/data/upload"}));

app.get('/papers', function (req, res) {
    mongo.query(null, null, function (status, result) {
        if (status) {
            res.send(404, '{result:' + result + '}');
        } else {
            var arr = [
                {title_zh: "测试文章名称", title_en: "test paper title", url: "http://www.baidu.com", area: "北京"},
                {title_zh: "测试文章名称", title_en: "test paper title", url: "http://www.baidu.com", area: "北京"}
            ];

            var data = [];
        _.each(result, function(e){
            var o = {
                pid: e._id,
                title_zh: e.name_cn,
                title_en: e.name_en,
                url: e.url,
                area: e.region
            }
            data.push(o);
        })

            console.log(arr);
            console.log(data);

            if (!result || !result.length) return res.render('index', {list: data});
        }
    });
});

app.get('/papers/:pid', function (req, res) {
  var title_zh = req.query.title_zh;
  var title_en = req.query.title_en;
  mongo.query(title_zh, title_en, function (status, result) {
    if (status) {
      res.send(404, '{result:' + result + '}');
    } else {
       console.log(result);
        var arr = [
            {title_zh: "测试文章名称", title_en: "test paper title", url: "http://www.baidu.com", area: "北京"},
            {title_zh: "测试文章名称", title_en: "test paper title", url: "http://www.baidu.com", area: "北京"}
        ];
//
//        var data = [];
//        _.each(result, function(e){
//            var o = {
//                pid: e._id,
//                title_zh: e.name_cn,
//                title_en: e.name_en,
//                url: e.url,
//                area: e.region
//            }
//            data.push(o);
//        })
//        console.log(data);
        if (!result || !result.length) return res.render('index', {list: arr});
    }
  });
});

app.post('/papers', function(req, res) {
    var title_zh = req.body.title_zh;
    var title_en = req.body.title_en;
    var url = req.body.url;
    var area = req.body.area;
    var introduction = req.body.introduction;
    var publication = req.body.publication;

    mongo.add(title_zh,title_en,area,introduction,publication,function(status,result){
        if(status){
            res.send(404,'{result:'+result+'}');
        } else{
            shortintroduction = introduction;
            res.send(200,'{pid:'+result+',title_zh:'+title_zh+',title_en:'+title_en+',url:'+url+',area:'+area+',introduction:'+shortintroduction+'}');
        }
    });
});

app.delete('/papers/:pid',function(req,res){
    var pid = req.params.pid;
    mongo.delete(pid,function(status,result){
        if(status){
            res.send(404,'{result:'+result+'}');
        } else{
            res.send(200,'{result:'+result+'}');
        }
    });

});

app.put('/papers',function(req,res){
    var pid = req.body.pid;
    var title_zh = req.body.title_zh;
    var title_en = req.body.title_en;
    var url = req.body.url;
    var area = req.body.area;
    var introduction = req.body.introduction;
    var publication = req.body.publication;

    mongo.update(pid,title_zh,title_en,url,area,introduction,publication,function(status,result){
        if(status){
            res.send(404,'{result:'+result+'}');
        } else{
            res.send(200,'{result:'+result+'}');
        }
    });
});


//app.use(function (req, res, next) {
//    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
//    mongo.MetricalInformation.find({name_cn: /计量局/}, function (error, mis) {
//        if (error) {
//            return console.error(error)
//        }
//        ;
//        for (var i = 0; i < mis.length; i++) {
//            if (mis[i].name_cn == '国际计量局（BIPM）') {
//                res.write('已存在');
//            } else {
//                res.write(mis[i].name_cn);
//            }
//        }
//        ;
//
//        res.end('over');
//    });
//
//});

app.listen(5000);
