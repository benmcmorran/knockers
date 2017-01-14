var pg = require('pg'); 
var config = {
  user: 'alex', //env var: PGUSER 
  database: 'knockers', //env var: PGDATABASE 
  password: 'hackwpi', //env var: PGPASSWORD 
  host: '130.215.127.139', // Server hosting the postgres database 
  port: 5432, //env var: PGPORT 
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};
 
 
//this initializes a connection pool 
//it will keep idle connections open for a 30 seconds 
//and set a limit of maximum 10 idle clients 
var pool = new pg.Pool(config);
 
console.log('bobo');
// to run a query we can acquire a client from the pool, 
// run a query on the client, and then return the client to the pool 
console.log('awzzz');
pool.query('CREATE TABLE users(uuid VARCHAR(36), name VARCHAR(200), pass VARCHAR(200), email VARCHAR(200))', function(err, result) {
	if(err) {
		return console.error('error running query', err);
	}
	console.log('lord');
});
pool.query('CREATE TABLE devices(uuid VARCHAR(36), name VARCHAR(200), user_uuid VARCHAR(36), regkey VARCHAR(1000))',  function(err, result) {
	if(err) {
		return console.error('error running query', err);
	}
	console.log('lord');
});




pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool 
  // the pool itself will emit an error event with both the error and 
  // the client which emitted the original error 
  // this is a rare occurrence but can happen if there is a network partition 
  // between your application and the database, the database restarts, etc. 
  // and so you might want to handle it and at least log it out 
  console.error('idle client error', err.message, err.stack)
});
