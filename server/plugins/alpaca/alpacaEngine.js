import { chatService } from "../../chatService.js"
import Dalai from "dalai"
import {exec} from 'child_process'
import PluginInterface from "../PluginInterface.js"

let alpacaEngine = new PluginInterface();

Object.assign(alpacaEngine, {
    isAIEngine: true,
    isResponseModifier: true,
    name: 'ENGINE_ALPACA_PLUGIN',

    dalai: null,
    stopWords: ['Martin:', 'martin:', 'MARTIN:', '\n\n<end>'],

    init: async function () {
        console.log('alpacaEngine.init() start')
        this.dalai = new Dalai()
        chatService.ai = this;
        console.log('alpacaEngine.init() done')
    },

    stop: () => {
        // get processID of dalai/llama/main
        const cmdGetPID="ps aux | grep \"dalai/llama/main\" | grep -v grep | awk '{print $2}'"
        exec( cmdGetPID, (err, pid, stderr) => {
            if ( pid && pid.trim().match(/^[0-9][0-9]*$/)) {
                const cmdKill = 'kill ' + pid.trim()
                exec( cmdKill, (err, stdout, stderr) => {
                    console.log("kill-cmd", err, stdout, stderr)
                })
            }
        })
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

    msg: async function (param) {
        console.log('alpacaEngine.msg(), ', param)
        let prompt= this.messagesToText(param.messages);
        let promptLength = prompt.length;
        let str = '';
        let end = false;
        let aiResponse = '';

        this.dalai.request({
            model: process.env.ENGINE_ALPACA_MODEL,
            prompt: prompt,

          }, (token) => {
            process.stdout.write(token)
            //console.log(token)
            str += token

            if (str.length < promptLength) {
                return; // no text append from AI yet. It still echos my prompt.
            }
            aiResponse = str.substring( promptLength );

            // if str contains a stop word, stop the dalai/llama/main process
            //console.log('alpacaEngine.msg() stopword: ',  alpacaEngine.stopWords)
            for (let stopWord of alpacaEngine.stopWords) {
                //console.log('alpacaEngine.msg() stopword: ', stopWord)
                let pos = aiResponse.indexOf(stopWord);
                if ( pos < 0 ) {
                    continue;
                }
                console.log('alpacaEngine.msg() stopword: '+  stopWord + ' at pos ' + pos)
                aiResponse = aiResponse.substring(0, pos);
                end = true;
                alpacaEngine.stop();
            }
          })


        let previous = '';
        for ( let i = 0; i < 30; i++ ) {
            console.log('alpacaEngine.msg() i:' + i)
            await new Promise(r => setTimeout(r, 1000));
            if ( end ) {
                console.log('alpacaEngine.msg() end: true')
                return aiResponse;
            }
            if ( str != previous ) {
                // still writing the aiResponse
                console.log('alpacaEngine.msg() '+str)
                previous = str;
                i=0; // set counter to 0

            } else if ( ! str ) {
                console.log('alpacaEngine.msg() waiting for ai to start writing')

            } else {
                console.log('alpacaEngine.msg() waiting. ai is thinking during writing ')
            }
        }
        console.log('alpacaEngine.msg() stop(),  ')
        alpacaEngine.stop();
        end = true;
        return "timeout";
    },

})

export default alpacaEngine