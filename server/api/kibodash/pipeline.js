exports.filterConnectedPages = { $match: { connected: true } }
exports.countResults = { $group: { _id: null, count: { $sum: 1 } } }
exports.joinPageWithSubscribers = {
  $lookup:
  {
    from: 'subscribers',
    localField: '_id',
    foreignField: 'pageId',
    as: 'pageSubscribers'
  }
}
exports.selectPageFields = {
  $project: {
    _id: true,
    pageName: true,
    pageId: true,
    pageUserName: true,
    likes: true,
    numberOfSubscribers: { $size: { '$ifNull': ['$pageSubscribers', []] } },
    numberOfBroadcasts: {
      $literal: 0
    },
    numberOfPolls: {
      $literal: 0
    },
    numberOfSurveys: {
      $literal: 0
    }
  }
}

exports.companyWisePageCount = {
  $group: {
    _id: '$companyId',
    totalPages: { $sum: 1 }
  }
}

exports.joinCompanyWithSubscribers = {
  $lookup:
  {
    from: 'subscribers',
    localField: 'companyId',
    foreignField: 'companyId',
    as: 'companysubscribers'
  }
}
exports.filterCompanySubscribers = {
  $project: {
    companyId: true,
    userId: true,
    companysubscribers: {
      $filter: {
        input: '$companysubscribers',
        as: 'companysubscriber'
      }
    }
  }
}

exports.selectCompanyFields = {
  $project: {
    companyId: true,
    userId: true,
    userName: '',
    numberOfSubscribers: { $size: '$companysubscribers' },
    numberOfBroadcasts: {
      $literal: 0
    },
    numberOfPolls: {
      $literal: 0
    },
    numberOfSurveys: {
      $literal: 0
    },
    numberOfPages: {
      $literal: 0
    },
    numberOfConnectedPages: {
      $literal: 0
    }
  }
}

exports.filterDate = {
  $match: {
  }
}
exports.filterUserDate = {
  $match: {
  }
}
exports.groupCompanyWiseAggregates = {
  $group: {
    _id: '$companyId',
    totalCount: { $sum: 1 }
  }
}

exports.pageWiseAggregate = {
  $group: {
    _id: '$pageId',
    totalCount: { $sum: 1 }
  }
}
