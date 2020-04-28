export function checkValidations (sponsoredMessage) {
  console.log('in checkValidations', sponsoredMessage)
  if (!sponsoredMessage.adAccountId || sponsoredMessage.adAccountId === '' ||
    !sponsoredMessage.campaignType || sponsoredMessage.campaignType === ''||
    !sponsoredMessage.adSetType || sponsoredMessage.adSetType === '' ||
    !sponsoredMessage.adName || sponsoredMessage.adName === '' ||
    !sponsoredMessage.payload || sponsoredMessage.payload.length === 0
  ) {
    return false
  }
  if (sponsoredMessage.campaignType === 'existing' && (sponsoredMessage.campaignId === '' || !sponsoredMessage.campaignId)) {
    return false
  }
  if (sponsoredMessage.campaignType === 'new' && (sponsoredMessage.campaignName === '' || !sponsoredMessage.campaignName)) {
    return false
  }
  if (sponsoredMessage.adSetType === 'existing' && (sponsoredMessage.adSetId === '' || !sponsoredMessage.adSetId)) {
    return false
  }
  if (sponsoredMessage.adSetType === 'new' && (
    sponsoredMessage.budgetType === '' || !sponsoredMessage.budgetType ||
    sponsoredMessage.budgetAmount === '' || !sponsoredMessage.budgetAmount ||
    sponsoredMessage.bidAmount === '' || !sponsoredMessage.bidAmount ||
    !sponsoredMessage.targeting ||
    sponsoredMessage.targeting.gender === '' || !sponsoredMessage.targeting.gender ||
    sponsoredMessage.targeting.minAge === '' || !sponsoredMessage.targeting.minAge ||
    sponsoredMessage.targeting.maxAge === '' || !sponsoredMessage.targeting.maxAge
    )
  ) {
    return false
  }
  if (sponsoredMessage.selectedFormat === 'text' && (!sponsoredMessage.payload[0] ||
    !sponsoredMessage.payload[0].text || sponsoredMessage.payload[0].text === '')) {
    return false
  }
  if (sponsoredMessage.selectedFormat === 'textAndImage' && (
    !sponsoredMessage.payload[1] || !sponsoredMessage.payload[1].title || sponsoredMessage.payload[1].title === '' ||
    !sponsoredMessage.payload[1].image_url || sponsoredMessage.payload[1].image_url === ''
    )
  ) {
    return false
  }
  return true
}
