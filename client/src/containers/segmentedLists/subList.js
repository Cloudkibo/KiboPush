export function getSubList (data, conditions, pages, joiningCondition, responses) {
  var filteredData = []
  var field = ''
  var text = ''
  var obj = {}
  var subSetIds = []
  for (let i = 0; i < conditions.length; i++) {
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
          for (let i = 0; i < obj.tags.length; i++) {
            let tag = obj.tags[i]
            if (tag.toLowerCase() === text.toLowerCase()) {
              filteredData.push(obj)
            }
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
