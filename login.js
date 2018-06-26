'use strict';

exports = module.exports = {};

const mongoose = require('mongoose');
const User = require('./data/User.js');
const debug = require('debug-levels')('chatserver-login');

mongoose.connect('mongodb://localhost/chatserver')

function login(data, callback) {
    User.authenticate(data, callback);
}

function register(data, callback) {
    debug.log('login data:');
    debug.log(data);
    if (data.password === data.passwordconf) {
        User.create(data, callback);
    }
}

exports.login = login;
exports.register = register;
