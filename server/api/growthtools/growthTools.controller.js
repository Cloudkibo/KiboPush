/**
 * Created by sojharo on 27/07/2017.
 */

//  const GrowthTools = require('./growthTools.model')
const PhoneNumber = require('./growthtools.model')
const Subscribers = require('../subscribers/Subscribers.model')
const Pages = require('../pages/Pages.model')
const logger = require('../../components/logger')
const TAG = 'api/growthtools/growthTools.controller.js'
const path = require('path')
const fs = require('fs')
const csv = require('csv-parser')
const crypto = require('crypto')
const CompanyUsers = require('./../companyuser/companyuser.model')
let request = require('request')
const _ = require('lodash')
const Lists = require('../lists/lists.model')

exports.upload = function (req, res) {
  var today = new Date()
  var uid = crypto.randomBytes(5).toString('hex')
  var serverPath = 'f' + uid + '' + today.getFullYear() + '' +
    (today.getMonth() + 1) + '' + today.getDate()
  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
    today.getSeconds()
  let fext = req.files.file.name.split('.')
  serverPath += '.' + fext[fext.length - 1]
  let dir = path.resolve(__dirname, '../../../broadcastFiles/')
  if (req.files.file.size === 0) {
    return res.status(400).json({
      status: 'failed',
      description: 'No file submitted'
    })
  }
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    let newFileName = req.files.file.name.substring(0, req.files.file.name.indexOf('.'))
    Lists.update({initialList: true, userId: req.user._id, companyId: companyUser.companyId, listName: newFileName}, {
      listName: newFileName,
      userId: req.user._id,
      companyId: companyUser.companyId,
      conditions: 'initial_list',
      initialList: true
    }, {upsert: true}, (err2, savedList) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
    })
    fs.rename(
      req.files.file.path,
      dir + '/userfiles' + serverPath,
      err => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: 'internal server error' + JSON.stringify(err)
          })
        }
        let respSent = false
        let phoneColumn = req.body.phoneColumn
        let nameColumn = req.body.nameColumn
        logger.serverLog(TAG, `uploaded file columns ${JSON.stringify(req.body.phoneColumn)} ${JSON.stringify(req.body.nameColumn)} `)
        fs.createReadStream(dir + '/userfiles' + serverPath)
          .pipe(csv())
          .on('data', function (data) {
            if (data[`${phoneColumn}`] && data[`${nameColumn}`]) {
              var result = data[`${phoneColumn}`].replace(/[- )(]+_/g, '')
              // var savePhoneNumber = new PhoneNumber({
              //   name: data.name,
              //   number: result,
              //   userId: req.user._id
              // })
              PhoneNumber.find({number: result, userId: req.user._id, companyId: companyUser.companyId, pageId: req.body._id}, (err2, phone) => {
                if (err2) {
                  return res.status(500).json({
                    status: 'failed',
                    description: 'phone number create failed'
                  })
                }
                if (phone.length === 0) {
                  let phoneNumber = new PhoneNumber({
                    name: data[`${nameColumn}`],
                    number: result,
                    userId: req.user._id,
                    companyId: companyUser.companyId,
                    pageId: req.body._id,
                    fileName: newFileName,
                    hasSubscribed: false
                  })
                  phoneNumber.save((err2) => {
                    if (err2) {
                      logger.serverLog(TAG, {
                        status: 'failed',
                        description: 'PollBroadcast create failed',
                        err2
                      })
                    }
                  })
                } else {
                  let filename = []
                  for (let i = 0; i < phone[0].fileName.length; i++) {
                    filename.push(phone[0].fileName[i])
                  }
                  if (exists(filename, req.files.file.name) === false) {
                    filename.push(newFileName)
                  }
                  PhoneNumber.update({number: result, userId: req.user._id, companyId: companyUser.companyId, pageId: req.body._id}, {
                    name: data[`${nameColumn}`],
                    number: result,
                    userId: req.user._id,
                    companyId: companyUser.companyId,
                    pageId: req.body._id,
                    fileName: filename
                  }, {upsert: true}, (err2, phonenumbersaved) => {
                    if (err2) {
                      return res.status(500).json({
                        status: 'failed',
                        description: 'phone number create failed'
                      })
                    }
                    PhoneNumber.find({companyId: companyUser.companyId, hasSubscribed: true, fileName: newFileName}, (err, number) => {
                      if (err) {
                        return res.status(500).json({
                          status: 'failed',
                          description: 'phone number not found'
                        })
                      }
                      if (number.length > 0) {
                        let findNumber = []
                        let findPage = []
                        for (let a = 0; a < number.length; a++) {
                          findNumber.push(number[a].number)
                          findPage.push(number[a].pageId)
                        }
                        let subscriberFindCriteria = {source: 'customer_matching', companyId: companyUser.companyId, isSubscribed: true}
                        subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                          phoneNumber: {
                            $in: findNumber
                          },
                          pageId: {
                            $in: findPage
                          }
                        })
                        Subscribers.find(subscriberFindCriteria).populate('pageId').exec((err, subscribers) => {
                          if (err) {
                            return res.status(500).json({
                              status: 'failed',
                              description: `Internal Server Error ${JSON.stringify(err)}`
                            })
                          }
                          let temp = []
                          for (let i = 0; i < subscribers.length; i++) {
                            temp.push(subscribers[i]._id)
                          }
                          Lists.update({listName: newFileName, userId: req.user._id, companyId: companyUser.companyId}, {
                            content: temp
                          }, (err2, savedList) => {
                            if (err) {
                              return res.status(500).json({
                                status: 'failed',
                                description: `Internal Server Error ${JSON.stringify(err)}`
                              })
                            }
                          })
                        })
                      }
                    })
                  })
                }
              })
              let pagesFindCriteria = {userId: req.user._id, connected: true, pageId: req.body.pageId}
              Pages.find(pagesFindCriteria, (err, pages) => {
                if (err) {
                  logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
                }
                pages.forEach(page => {
                  let messageData = {
                    'messaging_type': 'UPDATE',
                    'recipient': JSON.stringify({
                      'phone_number': result
                    }),
                    'message': JSON.stringify({
                      'text': req.body.text,
                      'metadata': 'This is a meta data'
                    })
                  }
                  request(
                    {
                      'method': 'POST',
                      'json': true,
                      'formData': messageData,
                      'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                      page.accessToken
                    },
                    function (err, res) {
                      if (err) {
                        return logger.serverLog(TAG,
                          `At invite to messenger using phone ${JSON.stringify(
                            err)}`)
                      } else {
                      }
                    })
                })
              })
              if (respSent === false) {
                respSent = true
                return res.status(201)
                  .json({
                    status: 'success',
                    description: 'Contacts were invited to your messenger'
                  })
              }
            } else {
              return res.status(404)
                .json({status: 'failed', description: 'Incorrect column names'})
            }
          })
          .on('end', function () {
            fs.unlinkSync(dir + '/userfiles' + serverPath)
          })
      })
  })
}
/*
exports.upload = function (req, res) {
  var today = new Date()
  var uid = crypto.randomBytes(5).toString('hex')
  var serverPath = 'f' + uid + '' + today.getFullYear() + '' +
    (today.getMonth() + 1) + '' + today.getDate()
  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' +
    today.getSeconds()
  let fext = req.files.file.name.split('.')
  serverPath += '.' + fext[fext.length - 1]

  let dir = path.resolve(__dirname, '../../../broadcastFiles/')

  if (req.files.file.size === 0) {
    return res.status(400).json({
      status: 'failed',
      description: 'No file submitted'
    })
  }
  fs.rename(
    req.files.file.path,
    dir + '/userfiles' + serverPath,
    err => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }
      let respSent = false
      fs.createReadStream(dir + '/userfiles' + serverPath)
        .pipe(csv())
        .on('data', function (data) {
          logger.serverLog(TAG, `data from csv file ${JSON.stringify(data)}`)
          var keys = []
          for (var k in data) {
            keys.push(k)
          }
          if (respSent === false) {
            respSent = true
            return res.status(201)
              .json({
                status: 'success',
                payload: { fileColumns: keys, file: dir + '/userfiles' + serverPath }
              })
          } else {
            return res.status(404)
              .json({status: 'failed', description: 'Incorrect column names'})
          }
        })
    })
} */
exports.sendMessage = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    let newFileName = req.body.fileName(0, req.body.fileName.indexOf('.'))

    Lists.update({initialList: true, userId: req.user._id, companyId: companyUser.companyId, listName: newFileName}, {
      listName: newFileName,
      userId: req.user._id,
      companyId: companyUser.companyId,
      conditions: 'initial_list',
      initialList: true
    }, {upsert: true}, (err2, savedList) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
    })
    let respSent = false
    fs.createReadStream(req.body.path)
      .pipe(csv())
      .on('data', function (data) {
        var result = data.req.body.phone_numbers.replace(/[- )(]+_/g, '')
        // var savePhoneNumber = new PhoneNumber({
        //   name: data.req.body.names,
        //   number: result,
        //   userId: req.user._id
        // })
        PhoneNumber.find({number: result, userId: req.user._id, companyId: companyUser.companyId, pageId: req.body._id}, (err2, phone) => {
          if (err2) {
            return res.status(500).json({
              status: 'failed',
              description: 'phone number create failed'
            })
          }
          if (phone.length === 0) {
            let phoneNumber = new PhoneNumber({
              name: data.names,
              number: result,
              userId: req.user._id,
              companyId: companyUser.companyId,
              pageId: req.body._id,
              fileName: newFileName,
              hasSubscribed: false
            })
            phoneNumber.save((err2) => {
              if (err2) {
                logger.serverLog(TAG, {
                  status: 'failed',
                  description: 'PollBroadcast create failed',
                  err2
                })
              }
            })
          } else {
            let filename = []
            for (let i = 0; i < phone[0].fileName.length; i++) {
              filename.push(phone[0].fileName[i])
            }
            if (exists(filename, req.body.fileName) === false) {
              filename.push(newFileName)
            }
            PhoneNumber.update({number: result, userId: req.user._id, companyId: companyUser.companyId, pageId: req.body._id}, {
              name: data.names,
              number: result,
              userId: req.user._id,
              companyId: companyUser.companyId,
              pageId: req.body._id,
              fileName: filename
            }, {upsert: true}, (err2, phonenumbersaved) => {
              if (err2) {
                return res.status(500).json({
                  status: 'failed',
                  description: 'phone number create failed'
                })
              }
              PhoneNumber.find({companyId: companyUser.companyId, hasSubscribed: true, fileName: newFileName}, (err, number) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: 'phone number not found'
                  })
                }
                if (number.length > 0) {
                  let findNumber = []
                  let findPage = []
                  for (let a = 0; a < number.length; a++) {
                    findNumber.push(number[a].number)
                    findPage.push(number[a].pageId)
                  }
                  let subscriberFindCriteria = {source: 'customer_matching', companyId: companyUser.companyId, isSubscribed: true}
                  subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                    phoneNumber: {
                      $in: findNumber
                    },
                    pageId: {
                      $in: findPage
                    }
                  })
                  Subscribers.find(subscriberFindCriteria).populate('pageId').exec((err, subscribers) => {
                    if (err) {
                      return res.status(500).json({
                        status: 'failed',
                        description: `Internal Server Error ${JSON.stringify(err)}`
                      })
                    }
                    let temp = []
                    for (let i = 0; i < subscribers.length; i++) {
                      temp.push(subscribers[i]._id)
                    }
                    Lists.update({listName: newFileName, userId: req.user._id, companyId: companyUser.companyId}, {
                      content: temp
                    }, (err2, savedList) => {
                      if (err) {
                        return res.status(500).json({
                          status: 'failed',
                          description: `Internal Server Error ${JSON.stringify(err)}`
                        })
                      }
                    })
                  })
                }
              })
            })
          }
        })

        let pagesFindCriteria = {userId: req.user._id, connected: true, pageId: req.body.pageId}
        Pages.find(pagesFindCriteria, (err, pages) => {
          if (err) {
            logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
          }
          pages.forEach(page => {
            let messageData = {
              'messaging_type': 'UPDATE',
              'recipient': JSON.stringify({
                'phone_number': result
              }),
              'message': JSON.stringify({
                'text': req.body.text,
                'metadata': 'This is a meta data'
              })
            }
            request(
              {
                'method': 'POST',
                'json': true,
                'formData': messageData,
                'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
                page.accessToken
              },
              function (err, res) {
                if (err) {
                  return logger.serverLog(TAG,
                    `At invite to messenger using phone ${JSON.stringify(
                      err)}`)
                } else {
                }
              })
          })
        })

        if (respSent === false) {
          respSent = true
          return res.status(201)
            .json({
              status: 'success',
              description: 'Contacts were invited to your messenger'
            })
        }
      })
      .on('end', function () {
        fs.unlinkSync(req.body.path)
      })
  })
}
exports.sendNumbers = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'numbers')) parametersMissing = true
  if (!_.has(req.body, 'text')) parametersMissing = true
  if (!_.has(req.body, 'pageId')) parametersMissing = true
  if (parametersMissing) {
    return res.status(400)
    .json({status: 'failed', description: 'Parameters are missing. Put numbers, text fields and pageId in payload.'})
  }
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Lists.update({initialList: true, userId: req.user._id, companyId: companyUser.companyId, listName: 'Other'}, {
      listName: 'Other',
      userId: req.user._id,
      companyId: companyUser.companyId,
      conditions: 'initial_list',
      initialList: true
    }, {upsert: true}, (err2, savedList) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
    })
    for (let i = 0; i < req.body.numbers.length; i++) {
      let result = req.body.numbers[i].replace(/[- )(]+_/g, '')
      let pagesFindCriteria = {userId: req.user._id, connected: true, pageId: req.body.pageId}
      Pages.find(pagesFindCriteria, (err, pages) => {
        if (err) {
          logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
        }
        PhoneNumber.find({number: result, userId: req.user._id, companyId: companyUser.companyId, pageId: req.body._id}, (err, found) => {
          if (err) {
          }
          if (found.length === 0) {
            let phoneNumber = new PhoneNumber({
              name: '',
              number: result,
              userId: req.user._id,
              companyId: companyUser.companyId,
              pageId: req.body._id,
              fileName: 'Other',
              hasSubscribed: false
            })
            phoneNumber.save((err2) => {
              if (err2) {
                logger.serverLog(TAG, {
                  status: 'failed',
                  description: 'PollBroadcast create failed',
                  err2
                })
              }
            })
          } else {
            let filename = []
            for (let i = 0; i < found[0].fileName.length; i++) {
              filename.push(found[0].fileName[i])
            }
            if (exists(filename, 'Other') === false) {
              filename.push('Other')
            }
            PhoneNumber.update({number: result, userId: req.user._id, companyId: companyUser.companyId, pageId: req.body._id}, {
              name: '',
              number: result,
              userId: req.user._id,
              companyId: companyUser.companyId,
              pageId: req.body._id,
              fileName: filename
            }, {upsert: true}, (err2, phonenumbersaved) => {
              if (err2) {
                logger.serverLog(TAG, err2)
                return res.status(500).json({
                  status: 'failed',
                  description: 'phone number create failed'
                })
              }
              PhoneNumber.find({companyId: companyUser.companyId, hasSubscribed: true, fileName: 'Other'}, (err, number) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: 'phone number not found'
                  })
                }
                if (number.length > 0) {
                  let findNumber = []
                  let findPage = []
                  for (let a = 0; a < number.length; a++) {
                    findNumber.push(number[a].number)
                    findPage.push(number[a].pageId)
                  }
                  let subscriberFindCriteria = {source: 'customer_matching', companyId: companyUser.companyId, isSubscribed: true}
                  subscriberFindCriteria = _.merge(subscriberFindCriteria, {
                    phoneNumber: {
                      $in: findNumber
                    },
                    pageId: {
                      $in: findPage
                    }
                  })
                  Subscribers.find(subscriberFindCriteria).populate('pageId').exec((err, subscribers) => {
                    if (err) {
                      return res.status(500).json({
                        status: 'failed',
                        description: `Internal Server Error ${JSON.stringify(err)}`
                      })
                    }
                    let temp = []
                    for (let i = 0; i < subscribers.length; i++) {
                      temp.push(subscribers[i]._id)
                    }
                    Lists.update({listName: 'Other', userId: req.user._id, companyId: companyUser.companyId}, {
                      content: temp
                    }, (err2, savedList) => {
                      if (err) {
                        return res.status(500).json({
                          status: 'failed',
                          description: `Internal Server Error ${JSON.stringify(err)}`
                        })
                      }
                    })
                  })
                }
              })
            })
          }
        })
        pages.forEach(page => {
          let messageData = {
            'messaging_type': 'UPDATE',
            'recipient': JSON.stringify({
              'phone_number': result
            }),
            'message': JSON.stringify({
              'text': req.body.text,
              'metadata': 'This is a meta data'
            })
          }
          request(
            {
              'method': 'POST',
              'json': true,
              'formData': messageData,
              'uri': 'https://graph.facebook.com/v2.6/me/messages?access_token=' +
              page.accessToken
            },
            function (err, res) {
              if (err) {
                return logger.serverLog(TAG,
                  `Error At invite to messenger using phone ${JSON.stringify(
                    err)}`)
              } else {
              }
            })
        })
      })
    }
    return res.status(201)
    .json({
      status: 'success',
      description: 'Contacts were invited to your messenger'
    })
  })
}
function exists (filename, phonefile) {
  for (let i = 0; i < filename.length; i++) {
    if (filename[i] === phonefile) {
      return true
    }
  }
  return false
}
exports.retrievePhoneNumbers = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    PhoneNumber.find({companyId: companyUser.companyId}, (err, phonenumbers) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.status(201).json({status: 'success', payload: phonenumbers})
    })
  })
}

exports.pendingSubscription = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    PhoneNumber.find({companyId: companyUser.companyId, hasSubscribed: false, fileName: req.params.name}).populate('pageId').exec((err2, phonenumbers) => {
      if (err2) {
        return res.status(500).json({
          status: 'failed',
          description: 'phone number create failed'
        })
      }
      return res.status(200)
      .json({status: 'success', payload: phonenumbers})
    })
  })
}
