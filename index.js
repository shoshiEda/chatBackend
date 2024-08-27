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
    origin:"http://localhost:5173"
  }
})


io.on('connection',socket=>{
  console.log(socket.id)

  socket.on("send-msg",(data)=>{
    socket.broadcast.emit('receive-msg',data)
  })

})

 require("./configs/database.js")


const userController = require("./User/userController.js")
app.use("/user", userController)

const conversationController = require("./Conversation/conversationController.js")
app.use("/conversation",conversationController)










server.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});