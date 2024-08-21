const express = require("express")
const router = express.Router()
const userService = require("./userService.js")


// http://localhost:8000/user/login
router.post("/login", async (req,res) => {

    const {username,password} = req.body
    
    if (!username || !password) return res.status(401).send({error: "username and password are required"})
    try{
        const response = await userService.login(username,password)
        if (response.token) {
        res.json({success: true,token:response.token})
        }else{
            console.error(`There was an error to log in: ${response.error}`);
            res.status(401).json({ success: false, error: response.error });
        }
    }
    catch (err) {
        console.error(`There was an error to logged in:${err}`)
        res.status(500).send({ error: "An internal server error occurred" });
    }
})

router.post("/signup", async (req,res) => {
        try{
        const {username,password} = req.body 
        if (!username || !password) return res.status(401).send({error: "username and password are required"})
        const signupData = await userService.signup({username,password})
        if(signupData.token){
            res.json({success: true,token:signupData.token})
        }
        else{
            console.error(`There was an error to sign up:${signupData.error}`)
            return res.status(401).json({ success: false, error: signupData.error });
        }
    }
    catch (err) {
        console.error(`There was an error to sign up:${err}`)
        res.status(500).send({ err})
    }
})

router.post("/logout", async (req,res)=>{
    try{
        const {userId} = req.body 
        const {status} = await userService.logout(userId)
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





