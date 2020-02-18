/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadImage, uploadTemplate } from '../../../redux/actions/convos.actions'
import { checkWhitelistedDomains } from '../../../redux/actions/broadcast.actions'

class Card extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.updateCardDetails = this.updateCardDetails.bind(this)
    this.showGuideLinesImageDialog = this.showGuideLinesImageDialog.bind(this)
    this.closeGuideLinesImageDialog = this.closeGuideLinesImageDialog.bind(this)
    this.edit = this.edit.bind(this)
    this.state = {
      imgSrc: props.img ? props.img : '',
      title: props.title ? props.title : '',
      buttons: props.buttons ? props.buttons : [],
      subtitle: props.subtitle ? props.subtitle : '',
      fileurl: props.fileurl ? props.fileurl : '',
      fileName: props.fileName ? props.fileName : '',
      type: props.type ? props.type : '',
      size: props.size ? props.size : '',
      image_url: props.image_url ? props.image_url : '',
      loading: false,
      styling: {minHeight: 30, maxWidth: 400},
      openPopover: false,
      openWebView: false,
      openWebsite: false,
      webviewsize: this.props.webviewsize ? this.props.webviewsize : 'FULL',
      webviewurl: this.props.webviewurl ? this.props.webviewurl : null,
      elementUrl: this.props.elementUrl ? this.props.elementUrl : null,
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      default_action: this.props.default_action ? this.props.default_action : null,
      isshowGuideLinesImageDialog: false
    }
    this.validatedButton = false
    this.getDeletePayload = this.getDeletePayload.bind(this)
  }

  showGuideLinesImageDialog () {
    this.setState({isshowGuideLinesImageDialog: true})
  }
  closeGuideLinesImageDialog () {
    this.setState({isshowGuideLinesImageDialog: false})
  }
  componentDidMount () {
    console.log('cardProps.cardDetails', this.props.cardDetails)
    if (this.props.cardDetails) {
      this.setState({default_action: this.props.cardDetails.default_action})
      // if (this.props.pages && this.props.cardDetails) {
      //   this.props.uploadTemplate({pages: this.props.pages,
      //     url: this.props.cardDetails.fileurl.url,
      //     componentType: 'image',
      //     id: this.props.cardDetails.fileurl.id,
      //     name: this.props.cardDetails.fileName
      //   }, { fileurl: '',
      //     fileName: this.props.cardDetails.fileName,
      //     type: this.props.cardDetails.type,
      //     image_url: '',
      //     size: this.props.cardDetails.size,
      //     default_action: this.props.cardDetails.default_action
      //   }, this.updateImageUrl, this.setLoading)
      // }
      this.updateCardDetails(this.props)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.updateCardDetails(nextProps)
  }

  updateCardDetails (cardProps) {
    console.log('cardProps.cardDetails', cardProps.cardDetails)
    console.log('defaultAction in card', cardProps.cardDetails.default_action)
    if (cardProps.cardDetails.default_action) {
      if (cardProps.cardDetails.default_action.type === 'web_url' && cardProps.cardDetails.default_action.messenger_extensions === undefined) {
        this.setState({elementUrl: cardProps.cardDetails.default_action.url, 
          default_action: cardProps.cardDetails.default_action})
      } else {
        this.setState({webviewurl: cardProps.cardDetails.default_action.url, 
            webviewsize: cardProps.cardDetails.default_action.webview_height_ratio, 
            default_action: cardProps.cardDetails.default_action})
      }
    }
    if (cardProps.cardDetails && cardProps.cardDetails !== '') {
      this.setState({
        //  id: cardProps.id,
        componentType: 'card',
        title: cardProps.cardDetails.title ? cardProps.cardDetails.title : '',
        imgSrc: cardProps.cardDetails.image_url ? cardProps.cardDetails.image_url : '',
        buttons: cardProps.cardDetails.buttons ? cardProps.cardDetails.buttons : [],
        fileurl: cardProps.cardDetails.fileurl,
        fileName: cardProps.cardDetails.fileName,
        image_url: cardProps.cardDetails.image_url,
        type: cardProps.cardDetails.type,
        size: cardProps.cardDetails.size
      })
      if (cardProps.cardDetails.subtitle) {
        this.setState({ subtitle: cardProps.cardDetails.subtitle })
      } else if (cardProps.cardDetails.description) {
        this.setState({ subtitle: cardProps.cardDetails.description })
      }
    }
  }

  edit () {
    let file = {
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size
    }
    let cards = [{
      default_action: this.props.default_action,
      file: file,
      webviewsize: this.state.webviewsize,
      webviewurl: this.state.webviewurl,
      elementUrl: this.props.elementUrl,
      buttons: [].concat(this.state.buttons),
      title: this.state.title,
      subtitle: this.state.subtitle,
      imgSrc: this.state.imgSrc,
      image_url: this.state.image_url,
      fileurl: this.state.fileurl,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
    }]
    if (this.props.links) {
      this.props.editComponent('link', {
        componentName:this.props.componentName,
        elementLimit: this.props.elementLimit,
        header:this.props.header,
        defaultErrorMsg:this.props.defaultErrorMsg,
        invalidMsg:this.props.invalidMsg,
        validMsg:this.props.validMsg,
        retrievingMsg:this.props.retrievingMsg,
        buttonTitle:this.props.buttonTitle,
        validateUrl:this.props.validateUrl,
        links: this.props.links,
        id: this.props.id,
        cards: [].concat(cards),
        buttonActions: this.props.buttonActions,
      })
    } else {
      this.props.editComponent('card', {
        id: this.props.id,
        cards: [].concat(cards),
        buttonActions: this.props.buttonActions,
      })
    }
  }

  validateButton(button) {
    let domButton = document.getElementById('button-' + button.id)
    if (button.type === 'postback') {
      let buttonPayload = JSON.parse(button.payload)
      for (let i = 0; i < buttonPayload.length; i++) {
        if (buttonPayload[i].action === 'send_message_block' && !buttonPayload[i].blockUniqueId) {
          if (!domButton) {
            setTimeout(() => {
              for (let j = 0; j < this.state.buttons.length; j++) {
                this.validateButton(this.state.buttons[j])
              }
            }, 100)
          } else {
            domButton.style['border-color'] = 'red'
          }
          return false
        }
      }
    }
    if (domButton) {
      domButton.style['border-color'] = 'rgba(0,0,0,.1)'
    }
    return true
  }

  getDeletePayload () {
    let buttons = this.state.buttons
    let deletePayload = []
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i] && buttons[i].type === 'postback') {
        let buttonPayload = JSON.parse(buttons[i].payload)
        deletePayload = deletePayload.concat(buttonPayload)
      }
    }
    return deletePayload
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px'}}>
        {
          <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.getDeletePayload()}) }} style={{float: 'right', height: 20 + 'px', marginTop: '-20px'}}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i className='fa fa-times fa-stack-2x' />
            </span>
          </div>
        }
        <i onClick={this.edit} style={{cursor: 'pointer', marginLeft: '-15px', float: 'left', height: '20px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '125px', maxWidth: '200px', marginLeft: '15px'}} >
          <div className='broadcastContent'>
            {
              this.state.imgSrc &&
              <img src={this.state.imgSrc} style={{objectFit: 'cover', maxHeight: '110px', maxWidth: '200px', minHeight: '110px', paddingTop: '5px', minWidth: '95%', margin: '-10px', width: '100%', height: '100%'}} alt='' />
            }
            <hr style={{marginTop: this.state.imgSrc ? '' : '100px', marginBottom: '5px'}} />
            <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{this.state.title}</h6>
            <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '5px', fontSize: '13px'}}>{this.state.subtitle}</p>
            <p style={{textAlign: 'left', marginLeft: '10px', fontSize: '13px'}}>{this.state.default_action && this.state.default_action.url}</p>
          </div>
          {
            this.state.buttons.map(button => {
              return (
                <div id={`button-${button.id}`} style={{border: !this.validateButton(button) ? 'solid 1px red' : '1px solid rgba(0,0,0,.1)', borderRadius: '5px', paddingTop: '2%'}}  >
                  {/* <hr /> */}
                  <h5 style={{color: '#0782FF'}}>{button.title}</h5>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({uploadImage: uploadImage, uploadTemplate: uploadTemplate, checkWhitelistedDomains: checkWhitelistedDomains}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Card)
