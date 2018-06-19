'use strict';

$(document).ready(function() {
    const socket = new WebSocket(`ws://${document.domain}/`);
    socket.addEventListener('open', onOpen(socket));
    socket.addEventListener('message', onMessage(socket));
});

function onOpen(socket) {
    return function() {
        console.log('socket open');
        $('#chatinput').keydown(function(event) {
            if (event.key === 'Enter') {
                const text = $('#chatinput').val();
                console.log('sent: ' + text);
                socket.send(text);
                $('#chatinput').val('');
            }
        });
    }
}

function onMessage(socket) {
    return function(message) {
        let msg = JSON.parse(String(message.data));
        let content = msg.content;
        let username = msg.username;
        let room = msg.room;
        console.log('received: ' + message.data);
        $('#chatbox').append('<p>' + username + ': ' + content + '</p>');
    }
}
