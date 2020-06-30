var express = require('express');
var bodyParser = require('body-parser')
var ObjectId = require('mongodb').ObjectID;
var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/client');

function extractParamsUrl(chaineGET) {
    chaineGET = chaineGET.split('&');
    var result = {};

    chaineGET.forEach(function(el){
        var param = el.split('=');
        param[0] = param[0].replace('?', '');
        result[param[0]] = param[1];
    });

    return result;
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('teachers');
    var q =extractParamsUrl(req.url)
    if(q.search !==""){
        if(q.orderBy==="name"){
            var query = {
                name: {
                    $regex: q.search,
                    $options: 'i' //i: ignore case, m: multiline, etc
                }
            };
            collection.find(query,{},function(e,docs){
                res.json({status:true,totalItem:20,totalPage:3,pageSize:"8","currentPage":"1",data:docs});
            });
        }else if(q.orderBy==="mail"){
            var query = {
                mail: {
                    $regex: q.search,
                    $options: 'i' //i: ignore case, m: multiline, etc
                }
            };
            collection.find(query,{},function(e,docs){
                res.json({status:true,totalItem:20,totalPage:3,pageSize:"8","currentPage":"1",data:docs});
            });
        }else{
            var query = {
                specialities: {
                    $regex: q.search,
                    $options: 'i' //i: ignore case, m: multiline, etc
                }
            };
            collection.find(query,{},function(e,docs){
                res.json({status:true,totalItem:20,totalPage:3,pageSize:"8","currentPage":"1",data:docs});
            });
        }
    }else{ 
  collection.find({},{},function(e,docs){
    res.json({status:true,totalItem:20,totalPage:3,pageSize:"8","currentPage":"1",data:docs}),
        console.log(docs)
  });}
});
router.post('/addteachers', urlencodedParser,function(req, res, next) {
    console.log(req.body)
    var db = req.db;
    var collection = db.get('teachers');
    collection.insert([{name: req.body.name,img:req.body.img,createDate:req.body.createDate,mail:req.body.mail,
    specialities:req.body.specialities,description:req.body.description}])
        .then((docs) => {
            res.json(docs);
        }).catch((err) => {
        // An error happened while inserting
        console.log("Problème lors de l'insertion d'un nouveau enseignant");
    }).then(() => db.close())
});
router.route('/deleteteacher/:id').delete((req, res, next) => {

    var id =new ObjectId(req.params.id);
    console.log("test:   " + id)
    var db = req.db;
    var collection = db.get('teachers');
    collection.remove({"_id":id},{},function(e,docs){
        if(e) throw e;
        res.json(docs);
    });
});
/*router.post('/updateTeacher/:id', function(req, res, next) {
collection.findOneAndUpdate({_id:req.params.id},{$set: [{name: req.body.name,createDate:req.body.createDate,mail:req.body.mail,
        specialities:req.body.specialities,description:req.body.description}]},{new:true} ,(e,docs)=>{
    console.log(docs)
    if(e) {
        console.log(e);
    }

    res.json(docs);
});*/


router.route('/updateTeacher/:id').put((req, res, next) => {
        console.log(req.body);
        var db = req.db;
        var collection = db.get('teachers');
        collection.findOneAndUpdate(req.params.id, {
            $set: req.body
        }, (error, data) => {
            if (error) {
                return next(error);
                console.log(error);
            } else {
                res.json(data)
                console.log('Teacher updated successfully !')
            }
        });


});
module.exports = router;
