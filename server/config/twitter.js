/**
 * Created by sojharo on 23/10/2017.
 */

const config = require('./environment/index')
let Twit = require('twit')

const logger = require('./../components/logger')
const TAG = 'config/twitter.js'

// sojharo twitter id : 2616186000

let twitterClient = new Twit({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.consumer_token,
  access_token_secret: config.twitter.consumer_token_secret
})

let stream

function connect () {
  stream = twitterClient.stream('statuses/filter',
    {follow: [2616186000, 1430793200]})

  stream.on('tweet', function (tweet) {
    logger.serverLog(TAG, tweet.text)
  })
}

function findUser (screenName, fn) {
  twitterClient.get('users/show', {screen_name: screenName},
    (err, data, response) => {
      if (err) {
        fn(err)
      }
      if (data.errors) {
        if (data.errors[0].code === 50) {
          fn('User not found on Twitter')
        }
      }
      fn(null, data)
    })
}

exports.connect = connect
exports.findUser = findUser
