import { chatService } from "../../chatService.js"
import PluginInterface from "../PluginInterface.js"
import axios from 'axios'

let luminousEngine = new PluginInterface();

Object.assign(luminousEngine, {
    isAIEngine: true,
    isResponseModifier: false,
    name: 'ENGINE_LUMINOUS_PLUGIN',

    openAi: null,

    init: function () {
        chatService.ai = this;
        /*
        this.msg({messages: [
            {content: 'Hallo', role: 'user'},
            {content: 'Hallo', role: 'user'},
        ]})
        */
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

    // the next method checks, if the prompt is too long for the model. If it is, it will ask the model for a shorter prompt with several requests. It uses the msg method to do the requests.
    shortenPrompt: async function (prompt) {
        let maxTokens = luminousEngine.calculateMaxTokens(prompt);
        if (maxTokens > 0) {
            return prompt;
        }

        let maxTries = 10;
        let tries = 0;
        while (maxTokens <= 0 && tries < maxTries) {
            let lastUserIndex = prompt.lastIndexOf(process.env.USER_NAME + ':');
            let lastAIIndex = prompt.lastIndexOf(process.env.AI_NAME + ':');
            if (lastUserIndex > lastAIIndex) {
                prompt = prompt.substring(0, lastUserIndex);
            } else {
                prompt = prompt.substring(0, lastAIIndex);
            }
            maxTokens = luminousEngine.calculateMaxTokens(prompt);
            tries++;
        }
        if (maxTokens > 0) {
            return prompt;
        } else {
            return '';
        }
    },




    calculateMaxTokens: function (prompt) {
        let userMaxTokens = parseInt(process.env.ENGINE_GPT_DAVINCI_MAX_TOKENS);

        let modelMaxTokens = 2048;

        let availableTokens = modelMaxTokens - prompt.length;
        return availableTokens < userMaxTokens ? availableTokens : userMaxTokens;
    },

    msg: async function (param) {
        let prompt = this.messagesToText(param.messages);
        console.log(prompt)
        let aiTxt = '';

        let params ={
            "model": process.env.ENGINE_LUMINOUS_MODEL,
            prompt: prompt,
            "maximum_tokens": luminousEngine.calculateMaxTokens(prompt),
            temperature: parseFloat(process.env.ENGINE_LUMINOUS_TEMPERATURE),
            stop_sequences: [process.env.USER_NAME + ':', process.env.AI_NAME + ':']
          }
        console.log(prompt)

        let config = {
            method: 'post',
            url: 'https://api.aleph-alpha.com/complete',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + process.env.ENGINE_LUMINOUS_API_KEY
            },
            data : params
        };

        await axios(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                aiTxt = response.data.completions[0].completion;
            })
            .catch((error) => {
                console.log(error);
                aiTxt = ""+ error;
            });

        return aiTxt
    },
})

export default luminousEngine