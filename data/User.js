'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 11, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

UserSchema.statics.authenticate = function(data, callback) {
    User.findOne({username: data.username}).exec(function(err, user) {
        if (err) {
            callback(err);
        } else if (!user) {
            var err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(data.password, user.password, function(err, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                return callback();
            }
        });
    });
}
var User = module.exports = mongoose.model('User', UserSchema);
