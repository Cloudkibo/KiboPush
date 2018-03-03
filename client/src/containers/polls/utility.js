import _ from 'underscore'

export function checkConditions (pageValue, genderValue, localeValue, subscribers) {
  let subscribersMatchPages = []
  let subscribersMatchLocale = []
  let subscribersMatchGender = []
  if (pageValue.length > 0) {
    for (var i = 0; i < pageValue.length; i++) {
      for (var j = 0; j < subscribers.length; j++) {
        if (subscribers[j].pageId.pageId === pageValue[i]) {
          subscribersMatchPages.push(subscribers[j])
        }
      }
    }
  }
  if (genderValue.length > 0) {
    for (var k = 0; k < subscribers.length; k++) {
      for (var l = 0; l < genderValue.length; l++) {
        if (subscribers[k].gender === genderValue[l]) {
          subscribersMatchGender.push(subscribers[k])
        }
      }
    }
  }
  if (localeValue.length > 0) {
    for (var m = 0; m < subscribers.length; m++) {
      for (var n = 0; n < localeValue.length; n++) {
        if (subscribers[m].locale === localeValue[n]) {
          subscribersMatchLocale.push(subscribers[m])
        }
      }
    }
  }
  if (pageValue.length > 0 && genderValue.length > 0 && localeValue.length > 0) {
    var result = _.intersection(subscribersMatchPages, subscribersMatchLocale, subscribersMatchGender)
    if (result.length === 0) {
      console.log('inside if')
      return false
    }
  } else if (pageValue.length > 0 && genderValue.length) {
    if (_.intersection(subscribersMatchPages, subscribersMatchGender).length === 0) {
      return false
    }
  } else if (pageValue.length > 0 && localeValue.length) {
    if (_.intersection(subscribersMatchPages, subscribersMatchLocale).length === 0) {
      return false
    }
  } else if (genderValue.length > 0 && localeValue.length) {
    if (_.intersection(subscribersMatchGender, subscribersMatchLocale).length === 0) {
      return false
    }
  } else if (pageValue.length > 0 && subscribersMatchPages.length === 0) {
    return false
  } else if (genderValue.length > 0 && subscribersMatchGender.length === 0) {
    return false
  } else if (localeValue.length > 0 && subscribersMatchLocale.length === 0) {
    return false
  }
  return true
}
