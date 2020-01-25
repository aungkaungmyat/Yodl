const express = require('express')
const { createServer } = require('http')
const socketIO = require('socket.io')
const path = require('path')

module.exports = class Server {
  constructor() {
    this.DEFAULT_PORT = 7007

    this.init()

    //this.handleRoutes()
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
    this.app.get("/", (req, res) => {
      res.send(`<h1>Hello World</h1>`); 
    })
  }
  
  handleSocketConnection() {
    this.io.on("connection", socket => {
      console.log("Socket connected.");
    })
  }

  listen(callback) {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    )
  }
}