const express = require('express')

const app = express();
const port = 8000;
const cors = require("cors")

const authenticateToken = require('./middlewere/requireAuth')




 require("./configs/database.js")

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  
const userController = require("./User/userController.js")
app.use("/user", userController)

const conversationController = require("./Conversation/conversationController.js")
app.use("/conversation", authenticateToken,conversationController)










app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});