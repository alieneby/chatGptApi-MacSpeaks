# WHATS THAT?

It is chat-GPT chat, that speaks.
🤖 This chat reads the responses aloud.
So you can hear the AIs words.

Extra features:
- Stores the chat in a text file (./conversations/)
- Configure your start prompt in the prompt-XX.txt
- Uses OSX say command to speak/read the answer.
- Supports these AIs:
    * chat GPT
    * GPT-3 davinci-002 or davinci-003 (178 B. Parameters)
    * Alpaca (LLAMA by Stanford Univerity) (7 B. Parameters)
    * Luminous by Aleph-Alpha (400 B. Parameters!)


# INSTALLATION

npm install

(You have had to need NodeJs installed on your mac)

# CONFIGURATION

Open the .env file and change it.
Add your OPEN-API-KEY there!

# RUN
Two ways of usage are implemented.

## RUN in terminal (orignal way to chat)

```console
> node script.js
```

<img src="screenshots/terminal.png">


## RUN in Browser (second way to chat)

```console
> node server.js
```

Then click on http://localhost:3000/

<img src="screenshots/web.png">


