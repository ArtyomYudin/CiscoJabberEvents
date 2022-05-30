/**
 * Конфигурационный файл
 */

const config = {
  server: {
    // host: '172.20.4.195',
    host: '127.0.0.1',
    port: 3443,
  },

  zabbix: {
    host: 'http://zabbix.center-inform.ru/api_jsonrpc.php',
    user: 'ZabbixAPIUser',
    password: 'G4SCb68LIbL8',
  },
};

module.exports = config;
