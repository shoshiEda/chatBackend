const express = require("express")
const router = express.Router()
const conversationService = require("./conversationService.js")


router.post("/", async (req,res) => {       //create new room

    const {type,name,username} = req.body
    
    if (!username || !type || !name ) return res.status(401).send({error: "missing details"})
    try{
        const { savedConversation } = await conversationService.createNewConversation(type,name,username)
        res.json({savedConversation})
    }
    catch (err) {
        console.error(`There was an error to create a new room:${err}`)
        res.status(500).send({ error: "An internal server error occurred" });
    }
})

router.post("/msg/:conversationId", async (req,res) => {            //add a new msg
        try{
        const {conversationId} = req.params.conversationId
        const{username,msg} = req.body
        if (!username || !msg || conversationId) return res.status(401).send({error: "missing details"})
        const {status} = await conversationService.sendNewMsg(username,conversasionId,msg)
        res.json({status})
    }
    catch (err) {
        console.error(`There was an error to sign up:${err}`)
        res.status(500).send({ err})
    }
})

router.post("/user/:conversationId/:username", async (req,res)=>{            //joinToConversation
    try{
        const {username} = req.params.userId
        const {conversationId} = req.params.conversationId
        const {status} = await conversationService.joinToConversation(conversationId,username)
        res.json({status})
        }
    catch (err) {
        console.error(`There was an error to logout:${err}`)
        res.status(500).send({ err})
    }
})

router.get("/", async (req,res)=>{
    try{
        const usernamesArr = await userService.getAllUsers()
        res.json({users:usernamesArr})
        }
    catch (err) {
        console.error(`There was an error to logout:${err}`)
        res.status(500).send({ err})
    }
})





module.exports = router





