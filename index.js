const express = require('express')
const http = require("http")
const { Server } = require ("socket.io")


const app = express();
const port = 8000;
const cors = require("cors")

const server = http.createServer(app)

app.use(express.json())
app.use(cors())
  

const io = new Server(server, {
  cors:{
    origin:"http://localhost:5173",
    methods:['GET','POST'], 
  },
  reconnection: false
})


io.on('connection',socket=>{

  console.log(`user connected:${socket.id}`)

  socket.on("send-msg",(data)=>{
    socket.broadcast.to(data.conversationId).emit('receive-msg',data)
  })
  //to all exept me
  //socket.broadcast.emit("change-users-in-room")

  socket.on('disconnect',()=>{
    console.log(`user disconnected:${socket.id}`)
  })

  socket.on('join-room',(roomId)=>{
    socket.join(roomId)
    console.log(`user with id:${socket.id} joined room ${roomId}`)

  })


  })

  //io.emit to all clients

  //socket.emit() = only to you



 require("./configs/database.js")


const userController = require("./User/userController.js")
app.use("/user", userController)

const conversationController = require("./Conversation/conversationController.js")
app.use("/conversation",conversationController)










server.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});