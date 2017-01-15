var FCM = require('fcm-node');

var CLIENT_ID = '111036379499-0mqihc29hhq2a5ggg235o83hqmadj9ev.apps.googleusercontent.com';

var serverKey = 'AAAAGdpIsWs:APA91bFtuYzDLTIHn7PFNCMsi8t3onoTG0p1nr03r2f9EvqybDnipMLhKMxPPLX9SM78_f1JhAe_KAyTkbwpMl8uOXBiQIRBpqhdz_2frBC6oamOLysc8wzQB2Bhjmv0giDf8Hj-lheZ';
var fcm = new FCM(serverKey);

var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
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


var GoogleAuth = require('google-auth-library');






/**
 * Created by harryliu on 1/14/17.
 */
// Initialize database connection info
let dbUsername = process.env.DB_USER,
    dbPassword = process.env.DB_PASS,
    dbHost = process.env.DB_HOST,
    dbPort = process.env.DB_PORT,
    dbName = process.env.DB_NAME;

var exports = module.exports = {};
var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};


const uuidv4 = require('uuid/v4');



var pgp = require('pg-promise')(options);
var connectionString = `postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
var db = pgp(connectionString);


module.exports = {
  addDoor: addDoor,
  addDevice: addDevice,
  ring: ring,
  listDevices: listDevices,
  listDoorbells: listDoorbells
};


function login(token, next, success, failure){
	var auth = new GoogleAuth;
	var client = new auth.OAuth2(CLIENT_ID, '', '');
	client.verifyIdToken( token, CLIENT_ID, function(e, login) {
		if(e != null){
			failure();
		} else {
			var payload = login.getPayload();
			var userid = payload['sub'];
			db.any('select users.uuid from users where users.goog = $1', userid).then(function(data){
				if(data.length < 1){
					var genuuid = uuidv4();
					db.none(' insert into users (uuid, goog) values($1, $2)', [genuuid, userid]).then(function(){
						success(genuuid);
					}).catch(function(err){ return next(err); });
				} else {
					//todo success
					success(data[0].uuid);
				}
			}).catch(function(err){ return next(err); });
		}
	});
}



function doorcode(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function addDevice(req, res, next){
	console.log(req.body);
	db.any('select * from users WHERE uuid = $1', [req.body.user_uuid])
	.then(function (data) {
		console.log(data);
		if(data.length < 1){
			res.status(404).json ({
				status: 'failure',
				message: 'User does not exist'
			});
		} else {
			req.body.genuuid = uuidv4();
			db.none('insert into devices(uuid, user_uuid, name, regkey)' + ' values ( ${genuuid}, ${user_uuid}, ${name}, ${regkey})', req.body).then(function(){
				res.status(200).json({
					status: 'success',
					message: 'Added Device'
				});
			}).catch(function(err) {
				return next(err);
			});
		}
	}).catch(function (err) {
		return next(err);
	});
}


function addDevice(req, res, next){
	console.log(req.body);
	login(req.body.token, next, function(uuid){
			req.body.genuuid = uuidv4();
			req.body.user_uuid = uuid;
			db.none('insert into devices(uuid, user_uuid, name, regkey)' + ' values( ${genuuid}, ${user_uuid}, ${name}, ${regkey})', req.body).then(function(){
				res.status(200).json({
					status: 'success',
					message: 'Added Device'
				});
			}).catch(function(err) {return next(err);});
	}, function(){
		res.status(404).json({
			status: 'failure',
			message: 'unable to auth'
		});
	});
}


function addDoor(req, res, next){
	console.log(req.body);
	login(req.body.token, next, function(uuid){
			req.body.genuuid = uuidv4();
			req.body.doorcode = doorcode();
			req.body.user_uuid = uuid;
			db.none('insert into doorbells(uuid, user_uuid, description, doorcode)' + ' values ( ${genuuid}, ${user_uuid}, ${description}, ${doorcode})', req.body).then(function(){
				res.status(200).json({
					status: 'success',
					message: 'Added Doorbell'
				});
			}).catch(function(err) {return next(err);});
	}, function(){
		res.status(404).json({
			status: 'failure',
			message: 'unable to auth'
		});
	});
}



function listDoorbells(req, res, next){
	console.log(req.body);
	login(req.body.token, next, function(uuid) {
		db.any(' select doorbells.description, doorbells.doorcode FROM doorbells where doorbells.user_uuid = $1', uuid).then( function(data) {
			if(data.length < 1){
				res.status(404).json({
					status: 'failure',
					message: 'unable to find doorbells'
				});
			} else {
				res.status(200).json({
					status: 'success',
					data: data
				});
			}
		}).catch(function(err){ return next(err); });
	}, function(){
		res.status(404).json({
			status: 'failure',
			message: 'unable to auth'
		});
	});
}
function listDevices(req, res, next){
	console.log(req.body);
	login(req.body.token, next, function(uuid) {
		db.any(' select devices.name FROM devices where devices.user_uuid = $1', uuid).then( function(data) {
			if(data.length < 1){
				res.status(404).json({
					status: 'failure',
					message: 'unable to find devices'
				});
			} else {
				res.status(200).json({
					status: 'success',
					data: data
				});
			}
		}).catch(function(err){ return next(err); });
	}, function(){
		res.status(404).json({
			status: 'failure',
			message: 'unable to auth'
		});
	});
}

function ring(req, res, next){
	console.log(req.body);
	db.any(' select devices.regkey from doorbells inner join devices on devices.user_uuid = doorbells.user_uuid where doorbells.doorcode = $1', req.body.doorcode). then(function(data){
		console.log(data);
		if(data.length < 1){
			res.status(404).json({
				status: 'failure',
				message: 'Unable to ring'
			});
		} else {
			data.forEach( function (d){
				message.to = d.regkey;
				fcm.send(message, function (err, response) {
					if (err) {
//						res.status(404).json({
//							status: 'failure',
//							message: 'Unable to ring'
//						});
					} else {
//						res.status(200).json({
//							status: 'success',
//							message: 'ring'
//						});
					}
				});

			});
						res.status(200).json({
							status: 'success',
							message: 'ring'
						});

			
		}
	}).catch(function(err){
		return next(err);
	});
}
