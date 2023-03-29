
import fs from "fs"

let saveConversationService = {
    save: async function (messages) {

        console.log("=== Conversation ended ===");
        const strDate = new Date().toISOString();
        const fileJson = `conversations/${strDate}.json`
        await fs.writeFileSync(fileJson, JSON.stringify(messages, null, 2))

        let fullTxt = this.buildTxtVersion(messages);
        const fileTxt = `conversations/${strDate}.txt`
        await fs.writeFileSync(fileTxt, fullTxt)

        console.log(`Conversation saved to\n-> ${fileJson}\n-> ${fileTxt}\n`)

        // clear messages
        messages = []
    },

    buildTxtVersion: function(messages) {
        let fullTxt = "";
        messages.forEach((message) => {
            if (fullTxt == "") {
                fullTxt += `${message.content}\n\n`;
    
            } else if (message.role == "user") {
                fullTxt += `\n\n${process.env.USER_NAME}:\n${message.content}\n\n`;
            } else {
                fullTxt += `\n\n${process.env.AI_NAME}:\n${message.content}\n\n`;
            }
        });
        return fullTxt;
    }
}

export { saveConversationService }
