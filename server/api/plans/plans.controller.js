const Plans = require('./plans.model')

exports.populatePlan = function (req, res) {
  let planData = {
    name: 'Individual Basic Plan',
    unique_ID: 'plan_B'
  }
  let planB = new Plans(planData)
  planB.save((err) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Failed to insert record1'})
    }
    planData = {
      name: 'Individual Premium Plan',
      unique_ID: 'plan_A',
      interval: 'monthly',
      default_individual: true
    }
    let planA = new Plans(planData)
    planA.save((err) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Failed to insert record2'})
      }
      planData = {
        name: 'Team Premium Plan',
        unique_ID: 'plan_C',
        interval: 'monthly',
        default_premium: true
      }
      let planC = new Plans(planData)
      planC.save((err) => {
        if (err) {
          return res.status(500)
            .json({status: 'failed', description: 'Failed to insert record3'})
        }
        planData = {
          name: 'Team Basic Plan',
          unique_ID: 'plan_D'
        }
        let planD = new Plans(planData)
        planD.save((err) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Failed to insert record4'})
          }
          return res.status(200).json({
            status: 'success',
            description: 'Successfuly populated!'
          })
        })
      })
    })
  })
}
