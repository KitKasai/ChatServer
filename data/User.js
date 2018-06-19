'use strict';
const mongoose = require('mongoose');
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
module.exports = mongoose.model('User', UserSchema);
