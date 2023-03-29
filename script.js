
import fs from "fs"
import { config } from "dotenv"
config()
import { exec } from "child_process"

import { Configuration, OpenAIApi } from "openai"
import readline from "readline"

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
)

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// array of messages, will will grow by user input and AI response
const messages = []

// load file with prompt from filesystem, that is in the same folder as this script
let prompt = fs.readFileSync(process.env.PROMPT_FILE, "utf8")
prompt = prompt
  .replace('USER_NAME', process.env.USER_NAME)
  .replace('AI_NAME', process.env.AI_NAME)

messages.push( { role: "user", content: prompt } )

userInterface.prompt()

userInterface.on("close", async () => {
  console.log("=== Conversation ended ===");
  const strDate = new Date().toISOString();
  const fileJson = `conversations/${strDate}.json`
  await fs.writeFileSync(fileJson, JSON.stringify(messages, null, 2))

  let fullTxt = "";
  messages.forEach((message) => {
    if (fullTxt == "") {
      fullTxt += `${message.content}\n\n`

    } else if (message.role == "user") {
      fullTxt += `\n\n${process.env.USER_NAME}:\n${message.content}\n\n`
    } else {
      fullTxt += `\n\n${process.env.AI_NAME}:\n${message.content}\n\n`
    }
  })
  const fileTxt = `conversations/${strDate}.txt`
  await fs.writeFileSync(fileTxt, fullTxt)

  console.log(`Conversation saved to\n-> ${fileJson}\n-> ${fileTxt}\n`)
  process.exit(0)
})

userInterface.on("line", async input => {
  messages.push( { role: "user", content: input } )

  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  })

  let aiTxt = response.data.choices[0].message.content;

  console.log(aiTxt)

  messages.push( { role: "assistant", content: aiTxt } )

  const speak = (text) => {
    exec(`say -v ${process.env.VOICE} "${text}" &`)
  }

  speak(response.data.choices[0].message.content)

  userInterface.prompt()
})
