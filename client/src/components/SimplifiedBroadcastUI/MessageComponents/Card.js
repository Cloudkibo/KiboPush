/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'
import EditButton from './EditButton'
import Halogen from 'halogen'
import { uploadImage, uploadTemplate } from '../../../redux/actions/convos.actions'
import { checkWhitelistedDomains } from '../../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import { isWebURL } from './../../../utility/utils'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class Card extends React.Component {
  constructor (props, context) {
    super(props, context)
    this._onChange = this._onChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.addButton = this.addButton.bind(this)
    this.handleSubtitle = this.handleSubtitle.bind(this)
    this.editButton = this.editButton.bind(this)
    this.removeButton = this.removeButton.bind(this)
    this.updateImageUrl = this.updateImageUrl.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.updateCardDetails = this.updateCardDetails.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.showWebView = this.showWebView.bind(this)
    this.showWebsite = this.showWebsite.bind(this)
    this.changeWebviewUrl = this.changeWebviewUrl.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
    this.onChangeWebviewSize = this.onChangeWebviewSize.bind(this)
    this.closeWebsite = this.closeWebsite.bind(this)
    this.closeWebview = this.closeWebview.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleWebView = this.handleWebView.bind(this)
    this.onImgLoad = this.onImgLoad.bind(this)
    this.showGuideLinesImageDialog = this.showGuideLinesImageDialog.bind(this)
    this.closeGuideLinesImageDialog = this.closeGuideLinesImageDialog.bind(this)
    this.state = {
      imgSrc: props.img ? props.img : '',
      title: props.title ? props.title : '',
      buttons: props.buttons ? props.buttons : [],
      subtitle: props.subtitle ? props.subtitle : '',
      fileurl: '',
      fileName: '',
      type: '',
      size: '',
      image_url: '',
      loading: false,
      styling: {minHeight: 30, maxWidth: 400},
      openPopover: false,
      openWebView: false,
      openWebsite: false,
      webviewsize: this.props.webviewsize ? this.props.webviewsize : 'FULL',
      webviewurl: this.props.webviewurl ? this.props.webviewurl : '',
      elementUrl: this.props.elementUrl ? this.props.elementUrl : '',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      defaultAction: '',
      isshowGuideLinesImageDialog: false
    }
  }

  showGuideLinesImageDialog () {
    this.setState({isshowGuideLinesImageDialog: true})
  }
  closeGuideLinesImageDialog () {
    this.setState({isshowGuideLinesImageDialog: false})
  }

  onImgLoad (e) {
    e.persist()
    console.log('image dimensions after load', {width: e.target.width, height: e.target.height})
    let imgWidth = e.target.naturalWidth
    let imgHeight = e.target.naturalHeight
    let aspectRatio = imgWidth / imgHeight
    console.log('aspect ratio of image', aspectRatio)
    if (aspectRatio > 2 || aspectRatio < 1.8) {
      this.showGuideLinesImageDialog()
    }
  }

  handleClick (e) {
    if (this.state.elementUrl !== '' && isWebURL(this.state.elementUrl)) {
      this.setState({disabled: false, openWebsite: true})
    }
    if (this.state.webviewurl !== '' && isWebURL(this.state.webviewurl)) {
      this.setState({disabled: false, openWebView: true})
    }
    this.setState({openPopover: !this.state.openPopover})
  }
  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
  }
  onChangeWebviewSize (event) {
    if (event.target.value !== -1) {
      this.setState({webviewsize: event.target.value})
    }
  }
  handleClose () {
    this.setState({openPopover: false})
  }
  handleRemove () {
    this.setState({openPopover: false, elementUrl: '', webviewurl: '', webviewsize: 'FULL', openWebsite: false, openWebView: false, defaultAction: ''})
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.buttons,
      default_action: ''
    })
  }
  showWebView () {
    this.setState({openWebView: true})
  }
  showWebsite () {
    this.setState({openWebsite: true})
  }
  handleWebView (resp) {
    if (resp.status === 'success') {
      if (resp.payload) {
        let defaultAction
        defaultAction = {
          type: 'web_url',
          url: this.state.webviewurl, // User defined link,
          messenger_extensions: true,
          webview_height_ratio: this.state.webviewsize
        }
        this.setState({
          defaultAction: defaultAction
        })
        this.props.handleCard({id: this.props.id,
          componentType: 'card',
          fileurl: this.state.fileurl,
          image_url: this.state.image_url,
          fileName: this.state.fileName,
          type: this.state.type,
          size: this.state.size,
          title: this.state.title,
          description: this.state.subtitle,
          buttons: this.state.buttons,
          default_action: defaultAction
        })
        this.setState({
          openPopover: false
        })
      } else {
        this.msg.error('The given domain is not whitelisted. Please add it to whitelisted domains.')
      }
    } else {
      this.msg.error('Unable to verify whitelisted domains.')
    }
  }
  handleDone () {
    if (this.state.webviewurl !== '') {
      this.props.checkWhitelistedDomains({pageId: this.props.pageId, domain: this.state.webviewurl}, this.handleWebView)
    } else if (this.state.elementUrl !== '') {
      let defaultAction
      defaultAction = {
        type: 'web_url', url: this.state.elementUrl
      }
      this.setState({
        defaultAction: defaultAction
      })
      this.props.handleCard({id: this.props.id,
        componentType: 'card',
        fileurl: this.state.fileurl,
        image_url: this.state.image_url,
        fileName: this.state.fileName,
        type: this.state.type,
        size: this.state.size,
        title: this.state.title,
        description: this.state.subtitle,
        buttons: this.state.buttons,
        default_action: defaultAction
      })
      this.setState({
        openPopover: false
      })
    }
  }
  closeWebview () {
    this.setState({openWebView: false, webviewurl: '', webviewsize: 'FULL', disabled: true})
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.buttons,
      default_action: this.state.defaultAction
    })
  }
  closeWebsite () {
    this.setState({openWebsite: false, elementUrl: '', disabled: true})
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.buttons,
      default_action: this.state.defaultAction
    })
  }
  changeWebviewUrl (e) {
    if (isWebURL(this.state.webviewurl)) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({webviewurl: e.target.value, elementUrl: ''})
  }
  changeUrl (event) {
    console.log('event', event.target.value)
    if (isWebURL(this.state.elementUrl)) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({elementUrl: event.target.value, webviewurl: '', webviewsize: 'FULL'})
  }
  componentDidMount () {
    console.log('cardProps.cardDetails', this.props.cardDetails)
    if (this.props.cardDetails) {
      this.setState({default_action: this.props.cardDetails.default_action})
      if (this.props.pages && this.props.cardDetails) {
        this.props.uploadTemplate({pages: this.props.pages,
          url: this.props.cardDetails.fileurl.url,
          componentType: 'image',
          id: this.props.cardDetails.fileurl.id,
          name: this.props.cardDetails.fileName
        }, { fileurl: '',
          fileName: this.props.cardDetails.fileName,
          type: this.props.cardDetails.type,
          image_url: '',
          size: this.props.cardDetails.size,
          default_action: this.props.cardDetails.default_action
        }, this.updateImageUrl, this.setLoading)
      }
      this.updateCardDetails(this.props)
    }
  }
  componentWillReceiveProps (nextProps) {
    this.updateCardDetails(nextProps)
  }
  updateCardDetails (cardProps) {
    console.log('cardProps.cardDetails', cardProps.cardDetails)
    console.log('defaultAction in card', cardProps.cardDetails.default_action)
    if (cardProps.cardDetails.default_action !== '' && cardProps.cardDetails.default_action !== undefined) {
      if (cardProps.cardDetails.default_action.type === 'web_url' && cardProps.cardDetails.default_action.messenger_extensions === undefined) {
        this.setState({elementUrl: cardProps.cardDetails.default_action.url})
      } else {
        this.setState({webviewurl: cardProps.cardDetails.default_action.url, webviewsize: cardProps.cardDetails.default_action.webview_height_ratio})
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
  _onChange () {
  // Assuming only image
    var file = this.refs.file.files[0]
    if (file) {
      if (file.type && file.type !== 'image/bmp' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        if (this.props.handleCard) {
          this.props.handleCard({error: 'invalid image'})
        }
        return
      }
      var reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = function (e) {
        // this.props.handleCard({id: this.props.id, title: this.state.title, subtitle: this.state.subtitle, imgSrc: [reader.result]})
        this.setState({
          imgSrc: [reader.result]
        })
      }.bind(this)
      this.setState({loading: true})
      if (this.props.setLoading) {
        this.props.setLoading(true)
      }
      this.props.uploadImage(file, this.props.pages, 'image', {fileurl: '',
        fileName: file.name,
        type: file.type,
        image_url: '',
        size: file.size}, this.updateImageUrl, this.setLoading)
    }
  }

  handleChange (event) {
    console.log('+onChange')
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: event.target.value,
      description: this.state.subtitle,
      buttons: this.state.buttons,
      default_action: this.state.defaultAction
    })
    this.setState({
      title: event.target.value
    })
  }

  handleSubtitle (event) {
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: event.target.value,
      buttons: this.state.buttons,
      default_action: this.state.defaultAction
    })
    this.setState({
      subtitle: event.target.value
    })
  }

  addButton (obj) {
    console.log('obj', obj)
    var temp = this.state.buttons
    temp.push(obj)
    this.setState({buttons: temp}, () => {
      this.props.handleCard({id: this.props.id,
        componentType: 'card',
        fileurl: this.state.fileurl,
        image_url: this.state.image_url,
        fileName: this.state.fileName,
        type: this.state.type,
        size: this.state.size,
        title: this.state.title,
        description: this.state.subtitle,
        buttons: temp,
        default_action: this.state.defaultAction
      })
      console.log('after add button: ', temp)
    })
  }

  editButton (obj) {
    var temp = this.state.buttons.map((elm, index) => {
      if (index === obj.id) {
        elm = obj.button
      }
      return elm
    })
    this.setState({buttons: temp})
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: temp,
      default_action: this.state.defaultAction
    })
  }
  removeButton (obj) {
    var temp = this.state.buttons.filter((elm, index) => { return index !== obj.id })
    this.setState({buttons: temp})
    if (obj.button && obj.button.type === 'postback') {
      var deletePayload = obj.button.payload
    }
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: temp,
      default_action: this.state.defaultAction,
      deletePayload: deletePayload
    })
  }

  setLoading () {
    this.setState({loading: false})
    if (this.props.setLoading) {
      this.props.setLoading(false)
    }
  }
  updateImageUrl (data) {
    this.setState({ fileurl: data.fileurl,
      fileName: data.fileName,
      image_url: data.image_url,
      type: data.type,
      size: data.size })

    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: data.fileurl,
      image_url: data.image_url,
      fileName: data.fileName,
      type: data.type,
      size: data.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.buttons,
      default_action: this.state.defaultAction
    })
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.isshowGuideLinesImageDialog &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeGuideLinesImageDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeGuideLinesImageDialog}>
              <h4>⚠️ This image may be cropped or scaled</h4>
              <br />
              <h6><i className='flaticon-exclamation m--font-brand' /> This image isn't using the recommended aspect ratio of <strong>1.91:1</strong>.</h6>
              <br />
              <ul>
                <li>Aspect ratio is the ratio of width to height of the image.</li>
                <li>Photos in the generic template that aren't <strong>1.91:1 </strong>will be scaled or cropped.</li>
                <li> Alternatively, you can use a combination of the image component and text component if you don't
                want any cropping/scaling on the image.</li>
              </ul>
            </ModalDialog>
          </ModalContainer>
        }
        <Popover placement='right-end' isOpen={this.state.openPopover} className='buttonPopoverList' target={'buttonTarget-' + this.props.id} toggle={this.handleToggle}>
          <PopoverHeader><strong>Edit List Element</strong></PopoverHeader>
          <PopoverBody>
            <div>
              This can be used to open a web page on the card click
              {
                !this.state.openWebsite && !this.state.openWebView &&
                <div>
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebsite}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a website</h7>
                  </div>
                  { (this.props.buttonActions.indexOf('open webview') > -1) &&
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebView}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a webview</h7>
                  </div>
                  }
                </div>
              }
              {
                this.state.openWebsite &&
                <div className='card'>
                  <h7 className='card-header'>Open Website <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebsite} /></h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    <input type='text' value={this.state.elementUrl} className='form-control' onChange={this.changeUrl} placeholder='Enter link...' />
                  </div>
                </div>
              }
              {
                this.state.openWebView &&
                <div className='card'>
                  <h7 className='card-header'>Open WebView <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebview} /></h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    <div>
                      <Link to='/settings' state={{tab: 'whitelistDomains'}} style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}>Whitelist url domains to open in-app browser</Link>
                    </div>
                    <label className='form-label col-form-label' style={{textAlign: 'left'}}>Url</label>
                    <input type='text' value={this.state.webviewurl} className='form-control' onChange={this.changeWebviewUrl} placeholder='Enter link...' />
                    <label className='form-label col-form-label' style={{textAlign: 'left'}}>WebView Size</label>
                    <select className='form-control m-input' value={this.state.webviewsize} onChange={this.onChangeWebviewSize}>
                      {
                        this.state.webviewsizes && this.state.webviewsizes.length > 0 && this.state.webviewsizes.map((size, i) => (
                          <option key={i} value={size} selected={size === this.state.webviewsize}>{size}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              }
              <hr style={{color: '#ccc'}} />
              <button onClick={this.handleDone} className='btn btn-primary btn-sm pull-right' disabled={(this.state.disabled)}> Done </button>
              {(this.state.defaultAction === '')
              ? <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
              : <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleRemove} className='btn pull-left'> Remove </button>
              }
              <br />
              <br />
            </div>
          </PopoverBody>
        </Popover>
        { this.props.singleCard && !this.state.loading &&
          <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.state.buttons.map((button) => button.payload)}) }} style={{float: 'right', height: 20 + 'px', margin: -15 + 'px'}}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i className='fa fa-times fa-stack-2x' />
            </span>
          </div>
        }
        <div style={{minHeight: 350, maxWidth: 400, marginBottom: '-0.5px'}} className='ui-block hoverbordersolid'>
          {
          this.state.loading
          ? <div className='align-center' style={{minHeight: 170, padding: '50px'}}><center><Halogen.RingLoader color='#FF5E3A' /></center></div>
          : <div style={{display: 'flex', minHeight: 135, backgroundColor: '#F2F3F8'}} className='cardimageblock' onClick={() => {
            this.refs.file.click()
          }}>
            <input
              ref='file'
              type='file'
              name='user[image]'
              multiple='true'
              accept='image/*'
              title=' '
              onChange={this._onChange} style={{position: 'absolute', cursor: 'pointer', display: 'none'}} />
            {
            (this.state.imgSrc === '')
            ? <img style={{maxHeight: 40, margin: 'auto'}} src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Text' />
            : <img onLoad={this.onImgLoad} style={{maxWidth: 235, maxHeight: 135, padding: 15}} src={this.state.imgSrc} />
           }
          </div>
          }
          <div>
            <input onChange={this.handleChange} value={this.state.title} className='form-control' style={{fontSize: '20px', fontWeight: 'bold', paddingTop: '5px', borderStyle: 'none'}} type='text' placeholder='Enter Title...' maxLength='80' />
            <textarea onChange={this.handleSubtitle} value={this.state.subtitle} className='form-control' style={{borderStyle: 'none', width: 100 + '%', height: 100 + '%'}} rows='5' placeholder='Enter subtitle...' maxLength='80' />
            {(this.state.elementUrl === '' && this.state.webviewurl === '')
              ? <a className='m-link' onClick={this.handleClick} id={'buttonTarget-' + this.props.id} ref={(b) => { this.target = b }} style={{color: '#716aca', cursor: 'pointer', width: '110px'}}>
                <i className='la la-plus' /> Add Action
                </a>
              : <a className='m-link' onClick={this.handleClick} id={'buttonTarget-' + this.props.id} ref={(b) => { this.target = b }} style={{cursor: 'pointer', width: '110px', fontWeight: 'bold'}}>
                Edit Action
                </a>
            }
          </div>
        </div>
        {(this.state.buttons) ? this.state.buttons.map((obj, index) => {
          return <EditButton index={index} pageId={this.props.pageId} buttonActions={this.props.buttonActions} replyWithMessage={this.props.replyWithMessage} button_id={(this.props.button_id !== null ? this.props.button_id + '-' + this.props.id : this.props.id) + '-' + index} data={{id: index, button: obj}} onEdit={this.editButton} onRemove={this.removeButton} isGalleryCard={this.props.isGalleryCard} />
        }) : ''}
        { this.state.buttons.length < 3 &&
          <Button buttonLimit={3} buttonActions={this.props.buttonActions} replyWithMessage={this.props.replyWithMessage} pageId={this.props.pageId} button_id={this.props.button_id !== null ? (this.props.button_id + '-' + this.props.id) : this.props.id} onAdd={this.addButton} styling={this.state.styling} isGalleryCard={this.props.isGalleryCard} />
        }
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
