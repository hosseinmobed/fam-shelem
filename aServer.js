const fs = require("fs");
const http = require("http");

const express = require("express");
const app = express();
const server = http.createServer(app);
const Server = require("socket.io");
const io = new Server(server);

const file = fs.readFileSync("./fourOfour.html");

app.use(express.static(__dirname + "/aPublic"));

app.get("*", (req, res) => {
  res.send(file.toString());
});

let uts = {};
let itu = {};

io.on("connection", socket => {
  socket.on("reg", userName => {
    socket.emit('regRes', Object.values(itu));
    uts[userName] = socket;
    itu[socket.id] = userName;
    const demo = Object.values(itu);
    for (const user in uts) {
      if (user === userName) continue;
      uts[user].emit("onlines", demo.filter(curUser => curUser !== user));
    }
  });
  socket.on("send", ({ to, text }) => {
    uts[to].emit("what", { sender: itu[socket.id], text });
  });
  socket.on("disconnect", () => {
    const senderID = socket.id;
    const senderUserName = itu[senderID];
    const demoITU = {};
    const demoUTS = {};
    const demoUserNames = Object.values(itu);
    for (const id in itu) {
      if (id === senderID) continue;
      const uu = itu[id];
      uts[uu].emit('onlines', demoUserNames.filter(curUser => curUser !== senderUserName && curUser !== uu))
      demoITU[id] = uu;
      demoUTS[uu] = uts[uu];
    }
    itu = demoITU;
    uts = demoUTS;
  });
});

server.listen(process.env.PORT);
