const TelegramBot = require('node-telegram-bot-api')
const token = '5145114254:AAHLnMUXRYF21ZOmQwBMMrnatueGGAD4CMY'
const bot = new TelegramBot(token, { polling: false })

module.exports = bot
