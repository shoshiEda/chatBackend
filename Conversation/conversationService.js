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
    if(conversation.usersInclude.includes(username)) throw new Error("username already exist in this conversation");
    
    conversation.usersInclude.push(username)
    await conversation.save()
    await userService.addUserToConversation({id:conversasionId,name:conversation.name},username)
    return {status:'success'}
}

const exitFromConversation = async (conversasionId,username) =>{
    const conversation = await conversationModel.findById(conversasionId)
    if (!conversation) throw new Error('conversation does not exist!')
    conversation.usersInclude = conversation.usersInclude.filter(user => user !== username);
    await conversation.save()
    const updatedUser = await userService.removeUserFromConversation({id:conversasionId,name:conversation.name},username)
    //console.log('updatedUser:',updatedUser)
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
        conversation.msgs.push({username,msg})
        if(conversation.msgs.length > MAX_MSG)
        {
            const newMsgs = conversation.msgs.slice(conversation.msgs.length-MAX_MSG, conversation.msgs.length)
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

const blockUserFromConversation = async(conversationId,usernames)=>{
    const conversation = await conversationModel.findById(conversationId)
    //console.log('usernames:',usernames)
    if(!conversation)
        throw new Error('conversasionId is not valid!')    
    else{
                conversation.blocked=usernames
                await conversation.save()
        }
}




module.exports = {joinToConversation,createNewConversation,createAdminConversations,loadPublicConversations,getPublicConversations,sendNewMsg,getconversationById,blockUserFromConversation,exitFromConversation}


