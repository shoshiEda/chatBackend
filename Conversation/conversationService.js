const conversationModel = require("./conversationModel")
const userService = require("../User/userService")

const adminConversations = ['Main','Politics','Music','TV shows']

const createAdminConversations = async(username)=>{
    let conversations=[]
    for (const conversation of adminConversations) {
         const newConversation = await createNewConversation('Public',conversation,username,'Admin')
         conversations.push(newConversation)
    }
    return conversations
}
    

const loadPublicConversations = async(username)=>{
    const conversations = await conversationModel.find({type:'Public'})
    for (const conversation of conversations) {
        await joinToConversation(conversation._id, username)
    }
    return conversations
}

const getPublicConversations = async(username)=>{
    const conversations = await conversationModel.find({})
    return conversations.length? loadPublicConversations(username) : createAdminConversations(username)
}

const joinToConversation = async (conversasionId,username) =>{
    const conversation = await conversationModel.findById(conversasionId)
    if (!conversation) throw new Error('conversation does not exist!')
    conversation.usersInclude.push(username)
    await conversation.save()
    return conversation
}

const createNewConversation = async (type,name,username,creator=username) =>{
    const newConversation = {type,name,usersInclude:[username],msgs:[],blocked:[],creator}
    const savedConversation = new conversationModel(newConversation)
    await savedConversation.save()
    return savedConversation
}
 
const sendNewMsg = async(username,conversasionId,msg)=>{
    const conversation = conversationModel.findById(conversasionId)
    if(!conversation)
        throw new Error('conversasionId is not valid!') 
    console.log(conversation)   
    if (conversation.blocked && conversation.blocked.length && conversation.blocked.includes(username))
        return({status:'blocked user'})
    else{
        conversation.msg.unshift({username,msg})
        conversation.save()
        return ({status:'success'})
    }
}

const getConversationById = async(conversasionId)=>{
    const conversation = conversationModel.findById(conversasionId)
    if(!conversation)
        throw new Error('conversasionId is not valid!')    
    return ({conversation})
}




module.exports = {joinToConversation,createNewConversation,createAdminConversations,loadPublicConversations,getPublicConversations,sendNewMsg,getConversationById}


