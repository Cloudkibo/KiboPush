export function getSubList (data, conditions) {
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
        if (obj[field].toLowerCase() === text.toLowerCase()) {
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
        if (obj[field].toLowerCase().includes(text.toLowerCase())) {
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
        var subText = obj[field].substring(0, text.length)
        if (subText.toLowerCase() === (text.toLowerCase())) {
          filteredData.push(obj)
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
