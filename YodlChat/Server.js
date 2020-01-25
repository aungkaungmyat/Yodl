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
    if (Object.keys(this.rooms[this.nextRoomID].userStreams).length == 3) {
      this.nextRoom()
    }
    this.rooms[this.nextRoomID].userStreams[data.uid] = data
    return this.nextRoomID
  }
  
  handleSocketConnection() {
    this.io.on("connection", socket => {

      socket.on("join", data => {
        const roomID = this.getNextRoom({
          uid: randomstring.generate(),
          socket,
          streamData: {}
        })

        socket.join(roomID)

        console.log("Should have joined room", this.nextRoomID)

        socket.emit("join_accept", this.nextRoomID)
      })


      console.log("Socket connected.");

      socket.on("video", (data) => {
        console.log(data)
        socket.emit("")
      })
    })
  }

  listen(callback) {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    )
  }
}