module.exports = function(content, username, room) {
    this.content = content;
    this.username = username;
    if (room) {
        this.room = room;
    } else {
        this.room = 'global';
    }
}
