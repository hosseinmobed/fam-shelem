const fs = require("fs");
const http = require("http");

const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const file = fs.readFileSync("./fourOfour.html");

app.use(express.static(__dirname + "/aPublic"));

app.get("*", (req, res) => {
  res.send(file.toString());
});

const uts = {};
const itu = {};

io.on("connection", socket => {
  socket.on("reg", userName => {
    uts[userName] = socket;
    itu[socket.id] = userName;
  });
  socket.on("send", ({ to, msg }) => {
    uts[to].emit("what", itu[socket.id] + ": " + msg);
  });
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log("listening on *: " + port);
});
