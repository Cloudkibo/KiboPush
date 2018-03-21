export function transformData (data) {
  data = JSON.parse(JSON.stringify(data))
  data.map((item) => {
    item.submenu.map((sub) => {
      if (sub.submenu && sub.submenu.length > 0) {
        sub.type = 'nested'
        sub.call_to_actions = sub.submenu
        delete sub.submenu
        delete sub.url
      } else {
        delete sub.submenu
      }
    })
    if (item.submenu && item.submenu.length > 0) {
      item.type = 'nested'
      item.call_to_actions = item.submenu
      delete item.submenu
      delete item.url
    } else {
      delete item.submenu
    }
  })
  var final = {}
  final.persistent_menu = [{ locale: 'default', call_to_actions: data }]
  JSONstringify(final)
  return final
}

export function getUrl (data, str) {
  // console.log('In setUrl ', event.target.value, str)
  var temp = data
  var index = str.split('-')
  switch (index[0]) {
    case 'item':
      if (temp[index[1]]) {
        if (temp[index[1]].submenu && temp[index[1]].submenu.length === 0) {
          return {placeholder: temp[index[1]].url, nested: false}
        } else {
          return {placeholder: '', nested: true}
        }
      }
      break
    case 'submenu':
      if (temp[index[1]] && temp[index[1]].submenu[index[2]]) {
        if (temp[index[1]].submenu[index[2]].submenu && temp[index[1]].submenu[index[2]].submenu.length === 0) {
          return {placeholder: temp[index[1]].submenu[index[2]].url, nested: false}
        } else {
          return {placeholder: '', nested: true}
        }
      }
      break
    case 'nested':
      if (temp[index[1]]) {
        if (temp[index[1]].submenu[index[2]].submenu[index[3]]) {
          return {placeholder: temp[index[1]].submenu[index[2]].submenu[index[3]].url, nested: false}
        }
      }
      break

    default:
      return 'default'
  }
}

function JSONstringify (json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, '\t')
  }

  var arr = []
  var _string = 'color:green'
  var _number = 'color:darkorange'
  var _boolean = 'color:blue'
  var _null = 'color:magenta'
  var _key = 'color:red'

  json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var style = _number
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        style = _key
      } else {
        style = _string
      }
    } else if (/true|false/.test(match)) {
      style = _boolean
    } else if (/null/.test(match)) {
      style = _null
    }
    arr.push(style)
    arr.push('')
    return '%c' + match + '%c'
  })

  arr.unshift(json)
  console.log('hello')
  console.log.apply(console, arr)
}
