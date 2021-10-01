const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001" ],
    methods: [ "GET", "POST" ]
  }
})

let users = {}

io.on("connection", (socket) => {

  socket.on('join', (userId) => {
    users[userId] = socket.id
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  })

  socket.on("callUser", (data) => {
    io.to(users[data.userToCall]).emit("callUser", { 
      signal: data.signalData,
      from: data.from,
      name: data.name
    })
  })

  socket.on("answerCall", (data) => {
    io.to(users[data.to]).emit("callAccepted", data.signal)
  })

})

server.listen(5000, () => console.log("server is running on port 5000"))