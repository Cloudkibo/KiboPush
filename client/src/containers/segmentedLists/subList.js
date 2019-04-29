export function getSubList (data, conditions, pages, joiningCondition, responses) {
  console.log('data', data)
  console.log('conditions', conditions)
  console.log('pages', pages)
  console.log('joiningCondition', joiningCondition)
  console.log('responses', responses)
  var filteredData = []
  var field = ''
  var text = ''
  var obj = {}
  var subSetIds = []
  for (let i = 0; i < conditions.length; i++) {
    console.log('conditions length', conditions.length)
    if (conditions[i].criteria === 'is') {
      field = conditions[i].condition
      text = conditions[i].text
      for (let i = 0; i < data.length; i++) {
        obj = data[i]
        if (field === 'page') {
          for (let j = 0; j < pages.length; j++) {
            if (pages[j].pageName.toLowerCase() === text.toLowerCase() && pages[j]._id === obj.pageId._id) {
              filteredData.push(obj)
            }
          }
        } else if (field === 'tag') {
          console.log('obj.tags.length', obj.tags.length)
          for (let i = 0; i < obj.tags.length; i++) {
            let tag = obj.tags[i]
            if (tag.toLowerCase() === text.toLowerCase()) {
              filteredData.push(obj)
            }
          }
        } else if (field === 'phoneNumber') {
          if (obj[field] && obj[field] !== '' && obj[field] === text) {
            filteredData.push(obj)
          }
        } else if (obj[field] !== '' && obj[field].toLowerCase() === text.toLowerCase()) {
          filteredData.push(obj)
        }
      }
      if (joiningCondition === 'AND') {
        data = filteredData
        filteredData = []
      }
    } else if (conditions[i].criteria === 'contains') {
      field = conditions[i].condition
      text = conditions[i].text
      for (let i = 0; i < data.length; i++) {
        obj = data[i]
        if (field === 'page') {
          for (let j = 0; j < pages.length; j++) {
            if (pages[j].pageName.toLowerCase().includes(text.toLowerCase()) && pages[j]._id === obj.pageId._id) {
              filteredData.push(obj)
            }
          }
        } else if (field === 'tag') {
          for (let i = 0; i < obj.tags.length; i++) {
            let tag = obj.tags[i]
            if (tag.toLowerCase().includes(text.toLowerCase())) {
              filteredData.push(obj)
            }
          }
        } else if (field === 'phoneNumber') {
          if (obj[field] && obj[field] !== '' && obj[field].includes(text)) {
            filteredData.push(obj)
          }
        } else if (obj[field] !== '' && obj[field].toLowerCase().includes(text.toLowerCase())) {
          filteredData.push(obj)
        }
      }
      if (joiningCondition === 'AND') {
        data = filteredData
        filteredData = []
      }
    } else if (conditions[i].criteria === 'begins') {
      field = conditions[i].condition
      text = conditions[i].text
      for (let i = 0; i < data.length; i++) {
        obj = data[i]
        if (field === 'page') {
          for (let j = 0; j < pages.length; j++) {
            var subText1 = pages[j].pageName.substring(0, text.length)
            if (subText1.toLowerCase() === text.toLowerCase() && pages[j]._id === obj.pageId._id) {
              filteredData.push(obj)
            }
          }
        } else if (field === 'tag') {
          for (let i = 0; i < obj.tags.length; i++) {
            let tag = obj.tags[i]
            let subText = tag.substring(0, text.length)
            if (subText.toLowerCase() === text.toLowerCase()) {
              filteredData.push(obj)
            }
          }
        } else if (field === 'phoneNumber') {
          if (obj[field]) {
            var phone = obj[field].substring(0, text.length)
            if (phone === text) {
              filteredData.push(obj)
            }
          }
        } else if (obj[field] && obj[field] !== '') {
          var subText = obj[field].substring(0, text.length)
          if (subText.toLowerCase() === (text.toLowerCase())) {
            filteredData.push(obj)
          }
        }
      }
      if (joiningCondition === 'AND') {
        data = filteredData
        filteredData = []
      }
    } else if (conditions[i].criteria === 'on') {
      field = conditions[i].condition
      text = conditions[i].text
      for (let i = 0; i < data.length; i++) {
        obj = data[i]
        if (field === 'subscriptionDate') {
          let subscribeDate = new Date(obj.datetime)
          subscribeDate.setHours(0, 0, 0, 0)
          let compareDate = new Date(text)
          compareDate.setHours(0, 0, 0, 0)
          // console.log(subscribeDate, compareDate)
          if (subscribeDate.getTime() === compareDate.getTime()) {
            filteredData.push(obj)
          }
        }
      }
      if (field === 'reply') {
        if (responses && responses.length > 0) {
          for (let i = 0; i < responses.length; i++) {
            let alreadyAdded = false
            let responseSubscriber = responses[i]
            let responseDate = new Date(responseSubscriber.dateReplied)
            responseDate.setHours(0, 0, 0, 0)
            let compareDate = new Date(text)
            compareDate.setHours(0, 0, 0, 0)
            if (responseDate.getTime() === compareDate.getTime()) {
              for (let j = 0; j < filteredData.length; j++) {
                if (filteredData[j]._id === responseSubscriber._id) {
                  alreadyAdded = true
                  break
                }
              }
              if (!alreadyAdded) {
                filteredData.push(responseSubscriber)
              }
            }
          }
        }
      }
      if (joiningCondition === 'AND') {
        data = filteredData
        filteredData = []
      }
    } else if (conditions[i].criteria === 'before') {
      field = conditions[i].condition
      text = conditions[i].text
      for (let i = 0; i < data.length; i++) {
        obj = data[i]
        if (field === 'subscriptionDate') {
          let subscribeDate = new Date(obj.datetime)
          subscribeDate.setHours(0, 0, 0, 0)
          let compareDate = new Date(text)
          compareDate.setHours(0, 0, 0, 0)
          // console.log(subscribeDate, compareDate)
          if (subscribeDate.getTime() < compareDate.getTime()) {
            filteredData.push(obj)
          }
        }
      }
      if (field === 'reply') {
        if (responses && responses.length > 0) {
          for (let i = 0; i < responses.length; i++) {
            let alreadyAdded = false
            let responseSubscriber = responses[i]
            let responseDate = new Date(responseSubscriber.dateReplied)
            responseDate.setHours(0, 0, 0, 0)
            let compareDate = new Date(text)
            compareDate.setHours(0, 0, 0, 0)
            if (responseDate.getTime() < compareDate.getTime()) {
              for (let j = 0; j < filteredData.length; j++) {
                if (filteredData[j]._id === responseSubscriber._id) {
                  console.log('already added', filteredData[j])
                  alreadyAdded = true
                  break
                }
              }
              if (!alreadyAdded) {
                filteredData.push(responseSubscriber)
              }
            }
          }
        }
      }
      console.log('filteredData', filteredData)
      if (joiningCondition === 'AND') {
        data = filteredData
        filteredData = []
      }
    } else if (conditions[i].criteria === 'after') {
      field = conditions[i].condition
      text = conditions[i].text
      for (let i = 0; i < data.length; i++) {
        obj = data[i]
        if (field === 'subscriptionDate') {
          let subscribeDate = new Date(obj.datetime)
          subscribeDate.setHours(0, 0, 0, 0)
          let compareDate = new Date(text)
          compareDate.setHours(0, 0, 0, 0)
          // console.log(subscribeDate, compareDate)
          if (subscribeDate.getTime() > compareDate.getTime()) {
            filteredData.push(obj)
          }
        }
      }
      if (field === 'reply') {
        if (responses && responses.length > 0) {
          for (let i = 0; i < responses.length; i++) {
            let alreadyAdded = false
            let responseSubscriber = responses[i]
            let responseDate = new Date(responseSubscriber.dateReplied)
            responseDate.setHours(0, 0, 0, 0)
            let compareDate = new Date(text)
            compareDate.setHours(0, 0, 0, 0)
            if (responseDate.getTime() > compareDate.getTime()) {
              for (let j = 0; j < filteredData.length; j++) {
                if (filteredData[j]._id === responseSubscriber._id) {
                  alreadyAdded = true
                  break
                }
              }
              if (!alreadyAdded) {
                filteredData.push(responseSubscriber)
              }
            }
          }
        }
      }
      if (joiningCondition === 'AND') {
        data = filteredData
        filteredData = []
      }
    } else {
      return
    }
  }
  if (joiningCondition === 'AND') {
    for (let i = 0; i < data.length; i++) {
      subSetIds.push(data[i]._id)
    }
  }
  if (joiningCondition === 'OR') {
    for (let j = 0; j < filteredData.length; j++) {
      subSetIds.push(filteredData[j]._id)
    }
  }
  return subSetIds
}
