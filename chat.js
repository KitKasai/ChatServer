'use strict';

const WebSocket = require('ws');
const EventEmitter = require('events');
const debug = require('debug-levels')('chatserver-chat');

exports = module.exports = {};

//message object
let Message = function(content, username, room) {
    this.content = content;
    this.username = username;
    this.type = 'message';
    if (room) {
        this.room = room;
    } else {
        this.room = 'lobby';
    }
}

exports.Message = Message;

exports.startChatServer = function(server) {
    const wss = new WebSocket.Server({server: server});
    wss.on('connection', function (ws) {
        debug.info('incoming connection');
        //message received
        let user = global.users.addUser(ws);
        //TODO: user sends messages to specific rooms
        rooms.addUser('lobby', user);
        user.on('message', handleMessageCallback(user));
        user.on('close', function() {
            user.onClose()
        });
    });
};

function handleMessageCallback(user) {
    return function (message) {
        //fires when the websocket receives a message
        message = new Message(message, user.username);
        //handle command
        //TODO: maybe handle this logic client side?
        if (message.content.substring(0, 1) === '/') {
            message.content = message.content.substring(1);
            commands.handleCommand(message);
            return;
        }
        //currently, all messages are global
        /*
        TODO: check if user is in a room to be able to
              send to that room
        */
        rooms.sendMessage(message);
    }
}
