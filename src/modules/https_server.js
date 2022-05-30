const https = require('https');
const fs = require('fs');
const path = require('path');
const constants = require('crypto');
const config = require('../config/system_config');
const zabbixBot = require('./jabber_bot');
const logger = require('../config/logger_config');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  // 'Access-Control-Max-Age': 2592000, // 30 days
};
const options = {
  key: fs.readFileSync(path.resolve(__dirname, './../../cert/center_inform.key')),
  cert: fs.readFileSync(path.resolve(__dirname, './../../cert/center_inform.crt')),
  requestCert: false,
  // secureProtocol: 'SSLv23_method',
  secureOptions: constants.SSL_OP_NO_SSLv3 || constants.SSL_OP_NO_SSLv2,
};

function initHTTPSServer() {
  function onError(error) {
    if (error.syscall !== 'listen') {
      // throw error;
      logger.error("Well, this didn't work...");
    }
  }

  const server = https
    .createServer(options, (req, res) => {
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
          zabbixBot.say({
            user: 'a.yudin@center-inform.ru',
            text: body,
          });
          res.end();
        }
      });
    })
    .listen(config.server.port, config.server.host, () => {
      logger.info(`Server running at https://${config.server.host}:${config.server.port}/ ${process.pid}`);
    })
    .on('error', onError);
  return server;
}
module.exports = initHTTPSServer;
