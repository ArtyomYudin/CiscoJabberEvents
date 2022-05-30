const initHTTPServer = require('./modules/http_server');
//import { eventBot } from './modules/jabber-bot';

(async () => {
  const httpServer = await initHTTPServer();
  console.log(httpServer.address());
  // eventBot.say({
  //   user: 'a.yudin@center-inform.ru',
  //   text: 'hi!',
  // });
})();
