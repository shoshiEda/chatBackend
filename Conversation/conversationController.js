const express = require("express")
const router = express.Router()
const conversationService = require("./conversationService.js")


router.post("/", async (req,res) => {       //create new room

    const {type,name,username} = req.body

    
    if (!username || !type || !name ) return res.status(401).send({error: "missing details"})
    try{
        const newConversation = await conversationService.createNewConversation(type,name,username)

        res.json({newConversation})
    }
    catch (err) {
        console.error(`There was an error to create a new room:${err}`)
        res.status(500).send({ error: "An internal server error occurred" });
    }
})

router.get("/:conversationId", async (req,res) => {            //add a new msg
    try{
    const {conversationId} = req.params
    if (!conversationId) return res.status(401).send({error: "missing details"})
    const {conversation} = await conversationService.getConversationById(conversationId)
    res.json({conversation})
}
catch (err) {
    console.error(`There was an error to sign up:${err}`)
    res.status(500).send({ err})
}
})

router.post("/msg/:conversationId", async (req,res) => {            //add a new msg
        try{
        const {conversationId} = req.params
        const{username,msg} = req.body
        console.log(conversationId,username,msg)
        if (!username || !msg || !conversationId) return res.status(401).send({error: "missing details"})
        const {msgs} = await conversationService.sendNewMsg(username,conversationId,msg)
        res.json({conversationId, msgs})
    }
    catch (err) {
        console.error(`There was an error to add new msg:${err}`)
        res.status(500).send({ err})
    }
})

router.post("/user/:conversationId/:username", async (req,res)=>{            //joinToConversation
    try{
        const {username} = req.params.userId
        const {conversationId} = req.params
        const {status} = await conversationService.joinToConversation(conversationId,username)
        res.json({status})
        }
    catch (err) {
        console.error(`There was an error to join to conversation:${err}`)
        res.status(500).send({ err})
    }
})

router.get("/:conversationId", async (req,res)=>{                   //get selected conversation
    try{
        const {conversationId} = req.params
        const conversation = await conversationService.getconversationById(conversationId)
        res.json(conversation)
        }
    catch (err) {
        console.error(`There was an error to get conversation:${err}`)
        res.status(500).send({ err})
    }
})





module.exports = router





