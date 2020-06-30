
var express = require('express');
var bodyParser = require('body-parser')
var ObjectId = require('mongodb').ObjectID;
var app = express()



// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/client');

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    res.send("achr");
});

router.get('/listdepts', function (req, res, next) {
    var db = req.db;
    var collection = db.get('dept');

    collection.find({}, {}, function (e, docs) {

        res.send(docs);
    })
});

router.get('/getdept/:id', function (req, res, next) {
    var db = req.db;
    var collection = db.get('dept');
    collection.find({ "_id": req.params.id }, {}, function (e, docs) {

        res.send(docs[0]);
    });

});

router.route('/updatedept/:id').put((req, res, next) => {
    var db = req.db;
    var collection = db.get('dept');


    collection.findOneAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error);
        } else {
            res.json(data)
            console.log('departement data updated successfully !')
        }
    });
    //res.json(JSON.stringify(req.body));
});



router.post('/adddept', function (req, res, next) {
    const test = {

    }
    var db = req.db;
    var collection = db.get('dept');

    collection.find({ "_id": req.body._id }, {}, function (e, docs) {
        if (docs == "") {

            collection.insert(req.body, function (err, res1) {
                if (err) throw err;
                else {
                   
                    ///update manager to team manager
                    var db = req.db;
                    var collection = db.get('manager');
                  
                    //console.log(req.body.managers[0]._id)
                    collection.update({ _id: req.body.managers[0]._id }, { $set: { role: "Team Manager"} })
                   /*  collection.findOneAndUpdate(req.body.managers[0]._id, {
                      $set: { role: "Team Manager"}
                      
                  }, (error, data) => {
                      if (error) {
                          return next(error);
                          console.log(error);
                      } else {
                          res.json(data)
                          console.log('managers role data updated successfully !')
                      }
                  });

 */


                    console.log(res1);
                    res.send("dept added successfuly " + res1._id);
                }
            })
                .catch((err) => {
                    // An error happened while inserting
                    console.log("Problème lors de l'insertion d'un nouveau manager");
                }).then(() => {
                    db.close()
                });

        }
        else {
            res.send("dept exists " + docs[0]._id)
            // console.log(JSON.stringify(docs[0]._id))
        }
    });

});

router.route('/deletedept/:id_dept/:id_manager').delete((req, res, next) => {

    var id = new ObjectId(req.params.id_dept);
    var db = req.db;
    var collectionDept = db.get('dept');
    var collectionManagers = db.get('manager');
    var collectionTeachers = db.get('teachers');
    //update manager
     collectionManagers.update({ _id: req.params.id_manager }, { $set: { id_dept: "" ,role :"admin"} }) .then(() => {
        //update teachers
    collectionTeachers.update({ id_dept: id }, { $set: { id_dept: "" } }) .then(() => {})

    collectionDept.remove({ "_id": id }, {}, function (e, docs) {
       // if (e) {throw e;res.send(e);}
        res.json(docs);
    })
    .catch((err)=> res.send(err))
    })  

    
    //res.send("dept deleted")
});


router.route('/affectTeacherDept/:id_teacher/:id_dept').put((req, res, next) => {

    var db = req.db;
    var collection = db.get('teachers');

    collection.find({ _id: req.params.id_teacher }, {}, function (e, docs) {


        if (Object.keys(docs).length === 0 && docs.constructor === Object) {
            res.send('emptydOCS');
        }
        else {

            var teachersdata = docs;
            var newTeacher = docs[0]._id;
            var teacher = docs[0]
            var test = true;
            var collection = db.get('dept');
            // console.log(newSkill);
            collection.find({ _id: req.params.id_dept }, {}, function (e, docs) {
                if (e) {
                    throw e;
 
                }
                else {


                    for (let i = 0; i < docs[0].teachers.length; i++) {
                        if (docs[0].teachers[i]._id+"" === newTeacher+"") {
                            test = false;
                            break;
                        }
                    }
                    ///you have to delete him from the other dept

                    if (test) {


                        if(teacher.id_dept+""){
                           // console.log("d5all ! "+teacher.id_dept)
                            var collectionc = db.get('dept');
                            collectionc.find({ _id: teacher.id_dept }, {}, function (e, docss) {

                               // console.log("1 -"+docss[0].teachers)
                                    docss[0].teachers.forEach(element => {
                                      //  console.log(element._id+"" === teacher._id+"")
                                        if(element._id+"" === teacher._id+"")
                                         docss[0].teachers.splice(docss[0].teachers.indexOf(element), 1);
                                    });
                                   // console.log("2- "+docss[0].teachers)
                            })
                        }
                       // else{


                        var newTeachers = teachersdata.concat(docs[0]['teachers']);
                        console.log("newTeacher : "+newTeacher)

                        ///add teacher to the list in dept
                        collection.update({ _id: req.params.id_dept }, { $set: { teachers: newTeachers } }) .then(() => db.close()); 


                        ///add dept id to teacher
                        var dbt = req.db;
                        var teachercollection = dbt.get('teachers');
                         teachercollection.update({ _id: req.params.id_teacher }, { $set: { id_dept: req.params.id_dept } })
                        .then((data) => {
                             dbt.close() 
                        }); 
                        res.send('UpdateDone');
                      //  }
                }

                    else {
                        res.send('existing teacher')
                    }
                };
            });//dept



        }

    });//teacher
});



module.exports = router;