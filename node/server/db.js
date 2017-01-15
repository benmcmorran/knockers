var FCM = require('fcm-node');

var CLIENT_ID = '907671106649-pgvd57ui911vajogv37qg3158g9k25hn.apps.googleusercontent.com';

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


const uuid = require('uuid/v4');



var pgp = require('pg-promise')(options);
var connectionString = `postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
var db = pgp(connectionString);


module.exports = {
  addUser: addUser,
  addDoor: addDoor,
  addDevice: addDevice,
  ring: ring,
  listDevices: listDevices,
  listDoorbells: listDoorbells
};


function login(token, success, failure, next){
	var auth = new GoogleAuth;
	var client = new auth.OAuth2(CLIENT_ID, '', '');
	client.verifyIdToken( token, CLIENT_ID, function(e, login) {
		var payload = login.getPayload();
		var userid = payload['sub'];
		if(e != null){
			failure();
		} else {
			db.any('select users.uuid from users where users.goog = $1', userid).then(function(data){
				if(data.length < 1){
					var genuuid = uuid();
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

//login('eyJhbGciOiJSUzI1NiIsImtpZCI6ImJlMmZiMmY3ZDQ5ZDQwYjEzYTNmNjM2MjE5MDkzYjcyZmUxNzc5ZTkifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoxNDg0NDQwMjUxLCJleHAiOjE0ODQ0NDM4NTEsImF0X2hhc2giOiJzQmVjNktqLXc2RzYzeEwtY1FrQlVRIiwiYXVkIjoiOTA3NjcxMTA2NjQ5LXBndmQ1N3VpOTExdmFqb2d2MzdxZzMxNThnOWsyNWhuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAzMzM5NDU3NzU0MTAxMzE1ODE2IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjkwNzY3MTEwNjY0OS1wZ3ZkNTd1aTkxMXZham9ndjM3cWczMTU4ZzlrMjVobi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImVtYWlsIjoiYmVuLm1jbW9ycmFuQGdtYWlsLmNvbSIsIm5hbWUiOiJCZW4gTWNNb3JyYW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDQuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1xTnBYZExLRUMwcy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFLZy9VX295ZW8zbkpLSS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiQmVuIiwiZmFtaWx5X25hbWUiOiJNY01vcnJhbiIsImxvY2FsZSI6ImVuIn0.qEKaJmmZW3CswlHZJ4abhdADDjnQ6WrGksHA-5ItBIFmljXE2SK_LzcqRSP5dstZHmQmWOcrps_5EJP6T1pMa3-Lk-aiWvNPWdrk6eqDfGjUFxlSYRHJ0mEaoRZ_bqbLuZGdQ5QmYlbv4rZ4vBr0ddgQCzhGXpFOHV4Uv5vWHI4AExRZnNxfTHAbcx_14mq9jczUNgxln4wnZbC6ndY5oeSMN8fSByAZH7Ry9sdexpPf1CwJuIUk4qLJJWBkIJ0fzhu8tCW_bP1_Kxjpde_Ykyac21HBrkl83JgM2w8CDZA7qScQ1rFlX06LoafzSUrrArn3rJuiSDdK3qSYXuRlQA', function(uuid) { console.log('success ' + uuid);}, function(){ console.log('failure');});



function doorcode(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function listDoorbells(req, res, next){
	console.log(req.body);
	login(req.body.token, function(uuid) {
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
	login(req.body.token, function(uuid) {
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
			req.body.genuuid = uuid();
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



function addDoor(req, res, next){
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
			req.body.genuuid = uuid();
			req.body.doorcode = doorcode();
			db.none('insert into doorbells(uuid, user_uuid, description, doorcode)' + ' values ( ${genuuid}, ${user_uuid}, ${description}, ${doorcode})', req.body).then(function(){
				res.status(200).json({
					status: 'success',
					message: 'Added Doorbell'
				});
			}).catch(function(err) {
				return next(err);
			});
		}
	}).catch(function (err) {
		return next(err);
	});
}


function addUser(req, res, next){
	console.log(req.body);
	db.any('select * from users WHERE name = $1 OR email = $2', [req.body.username, req.body.email])
	.then(function (data) {
		console.log(data);
		if(data.length < 1){
			req.body.genuuid = uuid();
			db.none('insert into users(uuid, name, pass, email)' + ' values( ${genuuid}, ${username}, ${password}, ${email})', req.body)
				.then(function () {
					res.status(200).json({
						status: 'success',
						message: 'Added user'
					});
				})
			.catch(function(err) {
				return next(err);
			});
		} else {
			res.status(409).json({
				status: 'failure',
				message: 'User or email already exists'
			});
		}
})
.catch(function (err) {
	return next(err);
});
}


