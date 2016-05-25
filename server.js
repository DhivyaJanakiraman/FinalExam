var express 		= require('express');
var path 		= require("path");
var bodyParser 		= require("body-parser");
var mongodb 		= require("mongodb");
var app 		= express();
var MongoClient 	= require('mongodb').MongoClient;
var mongo_url     	= 'mongodb://ec2-54-201-42-131.us-west-2.compute.amazonaws.com:27017/mydb';
var ObjectID 		= mongodb.ObjectID;



var COLLECTION = "mydb";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

var db;




mongodb.MongoClient.connect(mongo_url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

app.get("/mydb", function(req, res) {
  //res.send('<html><body>ec2-54-201-42-131.us-west-2.compute.amazonaws.com<p>HEllo World #1</p></body></html>')
  db.collection(COLLECTION).find({mykey:'Hello World #1'}).toArray(function(err, docs) {
    if (err) {
      //handleError(res, err.message, "Failed to get users.");
      console.log("failed to get users");

    } else {

      res.status(200).json(docs);
    }
  });

});


app.post("/mydb", function(req, res) {
  console.log("in post for users");
  var newUser= req.body;
  
  if (!(req.body.username)) {
    res.send("error");
    //(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(COLLECTION).insertOne(newUser, function(err, doc) {
    if (err) {
     // handleError(res, err.message, "Failed to create new contact.");
     console.log("failed to create new contact");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
  
});



