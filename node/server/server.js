let express = require('express'),        // call express
    app = express(),                 // define our app using express
    bodyParser = require('body-parser'),
db = require('./db');


var FCM = require('fcm-node');

var serverKey = 'AAAAGdpIsWs:APA91bFtuYzDLTIHn7PFNCMsi8t3onoTG0p1nr03r2f9EvqybDnipMLhKMxPPLX9SM78_f1JhAe_KAyTkbwpMl8uOXBiQIRBpqhdz_2frBC6oamOLysc8wzQB2Bhjmv0giDf8Hj-lheZ';
var fcm = new FCM(serverKey);

var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'eSMgg3-3lfs:APA91bG73BGgBOpCSQMtV8O4tyxoWyJaQ1FCfukYWUWi6xteMP5nbTs7AxZQ90fApnHy9LqWRFpmH7ytaH3yVPrJ9WubOYk0IFIlBtZ-3BhHghat80dMan4EhhHwwTiTn-23hRxdBukY',
    collapse_key: 'your_collapse_key',

    notification: {
        title: 'You are',
        body: 'A fragrant'
    },

    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'FUCK OFF M8'});
});


router.post('/create/:desc', function (req, res) {
    res.json({message: 'u fucked up m8'});
});

router.get('/ring/:id', function (req, res) {
    res.json({message: 'DINGDONG'});
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!\n", err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });


});

router.get('/list/', function (req, res) {
    res.json({message: 'keker'});
});
router.get('/list/:id', function (req, res) {
    res.json(req.params.id);
});

router.post('/adduser', db.addUser);


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
