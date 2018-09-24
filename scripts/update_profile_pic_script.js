let mongoose = require('mongoose')
const logger = require('../server/components/logger')
const config = require('../server/config/environment')
const Users = require('../server/api/user/Users.model')
const Subscribers = require('../server/api/subscribers/Subscribers.model')
const CompanyUsers = require('../server/api/companyuser/companyuser.model')
const Pages = require('../server/api/pages/Pages.model')
const needle = require('needle')
const TAG = 'scripts/update_profile_pic_script.js'

mongoose = mongoose.connect(config.mongo.uri)

console.log(mongoose)

function updateSubcribersPic (pageTokens, companyId) {
  Subscribers.find({companyId: companyId}).populate('pageId').exec((err, users) => {
    if (err) {
      logger.serverLog(TAG, `Error in retrieving users: ${JSON.stringify(err)}`)
    }
    for (let i = 0; i < users.length; i++) {
      let accessToken = pageTokens.filter((item) => item.id === users[i].pageId.pageId)[0].token
      needle.get(
        `https://graph.facebook.com/v2.10/${users[i].senderId}?access_token=${accessToken}`,
        (err, resp) => {
          if (err) {
            logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
          console.log('resp.body', resp.body)
          logger.serverLog(TAG, `resp ${JSON.stringify(resp.body)}`)
          Subscribers.update({_id: users[i]._id}, {firstName: resp.body.first_name, lastName: resp.body.last_name, profilePic: resp.body.profile_pic, locale: resp.body.locale, timezone: resp.body.timezone, gender: resp.body.gender}, (err, updated) => {
            if (err) {
              logger.serverLog(TAG, `Error in updating subscriber: ${JSON.stringify(err)}`)
            }
            if (!(i + 1 < users.length)) {
              setTimeout(function (mongoose) { closeDB(mongoose) }, 55000)
            }
          })
        })
    }
    setTimeout(function (mongoose) { closeDB(mongoose) }, 55000)
  })
}

function getPageAccessTokenAndUpdate (companyId) {
  let pageTokens = []
  Pages.find({companyId: companyId}).populate('userId').exec((err, pages) => {
    if (err) {
      logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
    }
    for (let i = 0; i < pages.length; i++) {
      needle.get(
      `https://graph.facebook.com/v2.10/${pages[i].pageId}?fields=access_token&access_token=${pages[i].userId.facebookInfo.fbToken}`,
      (err, resp) => {
        if (err) {
          logger.serverLog(TAG,
          `Page accesstoken from graph api Error${JSON.stringify(err)}`)
        }
        pageTokens.push({id: pages[i].pageId, token: resp.body.access_token})
        if (pageTokens.length === pages.length) {
          updateSubcribersPic(pageTokens, companyId)
        }
      })
    }
    setTimeout(function (mongoose) { closeDB(mongoose) }, 55000)
  })
}

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

CompanyUsers.find({}).populate('userId').exec((err, profiles) => {
  if (err) {
    logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
  }
  profiles.forEach(profile => {
    getPageAccessTokenAndUpdate(profile.companyId)
  })
})

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
