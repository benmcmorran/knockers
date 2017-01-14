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
};


function doorcode(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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
})
.catch(function (err) {
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


