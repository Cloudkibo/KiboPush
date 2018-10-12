exports.createUniqueId = function (plans) {
  let lastUID = plans[plans.length - 1].unique_ID
  let temp = lastUID.split('_')
  let uid = String.fromCharCode(temp[1].charCodeAt() + 1)
  return uid
}

exports.preparePlansData = function (body, uid) {
  let planData = {
    name: body.name,
    unique_ID: 'plan_' + uid,
    amount: body.amount,
    interval: body.interval,
    trial_period: body.trial_period
  }
  return planData
}

exports.prepareDataForPlanB = function () {
  let planData = {
    name: 'Individual Basic Plan',
    unique_ID: 'plan_B',
    amount: 0
  }
  return planData
}

exports.prepareDataForPlanA = function () {
  let planData = {
    name: 'Individual Premium Plan',
    unique_ID: 'plan_A',
    amount: 10,
    interval: 'monthly',
    default_individual: true
  }
  return planData
}

exports.prepareDataForPlanC = function () {
  let planData = {
    name: 'Team Premium Plan',
    unique_ID: 'plan_C',
    amount: 15,
    interval: 'monthly',
    default_team: true
  }
  return planData
}

exports.prepareDataForPlanD = function () {
  let planData = {
    name: 'Team Basic Plan',
    unique_ID: 'plan_D',
    amount: 0
  }
  return planData
}
