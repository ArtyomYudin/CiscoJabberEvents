const initHTTPSServer = require('./modules/https_server');
//import { eventBot } from './modules/jabber-bot';

(async () => {
  const httpServer = await initHTTPSServer();
  console.log(httpServer.address());
  // eventBot.say({
  //   user: 'a.yudin@center-inform.ru',
  //   text: 'hi!',
  // });
})();
