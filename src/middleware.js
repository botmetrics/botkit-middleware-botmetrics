var HttpClient = require('scoped-http-client');

module.exports = function(config) {
  if (!config) {
    config = {};
  }

  function botmetricsUsage() {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('> Botmetrics Middleware is enabled, but not yet configured.');
    console.log('> To enable Botmetrics support:');
    console.log('> Sign Up For Free at Botmetrics here: https://www.getbotmetrics.com/');
    console.log('> Configure the middleware as described here: https://github.com/botmetrics/botkit-middleware-botmetrics');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  }

  if (!config.botmetricsApiKey) {
    return botmetricsUsage();
  }

  if (!config.botmetricsBotId) {
    return botmetricsUsage();
  }

  if (!config.controller) {
    return botmetricsUsage();
  }

  config.controller.on('create_team', function(bot, team) {
    if(bot.type == 'slack') {
      if (!team.bot) {
        return;
      }
      postToRegisterAPI(team.bot.token);
    }
  });

  config.controller.on('message_received', function(bot, message) {
    if (bot.type == 'fb') {
      var event = JSON.stringify(botkitToFacebookMessage(message));
      postToEventsAPI(event);
    }
  });

  config.controller.on('facebook_postback', function(bot, message) {
    if (bot.type == 'fb') {
      var event = JSON.stringify(botkitToFacebookPostback(message));
      postToEventsAPI(event);
    }
  });

  config.controller.on('facebook_optin', function(bot, message) {
    if (bot.type == 'fb') {
      var event = JSON.stringify(botkitToFacebookOptin(message));
      postToEventsAPI(event);
    }
  });

  config.controller.on('facebook_referral', function(bot, message) {
    if (bot.type == 'fb') {
      var event = JSON.stringify(botkitToFacebookReferral(message));
      postToEventsAPI(event);
    }
  });

  function postToEventsAPI(event) {
    var host = process.env.BOTMETRICS_API_HOST || 'https://www.getbotmetrics.com'
    var url = host + "/bots/" + config.botmetricsBotId + "/events";
    var http = HttpClient.create(url);

    http.header('Authorization', config.botmetricsApiKey).
       header('Content-Type', 'application/json').
       post(JSON.stringify({event: event, format: 'json'}))(function(err, resp, body) {
      if(err) {
        console.log("error posting to botmetrics API: ", error);
      } else if (resp.statusCode != 202) {
        console.log("error posting to botmetrics API: ", new Error("Unexpected Status Code from Botmetrics API"));
      }
    });
  }

  function postToRegisterAPI(token) {
    var host = process.env.BOTMETRICS_API_HOST || 'https://www.getbotmetrics.com'
    var url = host + "/bots/" + config.botmetricsBotId + "/instances";
    var http = HttpClient.create(url);
    var params = {
      instance: {
        token: token
      },
      format: 'json'
    };

    http.header('Authorization', config.botmetricsApiKey).
       header('Content-Type', 'application/json').
       post(JSON.stringify(params))(function(err, resp, body) {
      if(err) {
        console.log("error posting to botmetrics API: ", error);
      } else if (resp.statusCode != 202) {
        console.log("error posting to botmetrics API: ", new Error("Unexpected Status Code from Botmetrics API"));
      }
    });
  }

  function botkitToFacebookOptin(message) {
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
            recipient: {
              id: message.page
            },
            timestamp: message.timestamp,
            optin: message.optin
          }]
        }]
      }
    }
  }

  function botkitToFacebookReferral(message) {
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
            recipient: {
              id: message.page
            },
            timestamp: message.timestamp,
            referral: message.referral
          }]
        }]
      }
    }
  }

  function botkitToFacebookPostback(message) {
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
            recipient: {
              id: message.page
            },
            timestamp: message.timestamp,
            postback: {
              payload: message.text,
              referral: message.referral
            }
          }]
        }]
      }
    }
  }

  function botkitToFacebookMessage(message) {
    if(!message) {
      return null
    } else {
      return {
        object: 'page',
        entry: [{
          messaging: [{
            sender: {
              id: message.is_echo ? message.page : message.user
            },
            recipient: {
              id: message.is_echo ? message.user: message.page
            },
            timestamp: message.timestamp,
            message: {
              is_echo: message.is_echo,
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
};
