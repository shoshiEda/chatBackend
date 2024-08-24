const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const userModel = require("./userModel")
const conversationServise = require("../Conversation/conversationService")

const secret =process.env.SECRET1 || 'Secret'

const saltRounds = 10


const login = async (username, password) =>{
    if (!username || !password) {
        return{token:null,error:'Username and password are required'}
    }

    const users = await userModel.find({})
    if(! users) return{token:null,error: "No users. please sign up"}
    const user = users.find(user=>user.userName===username)
    if(!user) return{token:null,error: "Invalid username or password"}

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
    if(isPasswordCorrect){
        await userModel.findByIdAndUpdate(user._id,{isLoggedIn:true})
        const token =  jwt.sign({userId:user._id,userName:username,conversations:user.conversations}, secret)
        if(token)   return { token } 
    }
    else return{token:null,error: "Invalid username or password"}           
}

const signup = async (newData) =>{

        if (!newData.username || !newData.password) {
            throw new Error('Username and password are required');
        }
        const userNames = await userModel.find({}).select('userName')
        const user = userNames.find(userName => userName.userName===newData.username)
        if(user) return{token:null,error: "username already exist"}

        const hashedPassword = await bcrypt.hash(newData.password, saltRounds)
        const publicConversasions = await conversationServise.getPublicConversations(newData.username)
        const newUser = {userName:newData.username,passwordHash:hashedPassword,conversations:publicConversasions,isLoggedIn:true }
        updatedNewUser = new userModel(newUser)
        await updatedNewUser.save()            
        const token =  jwt.sign({userId:updatedNewUser._id,userName:newData.username,conversations:publicConversasions}, secret)
        if(token)   return { token }  
    }

    const logout = async(userId)=>{
        await userModel.findByIdAndUpdate(userId,{isLoggedIn:false})
        return {status:"success"}
    }


    const getAllUsers = async()=>{
        const users = await userModel.find({isLoggedIn:true},'userName') 
        return users.map(user => user.userName)
    }

    const addUserToConversation = async(conversation,username)=>{
        const updatedUser = await userModel.findOneAndUpdate(
            { userName: username },
            { $push: { conversations: conversation } },
            { new: true, useFindAndModify: false } 
        )
        return updatedUser
    }

    const getUserById = async(id)=>{
        return userModel.findById(id)
    }



module.exports = {login,signup,logout,getAllUsers,addUserToConversation,getUserById}


