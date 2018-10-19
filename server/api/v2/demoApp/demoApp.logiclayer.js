exports.prepareData = (company, data) => {
  let customerIdIndex = data[0].indexOf('customerId')
  let firstNameIndex = data[0].indexOf('customerFirstName')
  let lastNameIndex = data[0].indexOf('customerLastName')
  let indexes = [customerIdIndex, firstNameIndex, lastNameIndex]
  let columns = data.splice(0, 1)
  let dataToSend = []
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let finalData = {
      company: company,
      customerId: item[customerIdIndex],
      firstName: item[firstNameIndex],
      lastName: item[lastNameIndex]
    }
    let details = {}
    for (let j = 0; j < item.length; j++) {
      let value = item[j]
      if (indexes.indexOf(j) === -1) {
        details[columns[0][j]] = value
      }
    }
    finalData.details = details
    dataToSend.push(finalData)
  }
  return dataToSend
}
