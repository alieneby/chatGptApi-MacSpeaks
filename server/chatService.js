import fs from "fs"
import { config } from "dotenv"
config()
import { exec } from "child_process"
import register from '../server/plugins/register.js'


let chatService = {
    messages: [],
    ai: null,
    responseModifiers: [],

    init: async function () {
        this.messages = []
        let prompt = fs.readFileSync(process.env.PROMPT_FILE, "utf8")
        prompt = prompt
            .replaceAll('USER_NAME', process.env.USER_NAME)
            .replaceAll('AI_NAME', process.env.AI_NAME)

        this.messages.push({ role: "user", content: prompt })
        register.init();
    },

    msg: async function (userTxt) {
        if ( ! userTxt ) {
            return "please enter a message"
        }

        this.messages.push( { role: "user", content: userTxt } )


        let aiTxt = await this.ai.msg({
            messages: this.messages
        })

        //let aiTxt = 'I am a chatbot.'

        console.log(aiTxt)

        for (let modifier of this.responseModifiers) {
            aiTxt = await modifier("" + aiTxt)
        }

        this.messages.push( { role: "assistant", content: aiTxt } )

        const speak = (text) => {
            exec(`say -v ${process.env.VOICE} "${text}" &`)
        }

        speak(aiTxt)

        return aiTxt
    },

    addResponseModifier: function (modifier, pluginName) {
        console.log("adding modifier " + pluginName)
        this.responseModifiers.push(modifier)
    }


}


export { chatService }