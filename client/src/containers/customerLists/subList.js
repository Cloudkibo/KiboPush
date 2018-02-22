export function getSubList (data, conditions, pages) {
  console.log('conditions', conditions)
  console.log('pages', pages)
  console.log('data', data)
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
        } else if (obj[field] !== '' && obj[field].toLowerCase() === text.toLowerCase()) {
          filteredData.push(obj)
        }
      }
      data = filteredData
      filteredData = []
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
        } else if (obj[field] !== '' && obj[field].toLowerCase().includes(text.toLowerCase())) {
          filteredData.push(obj)
        }
      }
      data = filteredData
      filteredData = []
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
        } else if (obj[field] && obj[field] !== '') {
          var subText = obj[field].substring(0, text.length)
          if (subText.toLowerCase() === (text.toLowerCase())) {
            filteredData.push(obj)
          }
        }
      }
      data = filteredData
      filteredData = []
    } else {
      return
    }
  }
  for (let i = 0; i < data.length; i++) {
    subSetIds.push(data[i]._id)
  }
  return subSetIds
}
