var HttpClient = require('scoped-http-client');

module.exports = function(credentials) {
  if (!credentials || !credentials.botId || !credentials.apiKey) {
    throw new Error('No bot id or api key specified');
  }

  var host = process.env.BOTMETRICS_API_HOST || 'https://www.getbotmetrics.com'
  var url = host + "/bots/" + credentials.botId + "/events";
  var http = HttpClient.create(url);

  var Facebook = {}

  Facebook.receive = function (bot, message, next) {
    var event = JSON.stringify(facebookEvent(message));

    http.header('Authorization', credentials.apiKey).
         header('Content-Type', 'application/json').
         post(JSON.stringify({event: event, format: 'json'}))(function(err, resp, body) {
      if(err) {
        next(err);
      } else if (resp.statusCode != 202) {
        next(new Error("Unexpected Status Code from Botmetrics API"));
      } else {
        next()
      }
    });
  }

  function facebookEvent(message) {
    if(!message) {
      return null
    } else {
      return {
        object: 'page',
        entry: [{
          messaging: [{
            sender: {
              id: message.user
            },
            timestamp: message.timestamp,
            message: {
              text: message.text,
              mid: message.mid,
              seq: message.seq,
              attachments: message.attachments
            }
          }]
        }]
      }
    }
  }

  return Facebook
}
