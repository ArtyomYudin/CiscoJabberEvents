const JabberBot = require('../lib/JabberBot');
// import { logger } from './logger_config';

const controller = JabberBot({
  json_file_store: './bot_store/',
});

const zabbixBot = controller.spawn({
  client: {
    jid: 'itobot@center-inform.ru',
    password: 'ihfq,brec',
    host: 'angela.center-inform.ru',
    port: 5222,
  },
});

/*
bot.say({
  user: 'a.yudin@center-inform.ru',
  text: 'hi!',
});
*/
controller.hears(['hello'], ['direct_mention', 'direct_message'], function (bot, message) {
  bot.reply(message, 'Hi');
});

controller.on('direct_mention', function (bot, message) {
  bot.reply(message, 'You mentioned me in a group and said, "' + message.text + '"');
});

controller.on('direct_message', function (bot, message) {
  bot.reply(message, 'I got your direct message. You said, "' + message.text + '"');
});

module.exports = zabbixBot;
