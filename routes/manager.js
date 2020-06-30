require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser')
var ObjectId = require('mongodb').ObjectID;
var app = express()


const nodemailer = require('nodemailer');



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

router.get('/listmanagers', function (req, res, next) {
  
  var db = req.db;
  var collection = db.get('manager');

  collection.find({},{},function(e,docs){

    res.send(docs);
  })
 
});

router.get('/getmanagersnodept', function (req, res, next) {
  
  var db = req.db;
  var collection = db.get('manager');

  collection.find({"id_dept":""},{},function(e,docs){

    res.send(docs);
  })
 
});

router.get('/getmanager/:id', function (req, res, next) { 
  var db = req.db;
  var collection = db.get('manager');
  collection.find({ "_id": req.params.id }, {}, function (e, docs) {
    
      res.send(docs[0]);
});
  
});



router.get('/getteambymanager/:id_manager', function (req, res, next) {
  var db = req.db;
  var collection = db.get('manager');
  collection.find({ "_id": req.params.id_manager }, {}, function (e, docs) {

    if (docs == "")
      res.send("manager inexists");
    else {
      var db = req.db;
      var collection = db.get('dept'); 

      collection.find({"_id": docs[0].id_dept },{}, function(e, docs1){
        //console.log(docs1[0].teachers)
        res.send(docs1[0].teachers);
      })
    }
});
  
});

router.route('/changePasswd/:id/:pass').put((req,res,next)=>{
  var db = req.db;
  var collection = db.get('manager');

  collection.findOneAndUpdate(req.params.id, {
    $set: {password : req.params.pass}
}, (error, data) => {
    if (error) {
        return next(error);
        console.log(error);
    } else {
        res.json(data)
        console.log('managers data updated successfully !')
    }
});
})

router.route('/updatemanager/:id').put((req,res,next)=>{
  var db = req.db;
  var collection = db.get('manager');

  
  collection.findOneAndUpdate(req.params.id, {
    $set: req.body
}, (error, data) => {
    if (error) {
        return next(error);
        console.log(error);
    } else {
        res.json(data)
        console.log('managers data updated successfully !')
    }
});
//res.json(JSON.stringify(req.body));
});


router.route('/updatetoteammanager/:id').put((req,res,next)=>{
  var db = req.db;
  var collection = db.get('manager');
  collection.update({ _id: req.params.id}, { $set: { role: "Team Manager"} })
  .then(()=>res.json(data))
  
 /*  collection.findOneAndUpdate(req.params.id, {
    $set: { role: "Team Manager"}
    
}, (error, data) => {
    if (error) {
        return next(error);
        console.log(error);
    } else {
        res.json(data)
        console.log('managers role data updated successfully !')
    } 
});*/
//res.json(JSON.stringify(req.body));
});

//////////////////////////////////////////////////////////////////////////////////////////
router.route('/affectManagerDept/:id_manager/:id_dept').put((req, res, next) => {

  var db = req.db;
  var collection = db.get('manager');

  collection.find({ _id: req.params.id_manager }, {}, function (e, docs) {


      if (Object.keys(docs).length === 0 && docs.constructor === Object) {
          res.send('emptydOCS');
      }
      else {


          var managersdata = docs;
          var managersdata_id_dept = managersdata[0].id_dept;
          var newManager = docs[0]._id;
          var test = true;
          var collection = db.get('dept');

          collection.find({ _id: req.params.id_dept }, {}, function (e, docs) {
              if (e) {
                  throw e;

              }
              else {


                  for (let i = 0; i < docs[0].managers.length; i++) {
                      if (docs[0].managers[i]._id+"" === newManager+"") {
                          test = false;
                          break;

                      }
                  }

                  if (test) { //console.log(managersdata[0])
                   //   var newManagers = managersdata.concat(docs[0]['managers']);

                  // var  oldmanager = []
                  
                   collection.find({ _id: req.params.id_dept}, {}, function (e, docs){
                    var oldmanager = docs[0].managers
                  // console.log(docs[0].managers)
                  //console.log(oldmanager)

                   

                  
     /////////////////////add manager to the list in dept
                     var managersdataAux = managersdata[0]
                     managersdataAux.id_dept =  req.params.id_dept
                     console.log(managersdata[0])

                    // var oldmanagerAux = oldmanager[0]
                     oldmanager[0].id_dept = managersdata_id_dept
                     console.log(oldmanager[0])
                    // oldmanagerAux.id_dept = managersdata_id_dept //managersdata[0].id_dept
                     
                   //  console.log("managersdataAux : "+managersdataAux)
                    // console.log("oldmanagerAux : "+oldmanagerAux)
                    // console.log(oldmanager)
                    
                  
                    collection.update({ _id: req.params.id_dept }, { $set: { managers: managersdata } }) .then(() => db.close()); 
                    collection.update({ _id: managersdata_id_dept }, { $set: { managers: oldmanager } }) .then(() => db.close()); 

                    
                 
                    
                      
                    //  console.log("id_dept : "+req.params.id_dept)
                     // console.log("managersdata : "+managersdata.id_dept)
                     // collection.update({ _id: req.params.id_dept }, { $set: { managers: managersdata } }) .then(() => db.close()); 


       ///////////////////////////////////////add dept id to manager
                        var dbt = req.db;
                      var managercollection = dbt.get('manager');
                        managercollection.update({ _id: oldmanager[0]._id }, { $set:  { id_dept: oldmanager[0].id_dept } })
                      .then((data) => {
                          // dbt.close() 
                      });  

                      managercollection.update({ _id: managersdata[0]._id }, { $set: managersdata[0] })
                      .then((data) => {
                           dbt.close() 
                      });  
                      res.send('UpdateDone');

                    }).then((res)=>{
                      // oldmanager = res[0].managers
                        
                      })
                      
                  }

                  

                  else {
                      res.send('existing manager')
                  }
              };
          });//dept



      }

  });//teacher
});

