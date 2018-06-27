'use strict';

var socket;
$(document).ready(function() {
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
    console.log('login data');
    console.log(data);
    if (data.success) {
        socket.send('/login ' + data.token);
    }
}

function onRegister(data) {
    console.log('register data');
    console.log(data);
    if (data.success) {
        socket.send('/login ' + data.token);
    }
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
        if (msg.type === 'message') {
            $('#chatbox').append('<p>' + username + ': ' + content + '</p>');
        }
        if (msg.type === 'namechange') {
            $('#username').text(msg.content);
        }
    }
}
