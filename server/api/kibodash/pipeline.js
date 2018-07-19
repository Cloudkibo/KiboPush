exports.filterConnectedPages = { $match: { connected: true } }
exports.countResults = { $group : { _id : null,  count : { $sum : 1 } } }
exports.joinPageWithSubscribers =    {
     $lookup:
       {
         from: "subscribers",
         localField: "_id",
         foreignField: "pageId",
         as: "pageSubscribers"
       }
  }
exports.selectPageFields =  {
     $project: {
        _id: true,
        pageName: true,
        pageId: true,
        pageUserName: true,
        likes: true,
        numberOfSubscribers: { $size: { "$ifNull": [ "$pageSubscribers", [] ] }  },
        numberOfBroadcasts: {
                $literal: 0,
        },
        numberOfPolls: {
                $literal: 0
        },
        numberOfSurveys: {
                $literal: 0
        },
     }
  }

exports.broadcastPageCount = {
         $project: {
            pageCount: { $size: { "$ifNull": [ "$segmentationPageIds", [] ] } }
         }
      }

exports.filterZeroPageCount = {
          $match: {
            pageCount: 0
          }
      }

exports.selectPageIdAndPageCount = {
         $project: {
            segmentationPageIds: true,
            pageCount: { $size: { "$ifNull": [ "$segmentationPageIds", [] ] } }
         }
      }

exports.getPageCountGreaterThanZero = {
      $match: {
        pageCount: {
          $gt: 0
        }
      }
    }
exports.expandPageIdArray = { $unwind : "$segmentationPageIds" }

exports.countByPageId = { $group : { _id : "$segmentationPageIds",  count : { $sum : 1 } } }

