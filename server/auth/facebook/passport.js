/**
 * Created by sojharo on 24/07/2017.
 */

const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const needle = require('needle')
const _ = require('lodash')
const Pages = require('../../api/pages/Pages.model')
const Users = require('../../api/user/Users.model')

const logger = require('../../components/logger')
const TAG = 'api/auth/facebook/passport'

const options = {
  headers: {
    'X-Custom-Header': 'CloudKibo Web Application'
  },
  json: true
}

exports.setup = function (User, config) {
  passport.use(new FacebookStrategy(
    {
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
      if (profile._json) {
        logger.serverLog(TAG, `facebook auth done for: ${
          profile._json.name} with fb id: ${profile._json.id}`)
      }

      needle.get(`${'https://graph.facebook.com/me?fields=' +
      'id,name,locale,email,timezone,gender,picture' +
      '&access_token='}${accessToken}`, options, (err, resp) => {
        if (err !== null) {
          logger.serverLog(TAG, 'error from graph api to get user data: ')
          logger.serverLog(TAG, JSON.stringify(err))
        }
        logger.serverLog(TAG, 'resp from graph api to get user data: ')
        logger.serverLog(TAG, JSON.stringify(resp.body))

        if (err) return done(err)

        let payload = new Users({
          name: resp.body.name,
          locale: resp.body.locale,
          gender: resp.body.gender,
          provider: 'facebook',
          timezone: resp.body.timezone,
          profilePic: resp.body.picture.data.url,
          fbToken: accessToken,
          fbId: resp.body.id
        })

        if (resp.body.email) {
          payload = _.merge(payload, {email: resp.body.email})
        }

        Users.findOne({fbId: resp.body.id}, (err, user) => {
          if (err) {
            return done(err)
          }
          if (!err && user !== null) {
            logger.serverLog(TAG,
              `previous fb token before login: ${user.fbToken}`)
            user.updatedAt = Date.now()
            user.fbToken = accessToken
            logger.serverLog(TAG, `new fb token after login: ${accessToken}`)
            user.save((err, userpaylaod) => {
              if (err) {
                logger.serverLog(TAG, JSON.stringify(err))
                return done(err)
              }
              logger.serverLog(TAG,
                `user is updated : ${JSON.stringify(userpaylaod)}`)
              done(null, user)
              fetchPages(`https://graph.facebook.com/v2.10/${
                user.fbId}/accounts?access_token=${
                user.fbToken}`, user)
            })
          } else {
            payload.save((error, newUser) => {
              if (error) {
                return done(error)
              }
              done(null, newUser)
              fetchPages(`https://graph.facebook.com/v2.10/${
                payload.fbId}/accounts?access_token=${
                payload.fbToken}`, newUser)
            })
          }
        })
      })
    }
  ))
}

function fetchPages (url, user) {
  const options = {
    headers: {
      'X-Custom-Header': 'CloudKibo Web Application'
    },
    json: true

  }
  needle.get(url, options, (err, resp) => {
    if (err !== null) {
      logger.serverLog(TAG, 'error from graph api to get pages list data: ')
      logger.serverLog(TAG, JSON.stringify(err))
      return
    }
    logger.serverLog(TAG, 'resp from graph api to get pages list data: ')
    logger.serverLog(TAG, JSON.stringify(resp.body))

    const data = resp.body.data
    const cursor = resp.body.paging

    data.forEach((item) => {
      const options2 = {
        url: `https://graph.facebook.com/v2.10/${item.id}/?fields=fan_count&access_token=${item.access_token}`,
        qs: {access_token: item.access_token},
        method: 'GET'
      }
      needle.get(options2.url, options2, (error, fanCount) => {
        if (error !== null) {
          return logger.serverLog(TAG, `Error occurred ${error}`)
        } else {
          logger.serverLog(TAG, `Data by fb for page likes ${JSON.stringify(
            fanCount.body.fan_count)}`)
          Pages.findOne({pageId: item.id, userId: user._id}, (err, page) => {
            if (err) {
              logger.serverLog(TAG,
                `Internal Server Error ${JSON.stringify(err)}`)
            }
            if (!page) {
              logger.serverLog(TAG,
                `Page ${item.name} not found. Creating a page`)
              var pageItem = new Pages({
                pageId: item.id,
                pageName: item.name,
                accessToken: item.access_token,
                userId: user._id,
                likes: fanCount.body.fan_count,
                pagePic: `https://graph.facebook.com/v2.10/${item.id}/picture`,
                connected: false
              })
              // save model to MongoDB
              pageItem.save((err, page) => {
                if (err) {
                  logger.serverLog(TAG, `Error occurred ${err}`)
                }
                logger.serverLog(TAG,
                  `Page ${item.name} created with id ${page.pageId}`)
              })
            } else {
              page.likes = fanCount.body.fan_count
              page.pagePic = `https://graph.facebook.com/v2.10/${item.id}/picture`
              page.save((err) => {
                if (err) {
                  logger.serverLog(TAG,
                    `Internal Server Error ${JSON.stringify(err)}`)
                }
                logger.serverLog(TAG, `Likes updated for ${page.pageName}`)
              })
            }
          })
        }
      })
    })
    if (cursor.next) {
      fetchPages(cursor.next, user)
    }
  })
}
