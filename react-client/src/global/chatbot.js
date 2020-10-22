import { getProvider } from './platform'

const getAttachmentLimits = function (provider, platform) {
  let limits = []
  if (platform === 'sms' && provider === 'twilio') {
    limits.push({
      size: 5000000,
      mimeTypes: {
        supported: ['image/jpeg', 'image/gif', 'image/png']
      }
    })
    limits.push({
      size: 600000,
      mimeTypes: {
        supported: [
          'image/bmp', 'audio/basic', 'audio/L24', 'audio/mp4', 'audio/mpeg',
          'audio/ogg', 'audio/vorbis', 'audio/vnd.rn-realaudio', 'audio/vnd.wave',
          'audio/3gpp', 'audio/3gpp2', 'audio/ac3', 'audio/vnd.wave', 'audio/webm',
          'audio/amr-nb', 'audio/amr', 'video/mpeg', 'video/mp4', 'video/quicktime',
          'video/webm', 'video/3gpp', 'video/3gpp2', 'video/3gpp-tt', 'video/H261',
          'video/H263', 'video/H263-1998', 'video/H263-2000', 'video/H264', 'text/vcard',
          'text/csv', 'text/rtf', 'text/richtext', 'text/calendar', 'text/directory',
          'application/pdf'
        ]
      }
    })
  } else if (platform === 'whatsApp' && provider === 'twilio') {
    limits.push({
      size: 16000000,
      mimeTypes: {
        supported: [
          'image/jpeg', 'image/gif', 'image/png', 'audio/mpeg', 'audio/ogg', 'audio/amr',
          'application/pdf', 'video/mp4'
        ]
      }
    })
  } else if (platform === 'whatsApp' && provider === 'flockSend') {
    limits.push({
      size: 5000000,
      mimeTypes: {
        supported: [
          'image/jpeg', 'image/png'
        ]
      }
    })
    limits.push({
      size: 16000000,
      mimeTypes: {
        supported: [
          'video/mp4', 'audio/mp3', 'audio/mpeg', 'audio/amr'
        ]
      }
    })
    limits.push({
      size: 15000000,
      mimeTypes: {
        supported: [
          'application/pdf'
        ]
      }
    })
  } else {
    limits.push({
      size: 25000000,
      mimeTypes: {
        notSupported: [
          'application/zip', 'text/javascript', 'text/exe', 'application/x-ms-dos-executable'
        ]
      }
    })
  }
  return limits
}

export function validateAttachment (file, automatedOptions, platform) {
  const provider = getProvider(automatedOptions, platform)
  const limits = getAttachmentLimits(provider, platform)
  let supported = []
  let notSupported = []
  let result = {status: 'success'}
  for (let i = 0; i < limits.length; i++) {
    if (
      file.size > limits[i].size && limits[i].mimeTypes.supported &&
      limits[i].mimeTypes.supported.includes(file.type)
    ) {
      result = {status: 'failed', description: `${provider} does not allow file size to be greater than ${limits[i].size / 1000}KB for ${platform}.`}
      break
    }
    if (limits[i].mimeTypes.notSupported) {
      notSupported = [...notSupported, ...limits[i].mimeTypes.notSupported]
    }
    if (limits[i].mimeTypes.supported) {
      supported = [...supported, ...limits[i].mimeTypes.supported]
    }
    if (i === (limits.length - 1)) {
      if (notSupported.length > 0 && notSupported.includes(file.type)) {
        result = {status: 'failed', description: `${file.type} files are not supported. Please select different file`}
      } else if (supported.length > 0 && !supported.includes(file.type)) {
        result = {status: 'failed', description: `${file.type} files are not supported by ${provider}. Please select different file`}
      }
    }
  }
  return result
}
