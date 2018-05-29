'use strict';

$(document).ready(function() {
    $.get('config.json', function(data) {
        console.log(data);
        const config = JSON.parse(data);
        const hostname = config.hostname;
        const port = config.port;

        const socket = new WebSocket(`ws://${document.domain}:${port}/`);
        socket.addEventListener('open', onOpen(socket));
        socket.addEventListener('message', onMessage(socket));
    });
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

        $('#chatbox').css({
            'height' : $('#chatbox').outerHeight() - $('#chatinput').height() - 20,
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
