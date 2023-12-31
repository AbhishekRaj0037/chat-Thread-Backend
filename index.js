const io = require("socket.io")(8000);

users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (userName) => {
    console.log(`${userName} joined the chat`);
    users[socket.id] = userName;
    let totalUser = Object.keys(users).length;
    socket.broadcast.emit("user-joined", userName, totalUser);
    socket.emit("total-user-online", totalUser);
  });

  socket.on("send-message", (msgText) => {
    socket.broadcast.emit("receive", {
      message: msgText,
      userName: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    console.log(`${users[socket.id]} left the chat`);
    let totalUser = parseInt(Object.keys(users).length) - 1;
    socket.broadcast.emit("left-chat", users[socket.id], totalUser);
    socket.emit("total-user-online", totalUser);
    delete users[socket.id];
  });
});
