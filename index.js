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

const rooms = {} // { roomName: [user1, user2, ...] }
const privateRooms = {}

io.on('connection',socket=>{

  console.log(`user connected:${socket.id}`)
  socket.on('set-username', (username) => {
    socket.username = username
    console.log('Username set for socket:', socket.id, username);
  });

  socket.on("send-msg",(data)=>{
    //console.log(data)
    socket.to(data.conversationName).emit('receive-msg',data)


    for (let privateRoom in privateRooms) {
      if (privateRoom === data.conversationName) {
        privateRooms[privateRoom].forEach(user => {
          if (!(rooms[data.conversationName] && rooms[data.conversationName].some(u => u.name === user.name))) {
          {
            io.to(user.id).emit('notification',data)
          }  
        }
        });      }
    }
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
    const idx = rooms[roomName].findIndex(user=>user.name ===userName)
    if(idx===-1)  
      {
        rooms[roomName].push({ id: socket.id, name: userName });
      socket.join(roomName)
      io.to(roomName).emit('update-users', rooms[roomName])
      console.log(`${userName} joined room ${roomName}`);
      console.log(rooms,privateRooms)
      }
  })

  socket.on('join-private-room', (roomName, userName) => {
    //console.log(`user ${userName} with id: ${socket.id} has joined room:${roomName}`)
    socket.userName = userName
    socket.roomName = roomName
    if (!roomName || !userName) {
      console.error('Invalid roomName or userName:', roomName, userName);
      return
    }
    if (!privateRooms[roomName]) {
      privateRooms[roomName] = []
    }
    const idx = privateRooms[roomName].findIndex(user=>user.name ===userName)
    if(idx===-1)  
      {
        privateRooms[roomName].push({ id: socket.id, name: userName });
      //console.log(`${userName} joined private room ${roomName}`);
      //console.log(rooms,privateRooms)
      }
  })

  socket.on('leave-room', (roomName, userName) => {
    //console.log(`${userName} left room: ${roomName}`)
    if (!roomName || !userName) {
      console.error('Invalid roomName or userName:', roomName, userName);
      return
    }
    if (rooms[roomName]) {
      rooms[roomName] = rooms[roomName].filter(user => user.id !== socket.id);
      io.to(roomName).emit('update-users', rooms[roomName]);
    }
    socket.leave(roomName);
    //console.log(`${userName} left room ${roomName}`);
    //console.log(rooms,privateRooms)
  })

  socket.on('create-new-room',(data)=>{
  console.log('data',data)
  data.users.forEach(username => {
    const targetSocketId = getSocketIdByUsername(username) 
    console.log('targetSocketId',targetSocketId)
    if (targetSocketId) {
      io.to(targetSocketId).emit('new-room-notification',data)
    }
  })
})


function getSocketIdByUsername(username) {
  const clients = io.sockets.sockets

  for (let [id, socket] of clients) {
    if (socket.username === username) { 
      return id;
    }
  }
  return null;
}

})




  //io.emit to all clients

  //socket.emit() = only to you



 require("./configs/database.js")


const userController = require("./User/userController.js")
app.use("/user", userController)

const conversationController = require("./Conversation/conversationController.js");
const { Socket } = require('net');
app.use("/conversation",conversationController)










server.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});