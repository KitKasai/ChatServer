$(document).ready(function() {
    onResize();
    $(window).resize(onResize);
});

function onResize() {
    $('#chat').css({
        'height' : window.innerHeight - $('#login').height() - 80,
    });
    $('#chatbox').css({
        'height' : $('#chat').outerHeight() - $('#chatinput').height() - 40,
    });
}
