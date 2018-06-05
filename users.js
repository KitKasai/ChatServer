'use strict';

const users = new Map();
const debug = require('debug-levels')('users');

let count = 0;
function User(socket, name) {
    this.ws = socket;
    this.rooms = [];
    if (name) {
        this.username = name;
    } else {
        this.username = 'Guest ' + count;
        count++;
    }
    this.on = function(e, callback) {
        this.ws.on(e, callback);
    }

    //remove user from rooms
    this.onClose = function() {
        for (let i = 0; i < this.rooms.length; i++) {
            let roomName = this.rooms[i].name;
            rooms.removeUser(roomName, this);
        }
        users.delete(this.username);
    }
}

function addUser(socket, name) {
    let u = new User(socket, name);
    name = u.username;
    if (users.has(name)) {
        //user already exists
        debug.info('User with name: ' + name + ' already exists.');
    } else {
        users.set(name, u);
    }
    return u;
}

function removeUser(name) {
    users.get(name).onClose();
}

exports = module.exports = {};

exports.addUser = addUser;
exports.removeUser = removeUser;
