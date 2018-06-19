'use strict';

const WebSocket = require('ws');
const EventEmitter = require('events');
const debug = require('debug-levels')('chat');

exports = module.exports = {};

//message object
let Message = function(content, username, room) {
    this.content = content;
    this.username = username;
    if (room) {
        this.room = room;
    } else {
        this.room = 'lobby';
    }
}

exports.startChatServer = function(server) {
    const wss = new WebSocket.Server({server: server}, function() {
        debug.info('WSS started');
    });
    const messages = new EventEmitter();
    rooms.addRoom('lobby');
    wss.on('connection', function (ws) {
        debug.info('incoming connection');
        //message received
        let user = global.users.addUser(ws);
        //TODO: user sends messages to specific rooms
        rooms.addUser('lobby', user);
        user.on('message', function (message) {
            //currently, all messages are global
            /*
            TODO: check if user is in a room to be able to
                  send to that room
            */
            message = new Message(message, user.username);
            rooms.sendMessage(message);
        });
        user.on('close', function() {
            user.onClose()
        });
    });

    //handle received messages
    messages.on('received', function(message) {
        debug.verbose('received: ' + message);

        //echo to all connected sockets
        messages.emit('send', message);
    });
};
