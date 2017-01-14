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



var pgp = require('pg-promise')(options);
var connectionString = `postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
var db = pgp(connectionString);


module.exports = {
  addUser: addUser,
};


function addUser(req, res, next){
	console.log(req.body);
	db.any('select * from users WHERE name = $1 OR email = $2', [req.body.username, req.body.email])
	.then(function (data) {
		console.log(data);
		if(data.length < 1){
			db.none('insert into users(name, pass, email)' + 'values(${username}, ${password}, ${email})', req.body)
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


