'use strict';

$(document).ready(function() {
    var socket;
    if (location.protocol === 'https:') {
        socket = new WebSocket(`wss://${document.domain}/`);
    } else {
        socket = new WebSocket(`ws://${document.domain}/`);
    }

    //TODO: validate forms
    $('#login-button').click(function() {
        $.post('login', $('#login-form').serialize(), onLogin);
    });
    $('#register-button').click(function() {
        $.post('register', $('#register-form').serialize(), onRegister);
    });
    $('#register-form').hide();

    $('#switch-to-register').click(function() {
        $('#login-form').hide();
        $('#register-form').show();
    });
    $('#switch-to-login').click(function() {
        $('#login-form').show();
        $('#register-form').hide();
    });

    socket.addEventListener('open', onOpen(socket));
    socket.addEventListener('message', onMessage(socket));
});

function onLogin(data) {
    if (data.success) {
        $('#username').text(data.username);
    }
}

function onRegister(data) {

}

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
