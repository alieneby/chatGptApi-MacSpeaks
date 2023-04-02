import { chatService } from "../../chatService.js"
import { Configuration, OpenAIApi } from "openai"
import PluginInterface from "../PluginInterface.js"

let davinciEngine = new PluginInterface();

Object.assign(davinciEngine, {
    isAIEngine: true,
    isResponseModifier: false,
    name: 'ENGINE_GPT_DAVINCI_PLUGIN',

    openAi: null,

    init: function () {
        this.openAi = new OpenAIApi(
            new Configuration({
              apiKey: process.env.OPEN_AI_API_KEY,
            })
        )
        chatService.ai = this;
    },

    messagesToText: function (messages) {
        let text = '';
        for (let msg of messages) {
            if ( text === '') {
                text = msg.content + '\n';
            } else {
                let person = msg.role == 'user' ? process.env.USER_NAME : process.env.AI_NAME;
                text += person + ':' + msg.content + '\n';
            }
        }
        text += process.env.AI_NAME + ': ';
        return text;
    },

    calculateMaxTokens: function (prompt) {
        let userMaxTokens = parseInt(process.env.ENGINE_GPT_DAVINCI_MAX_TOKENS);

        let modelMaxTokens
            = process.env.ENGINE_GPT_DAVINCI_MODEL === "text-davinci-002"
            ? 2048
            : 4096;

        let availableTokens = modelMaxTokens - prompt.length;
        return availableTokens < userMaxTokens ? availableTokens : userMaxTokens;
    },

    msg: async function (param) {
        let prompt = this.messagesToText(param.messages);
        console.log(prompt)
        let aiTxt = '';

        let params = {
            model: process.env.ENGINE_GPT_DAVINCI_MODEL,
            prompt: prompt,
            max_tokens: davinciEngine.calculateMaxTokens(prompt),
            temperature: parseInt(process.env.ENGINE_GPT_DAVINCI_TEMPERATURE),
            stop: [process.env.USER_NAME + ':', process.env.AI_NAME + ':']
        }
        console.log(prompt)

        try {
            const response = await this.openAi.createCompletion(params)
            console.log(response.data.choices[0])

            aiTxt = response.data.choices[0].text;
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
                aiTxt = error.response.data;
            } else {
                console.log(error.message);
                aiTxt = error.message;
            }
        }
        return aiTxt
    },
})

export default davinciEngine