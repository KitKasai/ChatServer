module.exports = function User(socket, name) {
    this.ws = socket;
    if (name) {
        this.username = name;
    } else {
        this.username = 'Guest';
    }
    this.on = function(e, callback) {
        this.ws.on(e, callback);
    }
}
