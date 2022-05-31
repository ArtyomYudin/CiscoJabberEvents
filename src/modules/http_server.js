const http = require('http');
const zabbixBot = require('./jabber_bot');
const logger = require('../config/logger_config');

require('dotenv').config();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  // 'Access-Control-Max-Age': 2592000, // 30 days
};

function initHTTPServer() {
  function onError(error) {
    if (error.syscall !== 'listen') {
      // throw error;
      logger.error("Well, this didn't work...");
    }
  }

  const server = http
    .createServer((req, res) => {
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        res.end();
      }

      let body = [];

      req.on('error', err => {
        logger.error('REQ error:', err);
      });
      req.on('data', chunk => body.push(chunk));
      req.on('end', () => {
        body = Buffer.concat(body).toString();
        res.on('error', err => {
          logger.error('RES error:', err);
        });
        if (req.url === '/api/jabber' && req.method === 'POST') {
          logger.info('Resive post', body);
          const bodyJSON = JSON.parse(body).fields;
          let alarmMessage = `${bodyJSON.subject}\n`;
          alarmMessage += `${bodyJSON.message}\n`;
          alarmMessage += `${bodyJSON.value}\n`;
          zabbixBot.say({
            user: bodyJSON.to,
            text: alarmMessage,
          });
          res.end();
        }
      });
    })
    .listen(parseInt(process.env.HTTP_PORT, 10), process.env.HTTP_HOST, () => {
      logger.info(`Server running at http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/ ${process.pid}`);
    })
    .on('error', onError);
  return server;
}
module.exports = initHTTPServer;
