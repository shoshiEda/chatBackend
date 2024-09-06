const conversationModel = require("./conversationModel")
delete require.cache[require.resolve('../User/userService')];
const userService = require("../User/userService")

const adminConversations = ['Main','Politics','Music','TV shows']

const MAX_MSG = 20


const createAdminConversations = async(username)=>{
    let conversations=[]
    for (const conversation of adminConversations) {
         const newConversation = await createNewConversation('Public',conversation,username,'Admin')
         conversations.push({id:newConversation._id,name:newConversation.name})
    }
    return conversations
}
    

const loadPublicConversations = async(username)=>{
    const conversations = await conversationModel.find({type:'Public'})
    if(conversations && conversations.length){
        return conversations.map(con=> ({id:con._id,name:con.name}))
    }
    return {}
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
    await userService.addUserToConversation({id:conversasionId,name:conversation.name},username)
    return {status:'success'}
}

const createNewConversation = async (type,name,username,creator=username) =>{
    const newConversation = {type,name,usersInclude:[username],msgs:[],blocked:[],creator}
    const savedConversation = new conversationModel(newConversation)
    await savedConversation.save()
    await userService.addUserToConversation({id:savedConversation._id,name:savedConversation.name},username)
    return savedConversation
}
 
const sendNewMsg = async(username,conversationId,msg)=>{
    const conversation = await conversationModel.findById(conversationId)
    if(!conversation || conversation.length)
        throw new Error('conversasionId is not valid!')    
    if (conversation.blocked && conversation.blocked.length && conversation.blocked.includes(username))
        return({status:'blocked user'})
    else{
        conversation.msgs.unshift({username,msg})
        if(conversation.msgs.length > MAX_MSG)
        {
            const newMsgs = conversation.msgs.slice(0, MAX_MSG)
            console.log(newMsgs.length)
            conversation.msgs = newMsgs
        }
        conversation.save()
        return ({msgs:conversation.msgs})
    }
}

const getconversationById = async(conversationId)=>{
    const conversation = await conversationModel.findById(conversationId)
    if(!conversation)
        throw new Error('conversasionId is not valid!')    
    else{
        return (conversation)
    }
}




module.exports = {joinToConversation,createNewConversation,createAdminConversations,loadPublicConversations,getPublicConversations,sendNewMsg,getconversationById}


