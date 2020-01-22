import React from 'react'
import Text from '../convo/Text'
import Image from '../convo/Image'
import Audio from '../convo/Audio'
import Video from '../convo/Video'
import File from '../convo/File'
import List from '../convo/List'
import Media from '../convo/Media'
import Card from '../convo/Card'
import Gallery from '../convo/Gallery'
export function transformData (data) {
  data = JSON.parse(JSON.stringify(data))
  for (let a = 0; a < data.length; a++) {
    let item = data[a]
    for (let b = 0; b < item.submenu.length; b++) {
      let sub = item.submenu[b]
      if (sub.submenu && sub.submenu.length > 0) {
        sub.type = 'nested'
        sub.call_to_actions = sub.submenu
        delete sub.submenu
        delete sub.url
      } else {
        delete sub.submenu
      }
    }
    if (item.submenu && item.submenu.length > 0) {
      item.type = 'nested'
      item.call_to_actions = item.submenu
      delete item.submenu
      delete item.url
    } else {
      delete item.submenu
    }
    if (item.type === 'postback') {
      item.payload = JSON.stringify({action: 'send_menu_reply', index: a})
    }
  }
  var final = {}
  final.persistent_menu = [{locale: 'default', call_to_actions: data}]
  JSONstringify(final)
  return final
}

export function getUrl (data, str) {
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
        if (temp[index[1]].submenu[index[2]].submenu &&
          temp[index[1]].submenu[index[2]].submenu.length === 0) {
          return {
            placeholder: temp[index[1]].submenu[index[2]].url,
            nested: false
          }
        } else {
          return {placeholder: '', nested: true}
        }
      }
      break
    case 'nested':
      if (temp[index[1]]) {
        if (temp[index[1]].submenu[index[2]].submenu[index[3]]) {
          return {
            placeholder: temp[index[1]].submenu[index[2]].submenu[index[3]].url,
            nested: false
          }
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

// eslint-disable-next-line no-useless-escape
  json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
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
  console.log.apply(console, arr)
}
export function removeMenuPayload () {
  var payload = {}
  payload.persistent_menu = [{locale: 'default', composer_input_disabled: false}]
  JSONstringify(payload)
  return payload
}

export function onClickText (timeStamp, refObj, pageId, module) {
  let temp = refObj.state.list
  refObj.msg.info('New Text Component Added')
  refObj.setState({ list: [...temp, { content: (<Text id={timeStamp} pageId={pageId} key={timeStamp} module={module} handleText={refObj.handleText} onRemove={refObj.removeComponent} removeState />) }] })
  refObj.handleText({ id: timeStamp, text: '', button: [] })
}

export function onImageClick (timeStamp, refObj, pages) {
  let temp = refObj.state.list
  refObj.msg.info('New Image Component Added')
  refObj.setState({list: [...temp, {content: (<Image id={timeStamp} pages={pages} key={timeStamp} handleImage={refObj.handleImage} onRemove={refObj.removeComponent} />)}]})
  refObj.handleImage({id: timeStamp, componentType: 'image', image_url: '', fileurl: ''})
}

export function onAudioClick (timeStamp, refObj, pages) {
  let temp = refObj.state.list
  refObj.msg.info('New Audio Component Added')
  refObj.setState({list: [...temp, {content: (<Audio id={timeStamp} pages={pages} key={timeStamp} handleFile={refObj.handleFile} onRemove={refObj.removeComponent} />)}]})
  refObj.handleFile({id: timeStamp, componentType: 'audio', fileurl: ''})
}
export function onVideoClick (timeStamp, refObj, pages) {
  let temp = refObj.state.list
  refObj.msg.info('New Video Component Added')
  refObj.setState({list: [...temp, {content: (<Video id={timeStamp} pages={pages} key={timeStamp} handleFile={refObj.handleFile} onRemove={refObj.removeComponent} />)}]})
  refObj.handleFile({id: timeStamp, componentType: 'video', fileurl: ''})
}

export function onFileClick (timeStamp, refObj, pages) {
  let temp = refObj.state.list
  refObj.msg.info('New File Component Added')
  refObj.setState({list: [...temp, {content: (<File id={timeStamp} pages={pages} key={timeStamp} handleFile={refObj.handleFile} onRemove={refObj.removeComponent} />)}]})
  refObj.handleFile({id: timeStamp, componentType: 'file', fileurl: ''})
}
export function onListClick (timeStamp, refObj, module, pages, pageId) {
  let temp = refObj.state.list
  refObj.msg.info('New List Component Added')
  refObj.setState({list: [...temp, {content: (<List pageId={pageId} id={timeStamp} pages={pages} module={module} key={timeStamp} handleList={refObj.handleList} onRemove={refObj.removeComponent} />)}]})
  refObj.handleList({id: timeStamp, componentType: 'list', listItems: [], topElementStyle: 'compact'})
}
export function onMediaClick (timeStamp, refObj, module, pages, pageId) {
  let temp = refObj.state.list
  refObj.msg.info('New Media Component Added')
  refObj.setState({list: [...temp, {content: (<Media pageId={pageId} id={timeStamp} pages={pages} module={module} key={timeStamp} handleMedia={refObj.handleMedia} onRemove={refObj.removeComponent} />)}]})
  refObj.handleMedia({id: timeStamp, componentType: 'media', fileurl: '', buttons: []})
}

export function onCardClick (timeStamp, refObj, module, pages, pageId) {
  let temp = refObj.state.list
  refObj.msg.info('New Card Component Added')
  refObj.setState({list: [...temp, {content: (<Card id={timeStamp} pageId={pageId} pages={pages} module={module} key={timeStamp} handleCard={refObj.handleCard} onRemove={refObj.removeComponent} singleCard />)}]})
  refObj.handleCard({id: timeStamp, componentType: 'card', title: '', description: '', fileurl: '', buttons: []})
}

export function onGalleryClick (timeStamp, refObj, module, pages, pageId) {
  let temp = refObj.state.list
  refObj.msg.info('New Gallery Component Added')
  refObj.setState({list: [...temp, {content: (<Gallery id={timeStamp} pageId={pageId} pages={pages} module={module} key={timeStamp} handleGallery={refObj.handleGallery} onRemove={refObj.removeComponent} />)}]})
  refObj.handleGallery({id: timeStamp, componentType: 'gallery', cards: []})
}
