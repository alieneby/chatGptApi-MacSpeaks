import fs from "fs"
import { config } from "dotenv"
config()
import { exec } from "child_process"

import { Configuration, OpenAIApi } from "openai"

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
)


let chatService = {
    messages: [],
    openAi: null,

    init: function () {
        this.messages = []

        this.openAi = new OpenAIApi(
            new Configuration({
              apiKey: process.env.OPEN_AI_API_KEY,
            })
        )

        let prompt = fs.readFileSync(process.env.PROMPT_FILE, "utf8")
        prompt = prompt
            .replace('USER_NAME', process.env.USER_NAME)
            .replace('AI_NAME', process.env.AI_NAME)

        this.messages.push({ role: "user", content: prompt })
    },

    msg: async function (userTxt) {
        if ( ! userTxt ) {
            return "please enter a message"
        }

        this.messages.push( { role: "user", content: userTxt } )

        const response = await openAi.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: this.messages,
        })

        let aiTxt = response.data.choices[0].message.content;

        console.log(aiTxt)

        this.messages.push( { role: "assistant", content: aiTxt } )

        const speak = (text) => {
            exec(`say -v ${process.env.VOICE} "${text}" &`)
        }

        speak(aiTxt)

        return aiTxt
    }


}


export { chatService }