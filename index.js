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

const rooms = {}; // { roomName: [user1, user2, ...] }

io.on('connection',socket=>{

  console.log(`user connected:${socket.id}`)

  socket.on("send-msg",(data)=>{
    //console.log(data)
    socket.to(data.conversationName).emit('receive-msg',data)
  })
  //to all exept me
  //socket.broadcast.emit("change-users-in-room")

  socket.on('disconnect', () => {
    const { userName, roomName } = socket;

    if (roomName && rooms[roomName]) {
      rooms[roomName] = rooms[roomName].filter(user => user !== userName)
      io.to(roomName).emit('update-users', rooms[roomName])
    }

    console.log(`User disconnected: ${socket.id}`)
  })


  socket.on('join-room', (roomName, userName) => {
    //console.log(`user ${userName} with id: ${socket.id} has joined room:${roomName}`)
    socket.userName = userName
    socket.roomName = roomName
    if (!roomName || !userName) {
      console.error('Invalid roomName or userName:', roomName, userName);
      return
    }
    if (!rooms[roomName]) {
      rooms[roomName] = []
    }
    
    if(!rooms[roomName].includes(userName))  
      {
        rooms[roomName].push(userName);
      socket.join(roomName)
      console.log(rooms)
      io.to(roomName).emit('update-users', rooms[roomName])
      }
  })

  socket.on('leave-room', (roomName, userName) => {
    //console.log(`${userName} left room: ${roomName}`)
    if (!roomName || !userName) {
      console.error('Invalid roomName or userName:', roomName, userName);
      return
    }
    if(rooms[roomName]) 
      {
        rooms[roomName] = rooms[roomName].filter(user => user !== userName);
        console.log(rooms)

      io.to(roomName).emit('update-users', rooms[roomName]);
      socket.leave(roomName)
      }
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