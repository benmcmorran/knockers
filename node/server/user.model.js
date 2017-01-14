/**
 * Created by harryliu on 1/14/17.
 */
let db = require('./db');

module.exports = db.sequelize.define('user', {
    email: {
        type: db.Sequelize.STRING,
        field: 'email'
    },
    password: {
        type: db.Sequelize.STRING,
        field: 'password'
    }
}, {
    freezeTableName: true
});