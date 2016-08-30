require('dotenv').config();

if (!process.env.page_token) {
  console.log('Error: Specify page_token in environment');
  process.exit(1);
}

if (!process.env.verify_token) {
  console.log('Error: Specify verify_token in environment');
  process.exit(1);
}

var facebook = require('./index').Facebook({
  botId: process.env.botId,
  apiKey: process.env.apiKey
});

var Botkit = require('botkit');
var controller = Botkit.facebookbot({
  debug: true,
  access_token: process.env.page_token,
  verify_token: process.env.verify_token
});
var bot = controller.spawn({});

controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
  controller.createWebhookEndpoints(webserver, bot, function() {
    console.log('ONLINE!');
  });
});

controller.middleware.receive.use(facebook.receive)

controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {
  bot.reply(message, 'Hi there');
});
