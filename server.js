import express from "express"
import bodyParser from "body-parser"

import {saveConversationService} from "./server/saveConversationsService.js"
import { chatService } from "./server/chatService.js"
import { config } from "dotenv"
config()

const app = express()
const port = 3000

app.get('/web', async (req, res) => {
    console.log('Hello World!')
    res.send('Hello World!')
});

app.get('/saveAndClear', async (req, res) => {
    console.log('Saving conversation')
    saveConversationService.save( chatService.messages )
    chatService.init();
    res.send('Conversation saved')
});

app.get('/msg', async (req, res) => {
    console.log('msg received')
    let response = await chatService.msg(req.query?.msg)
    res.send(response)
});

app.get('/who', async (req, res) => {
    console.log('/who')
    let response = await chatService.msg(req.query?.msg)
    res.send( {user:  process.env.USER_NAME, ai: process.env.AI_NAME})
});



// serve static files from the client folder and handle json body
app.use(express.json())
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("client"))
//app.use(express.text())


// start the server
let server = app.listen(port, () => {
    console.log( `Example app listening on port ${port}` )
    chatService.init();
})

