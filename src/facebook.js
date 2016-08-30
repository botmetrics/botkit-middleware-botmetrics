module.exports = function(credentials) {
  if (!credentials || !credentials.botId || !credentials.apiKey) {
    throw new Error('No bot id or api key specified');
  }

  var facebook = {}

  facebook.receive = function () {
    console.log('botId: ' + credentials.botId + ';\napiKey: ' + credentials.apiKey + ';');
  }

  return facebook
}
