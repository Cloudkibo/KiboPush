import _ from 'underscore'

export function checkConditions (pageValue, genderValue, localeValue, tagValue, subscribers) {
  let subscribersMatchPages = []
  let subscribersMatchLocale = []
  let subscribersMatchGender = []
  let subscribersMatchTag = []

  if (pageValue.length === 0 && genderValue.length === 0 && localeValue.length === 0 && tagValue.length === 0) {
    return true
  }
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
  if (tagValue.length > 0) {
    for (var o = 0; o < subscribers.length; o++) {
      for (var p = 0; p < tagValue.length; p++) {
        for (var q = 0; q < subscribers[o].tags.length; q++) {
          if (subscribers[o].tags[q] === tagValue[p]) {
            subscribersMatchTag.push(subscribers[o])
          }
        }
      }
    }
  }
  if (intersection(subscribersMatchPages, subscribersMatchLocale, subscribersMatchGender, subscribersMatchTag).length === 0) {
    return false
  }
  return true
}

function intersection (...arrays) {
  let nonEmptyArrays = []
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) {
      nonEmptyArrays.push(arrays[i])
    }
  }
  return _.intersection(...nonEmptyArrays)
}
