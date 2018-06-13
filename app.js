'use strict';

const debug = require('debug-levels')('server');

const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
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

const hostname = config.hostname;
const port = config.port;
const httpsport = config.httpsport;

const options = {
    key: fs.readFileSync(config.key),
    cert: fs.readFileSync(config.cert)
};

const server = http.createServer(serverCallback);
const httpsserver = https.createServer(options, serverCallback);

server.listen(port, hostname, function() {
    debug.info(`Server running at http://${hostname}:${port}/`);
    chat.startChatServer(server);
});
httpsserver.listen(httpsport, hostname, function() {
    debug.info(`Server running at http://${hostname}:${httpsport}/`);
    chat.startChatServer(httpsserver);
});

function serverCallback(req, res) {
    let method = req.method;
    if (method === 'GET') {
        requestGet(req, res);
    } else if (method === 'POST') {
        requestPost(req, res);
    }
}

//handle HTTP get requests
function requestGet(req, res) {
    let pathname = url.parse(req.url).pathname;
    if (pathname === '/') {
        pathname = 'client/index.html';
    } else {
        pathname = pathname.substr(1);
    }
    debug.verbose("request for " + pathname);

    fs.readFile(pathname, function (err, data) {
        if (err) {
            debug.verbose(err);
            //404: not found
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write("404 page not found");
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data.toString());
        }

        res.end();
    });
}

function requestPost(req, res) {
    debug.log('post request received');
    let body = '';
    req.on('data', function(chunk) {
        body += chunk.toString();
    });
    req.on('end', function() {
        debug.log(body);
    });
}

stdin.addListener('data', function(data) {
    data = String(data).trim().split(' ');
});

rooms.addRoom('lobby');
