class UserSockets {
  constructor(userId, socket) {
    this.user_id = userId;
    this.sockets = [socket];
  }

  addSocket(socket) {
    this.sockets = [...this.sockets, socket];
  }

  removeSocket(socketId) {
    this.sockets = this.sockets.filter((socket) => socket.id !== socketId);
  }

  notify(type, payload) {
    this.sockets.forEach(async (socket) => {
      console.log("notify to socket", socket.id);
      await socket.emit("notification", { type, payload });
    });
  }
}

module.exports = UserSockets;
