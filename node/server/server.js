var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


var gcm = require('node-gcm');
 
 
// Set up the sender with you API key, prepare your recipients' registration tokens. 
var sender = new gcm.Sender('AAAAGdpIsWs:APA91bFtuYzDLTIHn7PFNCMsi8t3onoTG0p1nr03r2f9EvqybDnipMLhKMxPPLX9SM78_f1JhAe_KAyTkbwpMl8uOXBiQIRBpqhdz_2frBC6oamOLysc8wzQB2Bhjmv0giDf8Hj-lheZ');



var regTokens = ['APA91bG73BGgBOpCSQMtV8O4tyxoWyJaQ1FCfukYWUWi6xteMP5nbTs7AxZQ90fApnHy9LqWRFpmH7ytaH3yVPrJ9WubOYk0IFIlBtZ-3BhHghat80dMan4EhhHwwTiTn-23hRxdBukY'];




var message = new gcm.Message({
    data: { key1: 'msg1' ,
	    title: 'kekekekekekke' }
});


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port



var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'FUCK OFF M8' });   
});


router.post('/create/:desc', function(req, res){
	res.json({message: 'u fucked up m8' } );
});

router.get('/ring/:id', function(req, res){
	res.json({message: 'DINGDONG' } );

sender.send(message, { to: regTokens }, function (err, response) {
    if(err) console.error(err);
    else 	console.log(response);
});





});

router.get('/list/', function(req, res) {
	res.json({message: 'keker' } );
});
router.get('/list/:id', function(req, res) {
	res.json(req.params.id);
});



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
