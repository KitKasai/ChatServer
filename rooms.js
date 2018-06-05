'use strict';

const EventEmitter = require('events');
const debug = require('debug-levels')('rooms');

let rooms = new Map();

function Room(name) {
    this.name = name;
    this.users = [];
    this.messageEmitter = new EventEmitter();

    //send message to all users in room
    this.send = function(message) {
        debug.verbose('sending: ' + message.content);
        for (let i = 0; i < this.users.length; i++) {
            this.users[i].ws.send(JSON.stringify(message));
        }
    }

    this.addUser = function (user) {
        if (this.users.indexOf(user) < 0) {
            debug.verbose('adding user: ' + user.username + ' to room ' + this.name);
            this.users.push(user);
            user.rooms.push(this);
        } else {
            debug.verbose(user.username + ' already in ' + this.name);
        }
    }

    this.removeUser = function(user) {
        let i = this.users.indexOf(user);
        if (i === -1) {
            return false;
        } else {
            this.users.splice(i, 1);
            i = user.rooms.indexOf(this);
            user.rooms.splice(i, 1);
        }
    }
}

function addRoom(roomName) {
    if (rooms.has(roomName)) {
        debug.info('Room with name "' + roomName +'" already exists.');
    } else {
        let r = new Room(roomName);
        rooms.set(roomName, r);
    }
}

function getRoom(roomName) {
    return rooms.get(roomName);
}

function removeRoom(roomName) {
    return rooms.delete(roomName);
}

function addUser(roomName, user) {
    let room = rooms.get(roomName);
    if (room) {
        room.addUser(user);
    }
}

function removeUser(roomName, user) {
    let room = rooms.get(roomName);
    if (room) {
        room.removeUser(user);
    }
}

function sendMessage(message) {
    let room = rooms.get(message.room);
    if (room) {
        room.send(message);
    }
}

exports = module.exports = {};

exports.addRoom = addRoom;
exports.getRoom = getRoom;
exports.removeRoom = removeRoom;
exports.addUser = addUser;
exports.removeUser = removeUser;
exports.sendMessage = sendMessage;
