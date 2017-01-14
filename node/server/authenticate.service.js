/**
 * Created by harryliu on 1/14/17.
 */
let User = require('./user.model');
bcrypt = require('bcryptjs'); // for password encryption
class AuthenticateService {
    authenticate({email, password}) {
        return new Promise((succeed, fail) => {
            User
                .find({
                    where: {
                        email: email
                    }
                })
                .then((result) => {
                    let user = result.dataValues;
                    console.log(password, user.password);
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        console.log(isMatch, err);
                        if (err) fail(err);
                        else succeed(isMatch);
                    });
                })
        });
    }

    addUser({email, password}) {
        return new Promise((succeed, fail) => {
                bcrypt.genSalt(10, (err, salt) => {
                        if (!err) {
                            bcrypt
                                .hash(password, salt, (err, hash) => {
                                    // Create a dummy user
                                    User.sync()
                                        .then(() => {
                                            User
                                                .create({
                                                    email: email,
                                                    password: hash,
                                                    salt: salt
                                                })
                                                .then(succeed, fail);
                                        });
                                });
                        }
                    }
                );
            }
        )
    }
}

module.exports = new AuthenticateService();