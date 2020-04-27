
  export function validateFields (broadcast, msg) {
    var isValid = true
    console.log('broadcast', broadcast)

    for (let i = 0; i < broadcast.length; i++) {
      console.log('broadcast[i].fileurl', broadcast[i].fileurl)
      if (broadcast[i].componentType === 'text') {
        if (broadcast[i].text === undefined || broadcast[i].text === '') {
          msg.error('Text cannot be empty')
          isValid = false
          break
        }
      }
      if (broadcast[i].componentType === 'audio') {
        if ((broadcast[i].fileurl === undefined || broadcast[i].fileurl === '') && (broadcast[i].file === undefined || broadcast[i].file === '')) {
          msg.error('Select an audio file')
          isValid = false
          break
        }
      }
      if (broadcast[i].componentType === 'video') {
        if ((broadcast[i].fileurl === undefined || broadcast[i].fileurl === '') && (broadcast[i].file === undefined || broadcast[i].file === '')) {
          msg.error('Select a video file')
          isValid = false
          break
        }
      }
      if (broadcast[i].componentType === 'file') {
        if ((broadcast[i].fileurl === undefined || broadcast[i].fileurl === '') && (broadcast[i].file === undefined || broadcast[i].file === '')) {
          msg.error('Select a valid file')
          isValid = false
          break
        }
      }
      if (broadcast[i].componentType === 'image') {
        if (broadcast[i].image_url === undefined || broadcast[i].image_url === '') {
          msg.error('Select a valid image')
          isValid = false
          break
        }
      }
      if (broadcast[i].componentType === 'media') {
        if ((broadcast[i].fileurl === undefined || broadcast[i].fileurl === '') && (broadcast[i].file === undefined || broadcast[i].file === '')) {
          if (!broadcast[i].facebookUrl) {
            msg.error('Select an image or video')
            isValid = false
            break 
          }
        }
      }
      if (broadcast[i].componentType === 'card') {
        if (broadcast[i].image_url === undefined || broadcast[i].image_url === '') {
          msg.error('Card must have an image')
          isValid = false
          break
        }
        if (broadcast[i].title === undefined || broadcast[i].title === '') {
          msg.error('Card must have a Title')
          isValid = false
          break
        }
        if (broadcast[i].description === undefined || broadcast[i].description === '') {
          msg.error('Card must have a subtitle')
          isValid = false
          break
        }
        if (!broadcast[i].buttons) {
          msg.error('Card must have at least one button.')
          isValid = false
          break
        } else if (broadcast[i].buttons.length === 0) {
          msg.error('Card must have at least one button.')
          isValid = false
          break
        }
      }
      if (broadcast[i].componentType === 'gallery') {
        console.log('in gallery component')
        if (broadcast[i].cards.length < 2) {
          msg.error('In gallery must have at least two filled cards.')
          isValid = false
          break
        }
        for (let j = 0; j < broadcast[i].cards.length; j++) {
          if (!broadcast[i].cards[j].buttons) {
            msg.error('Card in gallery must have at least one button.')
            isValid = false
            break
          } else if (broadcast[i].cards[j].buttons.length === 0) {
            msg.error('Card in gallery must have at least one button.')
            isValid = false
            break
          }
          if (broadcast[i].cards[j].title === undefined || broadcast[i].cards[j].title === '') {
            msg.error('Card in gallery must have a title.')
            isValid = false
            break
          }
          if (broadcast[i].cards[j].subtitle === undefined || broadcast[i].cards[j].subtitle === '') {
            msg.error('Card in gallery must have a subtitle.')
            isValid = false
            break
          }
          if (broadcast[i].cards[j].image_url === undefined || broadcast[i].cards[j].image_url === '') {
            msg.error('Card in gallery must have an image.')
            isValid = false
            break
          }
        }
        if (!isValid) {
          break
        }
      }
      if (broadcast[i].componentType === 'list') {
        if (broadcast[i].listItems && broadcast[i].listItems.length < 2) {
          msg.error('A list must have at least 2 complete elements')
          isValid = false
          break
        }
        if (broadcast[i].topElementStyle === 'LARGE' && broadcast[i].listItems[0].image_url === '') {
          msg.error('Please select an image for top item with large style in list')
          isValid = false
          break
        }
        for (let j = 0; j < broadcast[i].listItems.length; j++) {
          if (!broadcast[i].listItems[j].title) {
            msg.error('Element in list must have a title.')
            isValid = false
            break
          } else if (!broadcast[i].listItems[j].subtitle) {
            msg.error('Element in list must have a subtitle.')
            isValid = false
            break
          }
        }
        if (!isValid) {
          break
        }
      }
    }
    return isValid
  }
