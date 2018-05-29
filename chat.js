'use strict';

const WebSocket = require('ws');
const EventEmitter = require('events');
const debug = require('debug-levels')('chat');
const User = require('./User.js');
const Message = require('./Message.js');

exports = module.exports = {};

exports.startChatServer = function(server) {
    const wss = new WebSocket.Server({server});
    const messages = new EventEmitter();

    wss.on('connection', function (ws) {
        debug.info('incoming connection');
        let user = new User(ws);
        //message received
        user.on('message', function (message) {
            //currently, all messages are global
            message = new Message(message, user.username);
            messages.emit('received', message);
        });


        //sending message out to an open socket
        user.onSendCallback = onSend(ws);
        messages.on('send', user.onSendCallback);
        user.on('close', function() {
            messages.removeListener('send', user.onSendCallback);
        })
    });

    //handle received messages
    messages.on('received', function(message) {
        debug.verbose('received: ' + message);

        //echo to all connected sockets
        messages.emit('send', message);
    });
};

//handle sending messages to connected sockets
function onSend(ws) {
    return function(message) {
        let content = message.content;
        let username = message.username;
        let room = message.room;
        //TODO: check if user is in a room before sending

        debug.log(username + ': ' + content);
        //check if socket is open
        if (ws.readyState == 1) {
            ws.send(JSON.stringify(message));
        } else {
            //closed sockets should not have listeners attached
            debug.error('socket closed, message not sent');
        }
    }
}
