import googlePlugin from '../plugins/google/google.js'
import toUppperCaseObj from './toUpperCase/toUpperCase.js'
import chatGptEngine from '../plugins/chatGpt/chatGpt.js'
import alpacaEngine from '../plugins/alpaca/alpacaEngine.js'


let registerObj = {
    plugins: [
        // ================
        // ADD YOUR PLUGIN HERE
        // ================

        googlePlugin,
        toUppperCaseObj,
        chatGptEngine,
        alpacaEngine,

    ],
    init: ( chatServiceObj ) => {
        registerObj.plugins
            .filter( obj => obj.isActivated() )
            .forEach( obj => obj.init( chatServiceObj ));

    }
}

export default registerObj;