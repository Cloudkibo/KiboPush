export function removeButtonOldurl (data) {
  console.log('data in removeButtonOldurl', data)
  for (let i = 0; i <= data.length; i++) {
    if (i === data.length) {
      console.log(data)
      return data
    } else {
      if (data[i].buttons && data[i].buttons.length > 0) {
        for (let j = 0; j < data[i].buttons.length; j++) {
          if (data[i].buttons[j].type === 'web_url' && data[i].buttons[j].newUrl) {
            let url = data[i].buttons[j].newUrl
            data[i].buttons[j].url = url
            delete data[i].buttons[j].newUrl
          }
        }
      }
      if (data[i].componentType === 'gallery') {
        for (let j = 0; j < data[i].cards.length; j++) {
          for (let k = 0; k < data[i].cards[j].buttons.length; k++) {
            if (data[i].cards[j].buttons[k].type === 'web_url' && data[i].cards[j].buttons[k].newUrl) {
              let url = data[i].cards[j].buttons[k].newUrl
              data[i].cards[j].buttons[k].url = url
              delete data[i].cards[j].buttons[k].newUrl
            }
          }
        }
      }
      if (data[i].componentType === 'list') {
        for (let j = 0; j < data[i].listItems.length; j++) {
          delete data[i].listItems[j].id
          for (let k = 0; k < data[i].listItems[j].buttons.length; k++) {
            if (data[i].listItems[j].buttons[k].type === 'web_url' && data[i].listItems[j].buttons[k].newUrl) {
              let url = data[i].listItems[j].buttons[k].newUrl
              data[i].listItems[j].buttons[k].url = url
              delete data[i].listItems[j].buttons[k].newUrl
            }
          }
        }
      }
    }
  }
}
