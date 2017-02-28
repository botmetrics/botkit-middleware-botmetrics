require('dotenv').config();

if (!process.env.PAGE_ACCESS_TOKEN) {
  console.log('Error: Specify PAGE_ACCESS_TOKEN in environment');
  process.exit(1);
}

if (!process.env.VERIFY_TOKEN) {
  console.log('Error: Specify VERIFY_TOKEN in environment');
  process.exit(1);
}


var Botkit = require('botkit');
var controller = Botkit.facebookbot({
  debug: true,
  access_token: process.env.PAGE_ACCESS_TOKEN,
  verify_token: process.env.VERIFY_TOKEN
});

var bot = controller.spawn({});

controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
  controller.createWebhookEndpoints(webserver, bot, function() {
    console.log('ONLINE!');
  });
});

require('./index')({
  botmetricsBotId: process.env.BOTMETRICS_BOT_ID,
  botmetricsApiKey: process.env.BOTMETRICS_API_KEY,
  controller: controller
});

controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {
  bot.reply(message, 'Hi from botkit');
});
