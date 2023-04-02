import { chatService } from "../../chatService.js"
import PluginInterface from "../PluginInterface.js"


let toUppperCaseObj = new PluginInterface();

Object.assign(toUppperCaseObj, {
    isAIEngine: false,
    isResponseModifier: true,
    name: 'TO_UPPERCASE_PLUGIN',
    init: async () => {
        chatService.addResponseModifier(toUppperCaseObj.modifier, 'toUppperCasePlugin');
    },

    modifier: async (text) => {
        console.log('toUppperCaseObj.modifier', text)
        text = text.toUpperCase()
        return text;
    }
})

export default toUppperCaseObj;