import googlePlugin from '../plugins/google/google.js'
import toUppperCaseObj from './toUpperCase/toUpperCase.js'
import chatGptEngine from '../plugins/chatGpt/chatGpt.js'
import gptDavinciEngine from '../plugins/gptDavinci/gptDavinci.js'
import alpacaEngine from '../plugins/alpaca/alpacaEngine.js'
import luminousEngine from '../plugins/luminous/luminousEngine.js'


let registerObj = {
    plugins: [
        // ================
        // ADD YOUR PLUGIN HERE
        // ================

        googlePlugin,
        toUppperCaseObj,
        chatGptEngine,
        alpacaEngine,
        gptDavinciEngine,
        luminousEngine,
    ],
    init: ( chatServiceObj ) => {
        registerObj.plugins
            .filter( obj => obj.isActivated() )
            .forEach( obj => obj.init( chatServiceObj ));

    }
}

export default registerObj;