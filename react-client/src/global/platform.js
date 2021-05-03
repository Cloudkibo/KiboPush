export function getProvider (automatedOptions, platform) {
  if (automatedOptions.sms) {
    automatedOptions.sms = {...automatedOptions.sms, provider: 'twilio'}
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
