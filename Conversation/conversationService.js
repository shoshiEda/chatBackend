const conversationModel = require("./conversationModel")
const userService = require("../User/userService")

const adminConversations = ['Main','Politics','Music','TV shows']

const createAdminConversations = async(username)=>{
    for (const conversation of adminConversations) {
        await createNewConversation('Public',conversation,username,'Admin')
    }}
    

const loadPublicConversations = async(username)=>{
    const conversations = await conversationModel.find({type:'Public'})
    for (const conversation of conversations) {
        await joinToConversation(conversation._id, username)
    }}

const getPublicConversations = async(username)=>{
    const conversations = conversationModel.find({})
    conversations? loadPublicConversations(username) : createAdminConversations(username)
}

const joinToConversation = async (conversasionId,username) =>{
    const conversation = await conversationModel.findById(conversasionId)
    if (!conversation) throw new Error('conversation does not exist!')
    conversation.usersInclude.push(username)
    await conversation.save()
    return {status:'success'}
}

const createNewConversation = async (type,name,username,creator=username) =>{
    const newConversation = type==='Private'?{type,name,usersInclude:[username],msgs:[],blocked:[],creator}:{type,name,usersInclude:userService.getAllUsers(),msgs:[],blocked:[],creator}
    const savedConversation = new conversationModel(newConversation)
    await savedConversation.save()
    return savedConversation
}
 
const sendNewMsg = async(username,conversasionId,msg)=>{
    const conversation = conversationModel.findById(conversasionId)
    if(!conversation)
        throw new Error('conversasionId is not valid!')    
    if (conversation.blocked.includes(username))
        return({status:'blocked user'})
    else{
        conversation.msg.unshift({username,msg})
        conversation.save()
        return ({status:'success'})
    }
}




module.exports = {joinToConversation,createNewConversation,createAdminConversations,loadPublicConversations,getPublicConversations,sendNewMsg}