router.post('/addmanager', function (req, res, next) {
  const test = {
    gmail: req.body.gmail,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    imageUrl: req.body.imageUrl,
    password: req.body.gmailPassword,
    role : "admin",
    id_dept : ""
  }
  var db = req.db;
  var collection = db.get('manager');

  collection.find({ "gmail": test.gmail }, {}, function (e, docs) {


  
    var collection1 = db.get('teachers');
    collection1.find({ "mail": test.gmail }, {},  function (e1, docs1) {      
      if (docs1 == "") //testing teacher's existing
      {
        if (docs == ""  ) { //testing manager's existing

          collection.insert(test, function (err, res1) {
            if (err) throw err;
            else {
              sendMail("welcome to our plateform Brainwave, this is your password "
                + test.password + " you can change it later !", test.gmail);
              console.log(res1);
              res.send("success        " + res1._id);
    
    
            }
          })
            .catch((err) => {
              // An error happened while inserting
              console.log("Problème lors de l'insertion d'un nouveau manager");
            }).then(() => {
              //console.log(test.gmail)
    
              // collection.findOne({"gmail": test.gmail},{},function(e,d){
    
              // }).catch((err)=>console.log(err)) 
    
              db.close()
            });
    
        }
        else {
          res.send("manager exists " + docs[0]._id)
          // console.log(JSON.stringify(docs[0]._id))
        }
      }
      else res.send("he is a teacher !!")
    })

  });

});


router.post('/addteacherfeedback', function (req, res, next) {
  const feedback = {
    manager: req.body.manager,
    rate: req.body.rate,
    feedback: req.body.feedback,
    teacher : req.body.teacher
  }
  var db = req.db;
  var collection = db.get('teachersfeedbacks');

  collection.insert(feedback, function (err, res1) {
    if (err) throw err;
    else {
      res.send("feedback and rate added successfuly")
    }
  })
    .catch((err) => {
      // An error happened while inserting
      console.log("Problème lors de l'insertion d'un nouveau manager");
    });
})


router.get('/getteachersfeedbacks/:idteacher', function (req, res, next) { 
  var db = req.db;
  var collection = db.get('teachersfeedbacks');
  collection.find({}, {}, function (e, docs) {

    if (e) throw e;
    else{

      let  tab = []
    
          docs.forEach(element => {
           // console.log(element.teacher._id+"" == req.params.idteacher+"")
            if(element.teacher._id+"" == req.params.idteacher+"")
            {
              tab.push(element)
            }
            
          });
  
          res.send(tab); 
     }
});
  
});

///////////////////////////////teacher////////////////////////////////
 


  router.get('/listteachers', function (req, res, next) {
  
  var db = req.db;
  var collection = db.get('teachers');

  collection.find({},{},function(e,docs){

    res.send(docs);
  })
 
});

router.get('/listteachersnodept', function (req, res, next) {
  
  var db = req.db;
  var collection = db.get('teachers');

  collection.find({"id_dept" : ""},{},function(e,docs){

    res.send(docs);
  })
 
});

router.get('/getteacher/:id', function (req, res, next) {
  
  var db = req.db;
  var collection = db.get('teachers');

  collection.find({ "_id": req.params.id }, {}, function (e, docs) {
    
    res.send(docs[0]);
});
 
});

router.get('/getteachersbydept/:id_dept', function (req, res, next) {
  
  var db = req.db;
  var collection = db.get('teachers');

  collection.find({ "id_dept": req.params.id_dept }, {}, function (e, docs) {
    
    res.send(docs);
});
 
});

//////////////////////////////////training
router.get('/gettrainings', function(req, res, next) {
  var db = req.db;
  var collection = db.get('training');

  collection.find({},{},function(e,docs){
    res.send(docs)
        ///console.log(docs)
  });
});

///////////mail api
const sendMail = (message,receiver)=>{


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user:  "ahmedpatron7@gmail.com" , //change before git push !!!!
      pass:  "22148971"
  }
});

let mailOptions = {
  from: 'ahmedpatron7@gmail.com', 
  to: receiver,
  subject: 'BrainWave account',
  text: message
};


transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
      return console.log('Error occurs '+err);
  }
  return console.log('Email sent!!!');
});

}


module.exports = router;

