const Telegram = require('telegraf/telegram');
const config = require('../config');

const bot = new Telegram(config.botToken);

module.exports = function sendTelegramMessage(message) {
    return config.bot ? bot.sendMessage(config.botChatId, message, {parse_mode: 'HTML'}) : false;
};