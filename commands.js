'use strict';

const EventEmitter = require('events');
const debug = require('debug-levels')('chatserver-commands');
exports = module.exports = {};

let commands = new Map();

function handleCommand(message) {
    let text = message.content.split(' ');
    let command = {
        msg: message,
        type: text[0],
        args: text.slice(1)
    };
    commands.get(command.type)(command);
}

function addCommand(names, callback) {
    for (let i = 0; i < names.length; i++) {
        commands.set(names[i], callback);
    }
}

addCommand(['nick', 'nickname'], function(command) {
    if (command.args.length < 1) {
        //TODO: send errors to client
        debug.verbose('expected 1 argument');
        return;
    }
    users.changeName(command.msg.username,command.args[0]);
});

addCommand(['login'], function(command) {
    if (command.args.length < 1) {
        //TODO: send errors to client
        debug.verbose('expected 1 argument');
        return;
    }
    users.authenticate(command.msg.username,command.args[0]);
});

exports.handleCommand = handleCommand;
