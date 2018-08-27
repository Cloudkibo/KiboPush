let mongoose = require('mongoose')
const logger = require('../server/components/logger')
const config = require('../server/config/environment')
const Users = require('../server/api/user/Users.model')
const Subscribers = require('../server/api/subscribers/Subscribers.model')
const CompanyUsers = require('../server/api/companyuser/companyuser.model')
const needle = require('needle')
const TAG = 'scripts/update_profile_pic_script.js'

mongoose = mongoose.connect(config.mongo.uri)

console.log(mongoose)

Users.find({}, (err, users) => {
  if (err) {
    logger.serverLog(TAG, `ERROR in cron script update_profile_pic${JSON.stringify(err)}`)
  }
  users.forEach((user, index) => {
    if (user.facebookInfo) {
      needle.get(
        `https://graph.facebook.com/v2.10/${user.facebookInfo.fbId}?fields=picture&access_token=${user.facebookInfo.fbToken}`,
        (err, resp) => {
          if (err) {
            logger.serverLog(TAG, `ERROR in cron script update_profile_pic ${JSON.stringify(err)}`)
          }
          if (resp.body.picture) {
            Users.update({_id: user._id}, {'facebookInfo.profilePic': resp.body.picture.data.url}, (err, updated) => {
              if (err) {
                logger.serverLog(TAG, `ERROR in cron script update_profile_pic (updating user (EULA)) ${JSON.stringify(err)}`)
              }
              console.log('successfully updated')
            })
          }
        })
    }
    if (!(index + 1 < users.length)) {
      setTimeout(function (mongoose) { closeDB(mongoose) }, 55000)
    }
  })
  setTimeout(function (mongoose) { closeDB(mongoose) }, 55000)
})

// IIFE prev-line terminator semi-colan. Don't remove it.
;(function () {
  let pages = []
  let tokens = []
  CompanyUsers.find({}).populate('userId').exec((err, profiles) => {
    if (err) {
      return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    profiles.forEach((profile, index) => {
      Subscribers.find({companyId: profile.companyId}).populate('pageId').exec((err, users) => {
        if (err) {
          return logger.serverLog(TAG, `Error in retrieving users: ${JSON.stringify(err)}`)
        }
        for (let i = 0; i < users.length; i++) {
          if (users[i].pageId && users[i].pageId.pageId && profile.userId && profile.userId.facebookInfo) {
            if (pages.indexOf(users[i].pageId.pageId) === -1) {
              pages.push(users[i].pageId.pageId)
              needle.get(
              `https://graph.facebook.com/v2.10/${users[i].pageId.pageId}?fields=access_token&access_token=${profile.userId.facebookInfo.fbToken}`,
              (err, respp) => {
                if (err) {
                  return logger.serverLog(TAG,
                  `Page accesstoken from graph api Error${JSON.stringify(err)}`)
                }
                logger.serverLog(TAG, `resp in page token ${JSON.stringify(respp.body)}`)
                tokens.push({id: users[i].pageId.pageId, key: respp.body.access_token})
                needle.get(
                  `https://graph.facebook.com/v2.10/${users[i].senderId}?access_token=${respp.body.access_token}`,
                  (err, resp) => {
                    if (err) {
                      return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                    }
                    logger.serverLog(TAG, `resp ${JSON.stringify(resp.body)}`)
                    Subscribers.update({_id: users[i]._id}, {firstName: resp.body.first_name, lastName: resp.body.last_name, profilePic: resp.body.profile_pic, locale: resp.body.locale, timezone: resp.body.timezone, gender: resp.body.gender}, (err, updated) => {
                      if (err) {
                        return logger.serverLog(TAG, `Error in updating subscriber: ${JSON.stringify(err)}`)
                      }
                      console.log('successfully updated')
                    })
                  })
              })
            } else {
              let arr = tokens.find(() => {
                return tokens.id === users[i].pageId.pageId
              }).key
              logger.serverLog(TAG, `arr in else ${JSON.stringify(arr)}`)
              needle.get(
                `https://graph.facebook.com/v2.10/${users[i].senderId}?access_token=${arr}`,
                (err, resp) => {
                  if (err) {
                    return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                  }
                  logger.serverLog(TAG, `resp ${JSON.stringify(resp.body)}`)
                  Subscribers.update({_id: users[i]._id}, {firstName: resp.body.first_name, lastName: resp.body.last_name, profilePic: resp.body.profile_pic, locale: resp.body.locale, timezone: resp.body.timezone, gender: resp.body.gender}, (err, updated) => {
                    if (err) {
                      return logger.serverLog(TAG, `Error in updating subscriber: ${JSON.stringify(err)}`)
                    }
                    console.log('successfully updated')
                  })
                })
            }
          }
        }
      })
      if (!(index + 1 < profiles.length)) {
        setTimeout(function (mongoose) { closeDB(mongoose) }, 55000)
      }
    })
    setTimeout(function (mongoose) { closeDB(mongoose) }, 55000)
  })
  setTimeout(function (mongoose) { closeDB(mongoose) }, 55000)
})()

function closeDB () {
  console.log('DB is about to be closed')
  mongoose.disconnect(function (err) {
    if (err) throw err
    console.log('DB disconnected')
    process.exit()
  })
}

process.on('uncaughtException', (err) => {
  logger.serverLog(TAG, `Found the exception: ${JSON.stringify(err)}`)
  closeDB()
})
