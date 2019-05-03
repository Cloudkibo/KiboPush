/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadImage, uploadTemplate } from '../../../redux/actions/convos.actions'
import { checkWhitelistedDomains } from '../../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import { isWebURL } from './../../../utility/utils'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import CardModal from '../CardModal'

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
    this.edit = this.edit.bind(this)
    this.closeEdit = this.closeEdit.bind(this)
    this.state = {
      editing: false,
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

  openCardModal () {
    console.log('opening CardModal for edit', this.state)
    return (<CardModal edit
      id={this.props.id}
      buttons={this.state.buttons}
      title={this.state.title}
      subtitile={this.state.subtitle}
      imgSrc={this.state.imgSrc}
      replyWithMessage={this.props.replyWithMessage}
      pageId={this.props.pageId}
      closeModal={this.closeEdit}
      addComponent={this.props.addComponent}
      hideUserOptions={this.props.hideUserOptions} />)
  }

  closeEdit () {
    console.log('closeEdit Card')
    this.setState({editing: false})
  }

  edit () {
    this.setState({editing: true})
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
        {
          this.state.editing && this.openCardModal()
        }
        {
          <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.state.buttons.map((button) => button.payload)}) }} style={{float: 'right', height: 20 + 'px', margin: -15 + 'px'}}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i className='fa fa-times fa-stack-2x' />
            </span>
          </div>
        }
        <div onClick={this.edit} className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '175px', maxWidth: '225px', margin: 'auto', cursor: 'pointer'}} >
          {
            this.state.imgSrc &&
            <img src={this.state.imgSrc} style={{minHeight: '130px', maxWidth: '250px', padding: '25px', margin: '-25px'}} />
          }
          <hr style={{marginTop: this.state.imgSrc ? '' : '100px', marginBottom: '5px'}} />
          <h6 style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{this.state.title}</h6>
          <p style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '13px'}}>{this.state.subtitle}</p>
          {
            this.state.buttons.map(button => {
              return (
                <div>
                  <hr />
                  <h5 style={{color: '#0782FF'}}>{button.type === 'element_share' ? 'Share' : button.title}</h5>
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
