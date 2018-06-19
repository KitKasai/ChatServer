'use strict';

const debug = require('debug-levels')('server');

const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const express = require('express');
const stdin = process.openStdin();

global.users = require('./users.js');
global.rooms = require('./rooms.js');
global.commands = require('./commands.js');
global.chat = require('./chat.js');

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

app.use('/client', express.static(__dirname + '/client'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

stdin.addListener('data', function(data) {
    data = String(data).trim().split(' ');
});

rooms.addRoom('lobby');
chat.startChatServer(server);
server.on('request', app);
server.listen(port, function() {
    debug.log(`http/ws server listening on ${port}`);
});
