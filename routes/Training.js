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
  var collection = db.get('training');

  collection.find({},{},function(e,docs){
    res.json({status:true,totalItem:20,totalPage:3,pageSize:"8","currentPage":"1",data:docs}),
        console.log(docs)
  });
});
router.post('/addtraining', urlencodedParser,function(req, res, next) {
    console.log(req.body)
    var db = req.db;
    var collection = db.get('training');
    collection.insert([{title : req.body.title,start :req.body.start,end :req.body.end,status :req.body.status,
    allDay :req.body.allDay}])
        .then((docs) => {
            res.json(docs);
        }).catch((err) => {
        // An error happened while inserting
        console.log("Problème lors de l'insertion d'un nouveau session d'entrainement");
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


router.route('/updateTraining/:id').put((req, res, next) => {
        console.log(req.body);
        var db = req.db;
        var collection = db.get('training');
        collection.findOneAndUpdate(req.params.id, {
            $set: req.body
        }, (error, data) => {
            if (error) {
                return next(error);
                console.log(error); 
            } else {
                res.json(data)
                console.log('training updated successfully !')
            }
        });


});
module.exports = router;
