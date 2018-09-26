exports.setBroadcastsCount = function  (results, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < results[1].length; j++) {
        if (results[1][j]._id.toString() === data[i].companyId.toString()) {
          let broadcasts = results[1][j]
          data[i].numberOfBroadcasts = broadcasts.totalCount
        }
      }
    }
  }
  
exports.setPollsCount = function (results, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < results[2].length; j++) {
        if (results[2][j]._id.toString() === data[i].companyId.toString()) {
          let polls = results[2][j]
          data[i].numberOfPolls = polls.totalCount
        }
      }
    }
  }
  
exports.setSurveysCount = function (results, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < results[3].length; j++) {
        if (results[3][j]._id.toString() === data[i].companyId.toString()) {
          let surveys = results[3][j]
          data[i].numberOfSurveys = surveys.totalCount
        }
      }
    }
  }

exports.setTotalPagesCount = function  (results, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < results[4].length; j++) {
        if (results[4][j]._id.toString() === data[i].companyId.toString()) {
          let pages = results[4][j]
          data[i].numberOfPages = pages.totalPages
        }
      }
    }
  }
  
exports.setConnectedPagesCount = function (results, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < results[5].length; j++) {
        if (results[5][j]._id.toString() === data[i].companyId.toString()) {
          let pages = results[5][j]
          data[i].numberOfConnectedPages = pages.totalPages
        }
      }
    }
  }
  