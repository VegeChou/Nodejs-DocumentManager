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
app.use(bodyParser({keepExtensions: true, uploadDir: __dirname + "/data/upload"}));

app.get('/papers', function (req, res) {
    mongo.query(null, null, function (status, result) {
        if (status) {
            res.send(404, '{result:' + result + '}');
        } else {
//            var arr = [
//                {title_zh: "测试文章名称", title_en: "test paper title", url: "http://www.baidu.com", area: "北京"},
//                {title_zh: "测试文章名称", title_en: "test paper title", url: "http://www.baidu.com", area: "北京"}
//            ];

            var data = [];
            _.each(result, function (e) {
                var o = {
                    id: e._id,
                    title_zh: e.title_zh,
                    title_en: e.title_en,
                    url: e.url,
                    area: e.area
                }
                data.push(o);
            })
            console.log(data);

            return res.render('index', {list: data});
        }
    });
});

app.get('/papers/:pid', function (req, res) {
    var pid = req.query.pid;
    mongo.queryByPid(pid, function (status, result) {
        if (status) {
            res.send(404, '{result:' + result + '}');
        } else {
            return res.render('index');
        }
    });
});

app.post('/papers', function (req, res) {
    var title_zh = req.body.title_zh;
    var title_en = req.body.title_en;
    var url = req.body.url;
    var area = req.body.area;
    var content = req.body.content;

    mongo.add(title_zh, title_en,url, area, content, function (status, result) {
        if (status) {
            res.send(404, {result:result});
        } else {
            res.send(200,{message:result});
        }
    });
});

app.delete('/papers/:pid', function (req, res) {
    var pid = req.params.pid;
    mongo.delete(pid, function (status, result) {
        if (status) {
            res.send(404, '{result:' + result + '}');
        } else {
            res.send(200, '{result:' + result + '}');
        }
    });

});

app.put('/papers', function (req, res) {
    var pid = req.body.pid;
    var title_zh = req.body.title_zh;
    var title_en = req.body.title_en;
    var url = req.body.url;
    var area = req.body.area;
    var content = req.body.introduction;

    mongo.update(pid, title_zh, title_en, url, area, content, function (status, result) {
        if (status) {
            res.send(404, '{result:' + result + '}');
        } else {
            res.send(200, '{result:' + result + '}');
        }
    });
});

app.get("/add", function(req, res){
  res.render("add");
});

app.listen(5000);
