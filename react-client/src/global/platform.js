export function getProvider (automatedOptions, platform) {
  if (automatedOptions.twilio) {
    automatedOptions.sms = {...automatedOptions.twilio, provider: 'twilio'}
  }
  let provider = 'facebook'
  switch (platform) {
    case 'sms':
      provider = automatedOptions.sms.provider
      break
    case 'whatsApp':
      provider = automatedOptions.whatsApp.provider
      break
    default:
      provider = 'facebook'
  }
  return provider
}
