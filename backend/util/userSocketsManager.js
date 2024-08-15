const UserSockets = require("./UserSockets");

const userSocketsList = new Map();

function onConnection(socket) {
  // console.log("connection created");

  if (userSocketsList.has(socket.user.id)) {
    // user already is connected thru another socket
    // adding this socket to the user
    userSocketsList.get(socket.user.id).addSocket(socket);
  } else {
    // this is the first connection the user has made
    // create UserSocket object and put in the map
    userSocketsList.set(
      socket.user.id,
      new UserSockets(socket.user.id, socket)
    );
  }

  // Logging
  /* console.log("connected socket", socket.id);
  console.log("CURRENT STATUS");
  console.log("=============================================");
  userSocketsList.forEach((userSocket) => {
    userSocket.sockets.forEach((s) => {
      console.log(userSocket.user_id, s.id);
    });
  });
  console.log("============================================="); */
}

function onDisconnection(socket) {
  // console.log("connection destroyed");

  // remove socket from the user
  // userSocketsList[socket.user.id]?.removeSocket(socket.id);
  if (userSocketsList.has(socket.user.id)) {
    userSocketsList.get(socket.user.id).removeSocket(socket.id);

    // checking if user has any connected sockets
    if (userSocketsList.get(socket.user.id).sockets.length === 0) {
      // this user has no connected sockets

      /// TODO remove the games create by this user from gameManager

      // remove the user from the userSocketsList
      userSocketsList.delete(socket.user.id);
    }
  }

  // Logging
  /* console.log("disconnected socket", socket.id);
  console.log("CURRENT STATUS");
  userSocketsList.forEach((userSocket) => {
    userSocket.sockets.forEach((s) => {
      console.log(userSocket.user_id, s.id);
    });
  });
  console.log("============================================="); */
}

module.exports = {
  userSocketsList,
  onConnection,
  onDisconnection,
};
