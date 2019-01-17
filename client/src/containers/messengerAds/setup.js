/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createJsonPayload } from '../../redux/actions/messengerAds.actions'

class SetUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      jsonCode: '<Json Code>',
      copied: false
    }
  }
  getPayload () {
    var jsonAd = {}
    for (var i = 0; i < this.props.messengerAd.jsonAdMessages.length; i++) {
      if (!this.props.messengerAd.jsonAdMessages[i].jsonAdMessageParentId) {
        jsonAd = this.props.messengerAd.jsonAdMessages[i]
        break
      }
    }
    let jsonObject = []
    for (var j = 0; j < jsonAd.messageContent.length; j++) {
      let messageJson = this.prepareJsonPayload(jsonAd.messageContent[j])
      jsonObject.push({message: messageJson})
    }
    return JSON.stringify(jsonObject, null, 4)
  }
  prepareJsonPayload (optinMessage) {
    let payload = {}
    let body = optinMessage
    let text = body.text
    var buttonPayload = []
    if (body.buttons && body.buttons.length > 0) {
      for (var i = 0; i < body.buttons.length; i++) {
        var button = body.buttons[i]
        if (button.payload && button.type === 'postback') {
          for (var j = 0; j < this.props.messengerAd.jsonAdMessages.length; j++) {
            if (button.payload === this.props.messengerAd.jsonAdMessages[j].jsonAdMessageId) {
              var jsonAdMessageId = this.props.messengerAd.jsonAdMessages[i]._id
              break
            }
          }
          button.payload = 'JSONAD-' + jsonAdMessageId
        }
        buttonPayload.push(button)
      }
    } else {
      buttonPayload = body.buttons
    }
    if (body.componentType === 'text' && !body.buttons) {
      if (body.text.includes('{{user_full_name}}') || body.text.includes('[Username]')) {
        text = text.replace(
          '{{user_full_name}}', fname + ' ' + lname)
      }
      if (body.text.includes('{{user_first_name}}')) {
        text = text.replace(
          '{{user_first_name}}', fname)
      }
      if (body.text.includes('{{user_last_name}}')) {
        text = text.replace(
          '{{user_last_name}}', lname)
      }
      payload = {
        'text': text,
        'metadata': 'This is a meta data'
      }
    } else if (body.componentType === 'text' && body.buttons) {
      if (body.text.includes('{{user_full_name}}') || body.text.includes('[Username]')) {
        text = text.replace(
          '{{user_full_name}}', fname + ' ' + lname)
      }
      if (body.text.includes('{{user_first_name}}')) {
        text = text.replace(
          '{{user_first_name}}', fname)
      }
      if (body.text.includes('{{user_last_name}}')) {
        text = text.replace(
          '{{user_last_name}}', lname)
      }
      payload = {
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'button',
            'text': text,
            'buttons': buttonPayload
          }
        }
      }
    } else if (['image', 'audio', 'file', 'video'].indexOf(
      body.componentType) > -1) {
      payload = {
        'attachment': {
          'type': body.componentType,
          'payload': {
            'attachment_id': body.fileurl.attachment_id
          }
        }
      }
    } else if (['gif', 'sticker', 'thumbsUp'].indexOf(
      body.componentType) > -1) {
      payload = {
        'attachment': {
          'type': 'image',
          'payload': {
            'url': body.fileurl
          }
        }
      }
    } else if (body.componentType === 'card') {
      payload = {
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'generic',
            'elements': [
              {
                'title': body.title,
                'image_url': body.image_url,
                'subtitle': body.description,
                'buttons': buttonPayload
              }
            ]
          }
        }
      }
    } else if (body.componentType === 'gallery') {
      payload = {
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'generic',
            'elements': body.cards
          }
        }
      }
    } else if (body.componentType === 'list') {
      payload = {
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'list',
            'top_element_style': body.topElementStyle,
            'elements': body.listItems,
            'buttons': buttonPayload
          }
        }
      }
    } else if (body.componentType === 'media') {
      payload = {
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'media',
            'elements': [
              {
                'attachment_id': body.fileurl.attachment_id,
                'media_type': body.mediaType,
                'buttons': buttonPayload
              }
            ]
          }
        }
      }
    }
    return payload
  }
  componentDidMount () {
    let payload = this.getPayload()
    this.setState({
      jsonCode: payload
    })
  }
  render () {
    return (
      <div>
        <div className='form-group m-form__group'>
          <h3>Generated JSON Code</h3>
          <p>The json code depends on the first items in your Opt-In message. Every time you change it, you will also need to copy the new JSON code.</p>

          <textarea
            className='form-control m-input m-input--solid'
            id='exampleTextarea' rows='3'
            placeholder='JSON code'
            style={{minHeight: '600px', resize: 'none', maxLength: '160'}}
            value={this.state.jsonCode}
            readOnly />
        </div>
        <CopyToClipboard text={this.state.jsonCode}
          onCopy={() => {
            this.setState({copied: true})
            toastr.options = {
              'closeButton': true,
              'debug': false,
              'newestOnTop': false,
              'progressBar': false,
              'positionClass': 'toast-bottom-right',
              'preventDuplicates': false,
              'showDuration': '300',
              'hideDuration': '1000',
              'timeOut': '5000',
              'extendedTimeOut': '1000',
              'showEasing': 'swing',
              'hideEasing': 'linear',
              'showMethod': 'fadeIn',
              'hideMethod': 'fadeOut'
            }

            toastr.success('Link Copied Successfully', 'Copied!')
          }
        }>
          <button type='button' className='btn btn-success'>
            Copy Link
          </button>
        </CopyToClipboard>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    messengerAd: state.messengerAdsInfo.messengerAd
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createJsonPayload: createJsonPayload
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SetUp)
