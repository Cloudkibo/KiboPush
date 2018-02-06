const logger = require('../../components/logger')
const Lists = require('./lists.model')
const Subscribers = require('../subscribers/Subscribers.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const TAG = 'api/surveys/surveys.controller.js'
let _ = require('lodash')
exports.allLists = function (req, res) {
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
    Lists.find({companyId: companyUser.companyId}, (err, lists) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
    // after survey is created, create survey questions
      return res.status(201).json({status: 'success', payload: lists})
    })
  })
}
exports.viewList = function (req, res) {
  console.log('hi')
  Lists.find({_id: req.params.id}, (err, list) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    console.log('list', list[0].conditions)
    if (list[0].initialList === true) {
      console.log('insidecoditions')
      Subscribers.find({isSubscribedByPhoneNumber: true}, (err, subscribers) => {
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
        Lists.update({_id: req.params.id}, {
          content: temp
        }, (err2, savedList) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          return res.status(201).json({status: 'success', payload: subscribers})
        })
      })
    } else {
      let pagesFindCriteria = {}
      pagesFindCriteria = _.merge(pagesFindCriteria, {
        _id: {
          $in: list[0].content
        }
      })
      Subscribers.find(pagesFindCriteria, (err, subscriber) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        return res.status(201).json({status: 'success', payload: subscriber})
      })
    }
  })
}
function exists (id, subscriberId) {
  console.log('hi', id)
  console.log('hi', subscriberId)
  Lists.find({_id: id}, (err, list) => {
    console.log('list', list[0])
    if (err) {
    }
    if (list[0].content) {
      for (let i = 0; i < list[0].content.length; i++) {
        console.log('list[0].content')
        if (subscriberId === list[0].content[i]) {
          return true
        }
      }
    }
    return false
  })
  return false
}
exports.createList = function (req, res) {
  let subscribersPayload = []
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
    let listPayload = {
      companyId: companyUser.companyId,
      userId: req.user._id,
      listName: req.body.listName,
      conditions: req.body.conditions,
      parentList: req.body._id
    }
    const list = new Lists(listPayload)
    list.save((err, listCreated) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      Lists.find({_id: req.body._id}, (err, list) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        if (list[0].initialList === true) {
          for (let i = 0; i < req.body.conditions.length; i++) {
            let myCondition = { isSubscribedByPhoneNumber: true }
            // myCondition = _.merge(myCondition, {
            //   myCondition[req.body.conditions[i].condition]: req.body.conditions[i].text.toLowerCase()
            // })
            if (req.body.conditions[i].criteria === 'is') {
              myCondition[req.body.conditions[i].condition] = req.body.conditions[i].text.toLowerCase()
              console.log('inside if')
              Subscribers.find(myCondition, (err, subscriber) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                //  console.log('subscriber', subscriber)
                for (let k = 0; k < subscriber.length; k++) {
                  //  console.log('exists', exists(listCreated._id, subscriber[i]._id))
                  if (subscriber[i] && exists(listCreated._id, subscriber[i]._id) === false) {
                    subscribersPayload.push(subscriber[i]._id)
                  }
                }
                //  subscribersPayload = subscriber
                Lists.update({_id: listCreated._id}, {
                  content: subscribersPayload
                }, (err2, savedList) => {
                  if (err) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(err)}`
                    })
                  }
                })
              })
              //  console.log('subscribersPayload', subscribersPayload)
            } else if (req.body.conditions[i].criteria === 'begins with') {
              var textTemp = '^' + req.body.conditions[i].text
              var cond = new RegExp(textTemp)
              console.log('cond', cond)
              myCondition[req.body.conditions[i].condition] = { $regex: cond }
              console.log('myCondition', myCondition)
              Subscribers.find(myCondition, (err, subscriber) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                // console.log('subscriber', subscriber)
                for (let k = 0; k < subscriber.length; k++) {
                  if (subscriber[i] && exists(listCreated._id, subscriber[i]._id) === false) {
                    console.log('hi')
                    subscribersPayload.push(subscriber[i]._id)
                  }
                }
                //  subscribersPayload = subscriber
                Lists.update({_id: listCreated._id}, {
                  content: subscribersPayload
                }, (err2, savedList) => {
                  if (err) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(err)}`
                    })
                  }
                })
              })
              //  console.log('subscribersPayload', subscribersPayload)
            } else if (req.body.conditions[i].criteria === 'contains') {
              var textTemp1 = '.*' + req.body.conditions[i].text + '.*'
              var cond1 = new RegExp(textTemp1)
              console.log('cond', cond1)
              myCondition[req.body.conditions[i].condition] = { $regex: cond1 }
              console.log('myCondition', myCondition)
              Subscribers.find(myCondition, (err, subscriber) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                console.log('subscriber', subscriber)
                for (let k = 0; k < subscriber.length; k++) {
                  console.log('exists', exists(listCreated._id, subscriber[i]._id))
                  if (subscriber[i] && exists(listCreated._id, subscriber[i]._id) === false) {
                    subscribersPayload.push(subscriber[i]._id)
                  }
                }
                //  subscribersPayload = subscriber
                Lists.update({_id: listCreated._id}, {
                  content: subscribersPayload
                }, (err2, savedList) => {
                  if (err) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(err)}`
                    })
                  }
                })
              })
              //  console.log('subscribersPayload', subscribersPayload)
            }
          }
        } else {
          for (let i = 0; i < req.body.conditions.length; i++) {
            let pagesFindCriteria = {}
            pagesFindCriteria = _.merge(pagesFindCriteria, {
              _id: {
                $in: list[0].content
              }
            })
            if (req.body.conditions[i].criteria === 'is') {
              pagesFindCriteria[req.body.conditions[i].condition] = req.body.conditions[i].text.toLowerCase()
              console.log('pagesFindCriteria', pagesFindCriteria)
              Subscribers.find(pagesFindCriteria, (err, subscriber) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                for (let k = 0; k < subscriber.length; k++) {
                  console.log('exists', exists(listCreated._id, subscriber[i]._id))
                  if (subscriber[i] && exists(listCreated._id, subscriber[i]._id) === false) {
                    subscribersPayload.push(subscriber[i]._id)
                  }
                }
                //  subscribersPayload = subscriber
                Lists.update({_id: listCreated._id}, {
                  content: subscribersPayload
                }, (err2, savedList) => {
                  if (err) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(err)}`
                    })
                  }
                })
              })
              //  console.log('subscribersPayload', subscribersPayload)
            } else if (req.body.conditions[i].criteria === 'begins with') {
              var textTemp2 = '^' + req.body.conditions[i].text
              var cond2 = new RegExp(textTemp2)
              console.log('cond', cond2)
              pagesFindCriteria[req.body.conditions[i].condition] = { $regex: cond2 }
              console.log('pagesFindCriteria', pagesFindCriteria)
              Subscribers.find(pagesFindCriteria, (err, subscriber) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                  // console.log('subscriber', subscriber)
                for (let k = 0; k < subscriber.length; k++) {
                  //  console.log('exists', exists(listCreated._id, subscriber[i]._id))
                  if (subscriber[i] && exists(listCreated._id, subscriber[i]._id) === false) {
                    subscribersPayload.push(subscriber[i]._id)
                  }
                }
                //  subscribersPayload = subscriber
                Lists.update({_id: listCreated._id}, {
                  content: subscribersPayload
                }, (err2, savedList) => {
                  if (err) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(err)}`
                    })
                  }
                })
              })
              //  console.log('subscribersPayload', subscribersPayload)
            } else if (req.body.conditions[i].criteria === 'contains') {
              var textTemp3 = '.*' + req.body.conditions[i].text + '.*'
              var cond3 = new RegExp(textTemp3)
              console.log('cond', cond3)
              pagesFindCriteria[req.body.conditions[i].condition] = { $regex: cond3 }
              console.log('pagesFindCriteria', pagesFindCriteria)
              Subscribers.find(pagesFindCriteria, (err, subscriber) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                // console.log('subscriber', subscriber)
                for (let k = 0; k < subscriber.length; k++) {
                  console.log('exists', exists(listCreated._id, subscriber[i]._id))
                  if (subscriber[i] && exists(listCreated._id, subscriber[i]._id) === false) {
                    subscribersPayload.push(subscriber[i]._id)
                  }
                }
                //  subscribersPayload = subscriber
                Lists.update({_id: listCreated._id}, {
                  content: subscribersPayload
                }, (err2, savedList) => {
                  if (err) {
                    return res.status(500).json({
                      status: 'failed',
                      description: `Internal Server Error ${JSON.stringify(err)}`
                    })
                  }
                })
              })
              //  console.log('subscribersPayload', subscribersPayload)
            }
          }
        }
        Lists.find({_id: listCreated}, (err, list) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          return res.status(201).json({status: 'success', payload: list})
        })
      })
    })
  })
}
exports.deleteList = function (req, res) {
  logger.serverLog(TAG,
    `This is body in delete autoposting ${JSON.stringify(req.params)}`)
  Lists.findById(req.params.id, (err, list) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!list) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    list.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'list update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
exports.editList = function (req, res) {
  let subscribersPayload = []
  Lists.findById(req.body._id, (err, list) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!list) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    list.listName = req.body.listName
    list.conditions = req.body.conditions
    list.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: list})
    })
    Lists.find({_id: list.parentList}, (err, list) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (list[0].initialList === true) {
        for (let i = 0; i < req.body.conditions.length; i++) {
          let myCondition = { isSubscribedByPhoneNumber: true }
          // myCondition = _.merge(myCondition, {
          //   myCondition[req.body.conditions[i].condition]: req.body.conditions[i].text.toLowerCase()
          // })
          if (req.body.conditions[i].criteria === 'is') {
            myCondition[req.body.conditions[i].condition] = req.body.conditions[i].text.toLowerCase()
            console.log('inside if')
            Subscribers.find(myCondition, (err, subscriber) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              //  console.log('subscriber', subscriber)
              for (let k = 0; k < subscriber.length; k++) {
                //  console.log('exists', exists(listCreated._id, subscriber[i]._id))
                if (subscriber[i] && exists(req.body._id, subscriber[i]._id) === false) {
                  subscribersPayload.push(subscriber[i]._id)
                }
              }
              //  subscribersPayload = subscriber
              Lists.update({_id: req.body._id}, {
                content: subscribersPayload
              }, (err2, savedList) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
              })
            })
            //  console.log('subscribersPayload', subscribersPayload)
          } else if (req.body.conditions[i].criteria === 'begins with') {
            var textTemp = '^' + req.body.conditions[i].text
            var cond = new RegExp(textTemp)
            console.log('cond', cond)
            myCondition[req.body.conditions[i].condition] = { $regex: cond }
            console.log('myCondition', myCondition)
            Subscribers.find(myCondition, (err, subscriber) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              // console.log('subscriber', subscriber)
              for (let k = 0; k < subscriber.length; k++) {
                if (subscriber[i] && exists(req.body._id, subscriber[i]._id) === false) {
                  console.log('hi')
                  subscribersPayload.push(subscriber[i]._id)
                }
              }
              //  subscribersPayload = subscriber
              Lists.update({_id: req.body._id}, {
                content: subscribersPayload
              }, (err2, savedList) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
              })
            })
            //  console.log('subscribersPayload', subscribersPayload)
          } else if (req.body.conditions[i].criteria === 'contains') {
            var textTemp1 = '.*' + req.body.conditions[i].text + '.*'
            var cond1 = new RegExp(textTemp1)
            console.log('cond', cond1)
            myCondition[req.body.conditions[i].condition] = { $regex: cond1 }
            console.log('myCondition', myCondition)
            Subscribers.find(myCondition, (err, subscriber) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              console.log('subscriber', subscriber)
              for (let k = 0; k < subscriber.length; k++) {
                console.log('exists', exists(req.body._id, subscriber[i]._id))
                if (subscriber[i] && exists(req.body._id, subscriber[i]._id) === false) {
                  subscribersPayload.push(subscriber[i]._id)
                }
              }
              //  subscribersPayload = subscriber
              Lists.update({_id: req.body._id}, {
                content: subscribersPayload
              }, (err2, savedList) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
              })
            })
            //  console.log('subscribersPayload', subscribersPayload)
          }
        }
      } else {
        for (let i = 0; i < req.body.conditions.length; i++) {
          let pagesFindCriteria = {}
          pagesFindCriteria = _.merge(pagesFindCriteria, {
            _id: {
              $in: list[0].content
            }
          })
          if (req.body.conditions[i].criteria === 'is') {
            pagesFindCriteria[req.body.conditions[i].condition] = req.body.conditions[i].text
            console.log('pagesFindCriteria', pagesFindCriteria)
            Subscribers.find(pagesFindCriteria, (err, subscriber) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              for (let k = 0; k < subscriber.length; k++) {
                console.log('exists', exists(req.body._id, subscriber[i]._id))
                if (subscriber[i] && exists(req.body._id, subscriber[i]._id) === false) {
                  subscribersPayload.push(subscriber[i]._id)
                }
              }
              //  subscribersPayload = subscriber
              Lists.update({_id: req.body._id}, {
                content: subscribersPayload
              }, (err2, savedList) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
              })
            })
            //  console.log('subscribersPayload', subscribersPayload)
          } else if (req.body.conditions[i].criteria === 'begins with') {
            var textTemp2 = '^' + req.body.conditions[i].text
            var cond2 = new RegExp(textTemp2)
            console.log('cond', cond2)
            pagesFindCriteria[req.body.conditions[i].condition] = { $regex: cond2 }
            console.log('pagesFindCriteria', pagesFindCriteria)
            Subscribers.find(pagesFindCriteria, (err, subscriber) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
                // console.log('subscriber', subscriber)
              for (let k = 0; k < subscriber.length; k++) {
                //  console.log('exists', exists(listCreated._id, subscriber[i]._id))
                if (subscriber[i] && exists(req.body._id, subscriber[i]._id) === false) {
                  subscribersPayload.push(subscriber[i]._id)
                }
              }
              //  subscribersPayload = subscriber
              Lists.update({_id: req.body._id}, {
                content: subscribersPayload
              }, (err2, savedList) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
              })
            })
            //  console.log('subscribersPayload', subscribersPayload)
          } else if (req.body.conditions[i].criteria === 'contains') {
            var textTemp3 = '.*' + req.body.conditions[i].text + '.*'
            var cond3 = new RegExp(textTemp3)
            console.log('cond', cond3)
            pagesFindCriteria[req.body.conditions[i].condition] = { $regex: cond3 }
            console.log('pagesFindCriteria', pagesFindCriteria)
            Subscribers.find(pagesFindCriteria, (err, subscriber) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              // console.log('subscriber', subscriber)
              for (let k = 0; k < subscriber.length; k++) {
                console.log('exists', exists(req.body._id, subscriber[i]._id))
                if (subscriber[i] && exists(req.body._id, subscriber[i]._id) === false) {
                  subscribersPayload.push(subscriber[i]._id)
                }
              }
              //  subscribersPayload = subscriber
              Lists.update({_id: req.body._id}, {
                content: subscribersPayload
              }, (err2, savedList) => {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
              })
            })
            //  console.log('subscribersPayload', subscribersPayload)
          }
        }
      }
      Lists.find({_id: req.body._id}, (err, list) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        return res.status(201).json({status: 'success', payload: list})
      })
    })
  })
}
