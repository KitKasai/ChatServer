'use strict';

const debug = require('debug-levels')('chatserver-server');

const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const stdin = process.openStdin();

global.users = require('./users.js');
global.rooms = require('./rooms.js');
global.commands = require('./commands.js');
global.chat = require('./chat.js');
global.login = require('./login.js');

try {
    require.resolve('./config.json');
} catch (e) {
    console.log('config.json not found.');
    console.log('copy the default_config.json file to set up config');
    process.exit();
}
const config = require('./config.json');

var server = http.createServer();
var app = express();

const hostname = config.hostname;
const port = config.port;
const httpsport = config.httpsport;
const secret = (process.env.SESSION_SECRET) ? process.env.SESSION_SECRET : 'secret';
if (!process.env.SESSION_SECRET) {
    console.log('session secret not specified');
    console.log('set environment variable SESSION_SECRET');
    console.log('using default secret (unsecure)');
}
app.use('/client', express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: false
}));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.post('/login', function(req, res, next) {
    if (req.body.username && req.body.password) {
        let userData = {
            username: req.body.username,
            password: req.body.password
        };
        login.login(userData, function(err, user) {
            let resData = {};
            if (err) {
                resData.success = false;
                //TODO handle errors
                debug.error(err);
            } else if (user) {
                resData = loginSuccess(user, req);
            } else {
                resData.success = false;
            }
            res.json(resData);
            res.end();
        });
    }
});
app.post('/register', function(req, res, next) {
    let resData = {};
    if (req.body.username && req.body.password &&
        req.body.passwordconf) {
            resData.conf = true;
        let userData = {
            username: req.body.username,
            password: req.body.password,
            passwordconf: req.body.passwordconf
        };
        login.register(userData, function(err, user) {
            if (err) {
                //TODO handle errors
                debug.error(err);
            } else if (user) {
                resData = loginSuccess(user, req);
            } else {
                resData.success = false;
            }
            res.json(resData);
            res.end();
        });
    }
});

function loginSuccess(user, req) {
    let resData = {};
    resData.success = true;
    resData.username = user.username;
    resData.token = users.generateToken(user.username);
    req.session.userID = user._id;
    return resData;
}
stdin.addListener('data', function(data) {
    data = String(data).trim().split(' ');
});

rooms.addRoom('lobby');
chat.startChatServer(server);
server.on('request', app);
server.listen(port, function() {
    debug.log(`http/ws server listening on ${port}`);
});
