// new interface, that other classes can extend / implement

export default class PluginInterface {
    isAIEngine = false
    isResponseModifier = false
    name = 'NAME FOR ENVIRONMENT VARIABLE'
    async init() {
        console.log('PluginInterface.init() PLEASE OVERRIDE THIS METHOD')
    }
    async modifier(arrMessages) {
        console.log('PluginInterface.modifier() PLEASE OVERRIDE THIS METHOD')
    }
    isActivated() {
        console.log(this.name, process.env[this.name])
        return process.env[this.name] == 'true'
    }
 }