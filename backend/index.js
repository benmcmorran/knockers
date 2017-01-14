var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


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

router.post('/ring/:id', function(req, res){
	res.json({message: 'DINGDONG' } );
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
