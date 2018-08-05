export function removeButtonOldurl (data) {
  for (let i = 0; i <= data.payload.length; i++) {
    if (i === data.payload.length) {
      console.log(data)
      return data
    } else if (data.payload[i].buttons && data.payload[i].buttons.length > 0) {
      for (let j = 0; j < data.payload[i].buttons.length; j++) {
        if (data.payload[i].buttons[j].type === 'web_url') {
          let url = data.payload[i].buttons[j].newUrl
          data.payload[i].buttons[j].url = url
          delete data.payload[i].buttons[j].newUrl
        }
      }
    }
  }
}
