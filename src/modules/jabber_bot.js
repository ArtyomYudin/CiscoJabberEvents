const JabberBot = require('../lib/JabberBot');
// import { logger } from './logger_config';
const config = require('dotenv');
const logger = require('../config/logger_config');

require('dotenv').config();

const controller = JabberBot({
  json_file_store: './bot_store/',
});

const bot = controller.spawn({
  client: {
    jid: process.env.JABBER_USER,
    password: process.env.JABBER_PASSWORD,
    host: process.env.JABBER_URL,
    port: process.env.JABBER_PORT,
  },
});

function zabbixAlarm(trigger) {
  let alarmValue = '';
  let alarmMessage = 'Информация от Zabbix.\n';
  alarmMessage += `Хост: ${trigger.subject}\n`;
  alarmMessage += `Статус: ${trigger.status}\n`;
  alarmMessage += `Сообщение: ${trigger.message}\n`;
  /* if (trigger.value1) {
    alarmValue = `${trigger.value1}`;
  }
  if (trigger.value2) {
    alarmValue = `${trigger.value1} ${trigger.value2} `;
  }
  if (trigger.value3) {
    alarmValue = `${trigger.value1} ${trigger.value2} ${trigger.value3}`;
  }*/
  alarmMessage += `Текущее значение: ${trigger.lastvalue}`;
  bot.say({
    user: trigger.to,
    text: alarmMessage,
  });
}

controller.hears(['hello'], ['direct_mention', 'direct_message'], function (bot, message) {
  bot.reply(message, 'Hi');
});

controller.on('direct_mention', function (bot, message) {
  bot.reply(message, 'You mentioned me in a group and said, "' + message.text + '"');
});

controller.on('direct_message', function (bot, message) {
  bot.reply(message, 'I got your direct message. You said, "' + message.text + '"');
});

//exports.jabberBot = bot;
exports.zabbixAlarm = zabbixAlarm;
