import { chatService } from "../../chatService.js"
import { Configuration, OpenAIApi } from "openai"
import PluginInterface from "../PluginInterface.js"

let chatGptEngine = new PluginInterface();

Object.assign(chatGptEngine, {
    isAIEngine: true,
    isResponseModifier: false,
    name: 'CHATGPT_PLUGIN',

    openAi: null,

    init: function () {
        this.openAi = new OpenAIApi(
            new Configuration({
              apiKey: process.env.OPEN_AI_API_KEY,
            })
        )
        chatService.ai = this;
    },

    msg: async function (param) {
        const response = await this.openAi.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: param.messages,
        })

        let aiTxt = response.data.choices[0].message.content;
        return aiTxt
    },
})

export default chatGptEngine