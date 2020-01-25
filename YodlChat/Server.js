const express = require('express')
const { createServer } = require('http')
const socketIO = require('socket.io')
const path = require('path')
const randomstring = require('randomstring')

module.exports = class Server {
  constructor() {
    this.DEFAULT_PORT = 7007

    this.rooms = {}

    this.init()

    this.nextRoom()

    this.handleRoutes()
  }

  init() {
    this.app = express();
    this.httpServer = createServer(this.app)
    this.io = socketIO(this.httpServer)

    this.configureApp()
    this.handleSocketConnection()
  }

  configureApp() {
    this.app.use(express.static(path.join(__dirname, "./public")))
  }

  handleRoutes() {
    this.app.get("/get_room", (req, res) => {
      res.json({roomID: this.getNextRoom()}); 
    })
  }

  nextRoom() {
    const roomID = randomstring.generate()
    this.rooms[roomID] = {
      userStreams: {}
    }
    this.nextRoomID = roomID
  }

  getNextRoom(data) {
    if (Object.keys(this.rooms[this.nextRoomID].userStreams).length == 2) {
      this.nextRoom()
    }
    this.rooms[this.nextRoomID].userStreams[data.uid] = data
    return this.nextRoomID
  }
  
  handleSocketConnection() {
    this.io.on("connection", socket => {
      socket.on("join", data => {
        const roomID = this.getNextRoom({
          uid: socket.id,
          socket,
          streamData: {}
        })

        socket.join(roomID)

        if (Object.keys(this.rooms[roomID].userStreams).length == 2) {
          this.io.in(roomID).emit("room_ready", roomID)
          console.log("the room",this.rooms[roomID])

          // Determine initiator
          const initiatorKey = Object.keys(this.rooms[roomID].userStreams)[0]
          const receptorKey = Object.keys(this.rooms[roomID].userStreams)[1]
  
          const initiatorSocket = this.rooms[roomID].userStreams[initiatorKey].socket
          const receptorSocket = this.rooms[roomID].userStreams[receptorKey].socket

          this.io.to(initiatorSocket.id).emit("start_offer")

          initiatorSocket.on("video", (data) => {
            console.log("I: Got data from", initiatorSocket.id, "should send to", receptorSocket.id, data)
            this.io.to(receptorSocket.id).emit("video",data)
          })

          receptorSocket.on("video", (data) => {
            console.log("R: Got data from", receptorSocket.id, "should send to", initiatorSocket.id, data)
            this.io.to(initiatorSocket.id).emit("video",data)
          })

          // socket.on("video", (data) => {
          //   if (data.type === "offer") {
          //     console.log("Got offer from", socket.id, "should send to", receptorKey)
          //     this.io.to(receptorSocket).emit("video",data)
          //   } else if (data.type === "answer") {
          //     this.io.to(initiatorSocket).emit("video",data)
          //   } else {
          //     socket.emit("video", data)
          //   }
          //   console.log(data)
          // })
        }

        console.log("Should have joined room", this.nextRoomID, this.rooms[this.nextRoomID])
      })

      console.log("Socket connected.");

      
    })
  }

  listen(callback) {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    )
  }
}