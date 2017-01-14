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
let Sequelize = require('sequelize');
exports.Sequelize = Sequelize;
exports.sequelize = new Sequelize(`postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`);