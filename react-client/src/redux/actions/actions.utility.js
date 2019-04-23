export function removeButtonOldurl (data) {
  console.log('data in removeButtonOldurl', data)
  for (let i = 0; i <= data.payload.length; i++) {
    if (i === data.payload.length) {
      console.log(data)
      return data
    } else {
      if (data.payload[i].buttons && data.payload[i].buttons.length > 0) {
        for (let j = 0; j < data.payload[i].buttons.length; j++) {
          if (data.payload[i].buttons[j].type === 'web_url' && data.payload[i].buttons[j].newUrl) {
            let url = data.payload[i].buttons[j].newUrl
            data.payload[i].buttons[j].url = url
            delete data.payload[i].buttons[j].newUrl
          }
        }
      }
      if (data.payload[i].componentType === 'gallery') {
        for (let j = 0; j < data.payload[i].cards.length; j++) {
          for (let k = 0; k < data.payload[i].cards[j].buttons.length; k++) {
            if (data.payload[i].cards[j].buttons[k].type === 'web_url' && data.payload[i].cards[j].buttons[k].newUrl) {
              let url = data.payload[i].cards[j].buttons[k].newUrl
              data.payload[i].cards[j].buttons[k].url = url
              delete data.payload[i].cards[j].buttons[k].newUrl
            }
          }
        }
      }
      if (data.payload[i].componentType === 'list') {
        for (let j = 0; j < data.payload[i].listItems.length; j++) {
          for (let k = 0; k < data.payload[i].listItems[j].buttons.length; k++) {
            if (data.payload[i].listItems[j].buttons[k].type === 'web_url' && data.payload[i].listItems[j].buttons[k].newUrl) {
              let url = data.payload[i].listItems[j].buttons[k].newUrl
              data.payload[i].listItems[j].buttons[k].url = url
              delete data.payload[i].listItems[j].buttons[k].newUrl
            }
          }
        }
      }
    }
  }
}
