var pusher = require('apps/fomo-native/src/modules/extensions/notifiers/pushbullet')

module.exports = function pushbullet (config) {
  var pushbullet = {
    pushMessage: function(title, message) {
      var pb = new pusher(config.key)
      pb.note(config.deviceID, title, message, (err) => {
        if (err) {
          console.log('error: Push message failed, ' + err)
          return
        }
      })
    }
  }
  return pushbullet
}
