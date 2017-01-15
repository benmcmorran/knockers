let express = require('express'),        // call express
    app = express(),                 // define our app using express
    bodyParser = require('body-parser'),
    cors = require('cors'),


db = require('./db');



// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;        // set our port


var router = express.Router();              // get an instance of the express Router

/*
router.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET POST OPTIONS");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  console.log(req);
  next();
 });
*/
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'FUCK OFF M8'});
});


router.post('/create/:desc', function (req, res) {
    res.json({message: 'u fucked up m8'});
});

router.get('/list/', function (req, res) {
    res.json({message: 'keker'});
});
router.get('/list/:id', function (req, res) {
    res.json(req.params.id);
});

router.post('/adddoor', db.addDoor);
router.post('/deletedoor', db.deleteDoor);
router.post('/adddevice', db.addDevice);
router.post('/ring', db.ring);
router.post('/listdevices', db.listDevices);
router.post('/listdoorbells', db.listDoorbells);


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
