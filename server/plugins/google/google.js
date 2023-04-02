import { chatService } from "../../chatService.js"
import fs from "fs"
import PluginInterface from "../PluginInterface.js"

let googleObj = new PluginInterface();

Object.assign(googleObj, {
    isAIEngine: false,
    isResponseModifier: true,
    name: 'GOOGLE_PLUGIN',

    init: async () => {
        chatService.addResponseModifier(googleObj.modifier, 'googlePlugin');
        let prompt = chatService.messages[0].content;
        prompt += "\nWenn Iris unsicher ist, dann fragt sie Google mit dem Befehl GOOGLE(<text query>) bevor sie antwortet."
        chatService.messages[0].content = prompt;

        //googleObj.modifier('test');
    },

    modifier: async (text) => {
        if (!text || text.length == 0) {
            return text;
        }
        text = googleObj.exampleResponse;
        // search for the pattern GOOGLE(<text query>)
        const regEx = /google\((.*)\)/gmi;
        const matches = regEx.exec(text)
        if ( ! matches || matches.length == 0 || ! matches[1]) {
            return text;
        }

        console.log('matches', matches);
        let search = matches[1];

        let searchResults = await googleObj.googleSearch(search)
        console.log('googleObj.modifier', text, searchResults)
        return text;
    },

    buildPrompForGoodUrls: (searchResults) => {
        let prompt = "Ich habe folgende Links gefunden:\n"
        for (let i = 0; i < searchResults.items.length; i++) {
            let item = searchResults.items[i];
            prompt += `${i+1}. ${item.title}\n`
        }
        prompt += "Welchen Link möchtest du öffnen?"
        return prompt;
    },

    exampleResponse: "GOOGLE(Wann wurde der Flughafen auf Mallorca gebaut?)\n"
    + "Laut meinen Quellen wurde der Flughafen Palma de Mallorca im Jahr 1960 eröffnet.\n"
    +"GOOGLE(Flughafen Eröffnung)\n",

    // do a fetch to google and return the result
    googleSearch: async (text) => {
        console.log('googleSearch()', text)

        let simulateGoogle = true;
        let data;

        if (simulateGoogle) {
            // read json from file
            let jsonStr = await fs.readFileSync('/Users/martinschadler/Sync/htdocs7/gpt3/webDevSimplifiedNode/googleResult.json')
            data = JSON.parse(jsonStr);
        } else {
            data = await googleObj.fetchGoogleResult(text)
        }
        

        return text;
    },

    fetchGoogleResult: async (text) => {
        console.log('google.fetch()', text)

        let q = encodeURIComponent('alien.de ägypten');
        let key = process.env.GOOGLE_API_KEY
        let cx = process.env.GOOGLE_API_CX
        let url = 'https://www.googleapis.com/customsearch/v1'
        let fullUrl = `${url}?key=${key}&cx=${cx}&q=${q}`
        console.log('googleObj.googleSearch', fullUrl)

        const response = await fetch( `${url}?key=${key}&cx=${cx}&q=${q}`)
        const data = await response.json();
        console.log('googleObj.googleSearch', data)

        // save data to file
        //await fs.writeFileSync('/Users/martinschadler/Sync/htdocs7/gpt3/webDevSimplifiedNode/googleResult.json', JSON.stringify(data,null,15))

        return data;
    }
})

export default googleObj;
