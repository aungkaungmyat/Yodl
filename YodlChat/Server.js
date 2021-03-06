const express = require('express')
const { createServer } = require('http')
const socketIO = require('socket.io')
const path = require('path')
const randomstring = require('randomstring')
const model = require('../Youtube/quickstart.js');

module.exports = class Server {
  constructor() {
    this.DEFAULT_PORT = 8080

    this.rooms = new Map()

    this.init()

    this.nextRoom()

    this.handleRoutes()
  }

  init() {
    this.app = express();
    // this.app.use(express.urlencoded())
    // this.app.use(express.json())
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
    this.app.post('/searchsong/:songname/:roomID', (req, res) => {
      model(req.params.songname, (error, result) => {
        if(error) {
          res.json(404)
        } else {
          res.send(result)
        }
      })
    })
  }

  nextRoom() {
    const roomID = randomstring.generate(6).toUpperCase()
    this.nextRoomID = roomID
  }

  getNextRoom() {
    this.nextRoom()
    return this.nextRoomID
  }
  
  handleSocketConnection() {
    this.io.on("connection", socket => {
      console.log("Socket connected.");

      socket.on('create', id => {
        console.log('request to join ' + id)
        socket.join(id)
        this.rooms.set(id, '')
      })

      socket.on('join', id => {
        if (this.rooms.has(id)) {
          socket.join(id)
          if (this.rooms.get(id) != '') {
            this.io.to(id).emit('room_video', this.rooms.get(id))
          }
        }
      })

      socket.on('set_video', data => {
        console.log(data)
        this.rooms.set(data.roomID, data.iframe)
        this.io.to(data.roomID).emit('room_video', data.iframe)
      })

      socket.on('start_video', roomID => {
        this.io.in(roomID).emit('room_start')
      })
    })
  }

  listen(callback) {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    )
  }
}