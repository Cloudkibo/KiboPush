/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'
import EditButton from './EditButton'
import { uploadImage, uploadTemplate } from '../../redux/actions/convos.actions'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import { checkWhitelistedDomains } from '../../redux/actions/broadcast.actions'
import { isWebURL } from './../../utility/utils'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'
import { RingLoader } from 'halogenium'

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
    this.handleClose = this.handleClose.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
    this.removeImage = this.removeImage.bind(this)
    this.showWebView = this.showWebView.bind(this)
    this.showWebsite = this.showWebsite.bind(this)
    this.changeWebviewUrl = this.changeWebviewUrl.bind(this)
    this.onChangeWebviewSize = this.onChangeWebviewSize.bind(this)
    this.closeWebsite = this.closeWebsite.bind(this)
    this.closeWebview = this.closeWebview.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleWebView = this.handleWebView.bind(this)
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
      openPopover: false,
      elementUrl: '',
      disabled: true,
      checkbox: false,
      openWebView: false,
      openWebsite: false,
      webviewsize: 'FULL',
      webviewurl: '',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      defaultAction: ''
    }
  }
  onChangeWebviewSize (event) {
    if (event.target.value !== -1) {
      this.setState({webviewsize: event.target.value})
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
    if (this.state.checkbox) {
      this.props.topElementStyle('LARGE')
    } else {
      this.props.topElementStyle('compact')
    }
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
    if (this.state.checkbox) {
      this.props.topElementStyle('LARGE')
    } else {
      this.props.topElementStyle('compact')
    }
  }
  changeWebviewUrl (e) {
    if (isWebURL(this.state.webviewurl)) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({webviewurl: e.target.value, elementUrl: ''})
  }
  handleCheckbox (e) {
    this.setState({checkbox: !this.state.checkbox})
    console.log('value', e.target.value)
    if (e.target.value) {
      this.setState({disabled: false})
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
      buttons: this.state.buttons,
      default_action: this.state.defaultAction
    })
    if (e.target.value) {
      this.props.topElementStyle('LARGE')
    } else {
      this.props.topElementStyle('compact')
    }
  }
  changeUrl (event) {
    console.log('event', event.target.value)
    if (isWebURL(event.target.value)) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({elementUrl: event.target.value, webviewurl: '', webviewsize: 'FULL'})
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
        if (this.state.checkbox) {
          this.props.topElementStyle('LARGE')
        } else {
          this.props.topElementStyle('compact')
        }
      } else {
        this.msg.error('The given domain is not whitelisted. Please add it to whitelisted domains.')
        this.setState({webviewurl: '', webviewsize: 'FULL'})
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
      if (this.state.checkbox) {
        this.props.topElementStyle('LARGE')
      } else {
        this.props.topElementStyle('compact')
      }
    }
    if (this.state.openWebView === false) {
      this.setState({
        openPopover: false
      })
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
  handleClose () {
    this.setState({openPopover: false})
  }
  handleRemove (e) {
    this.setState({openPopover: false, elementUrl: '', webviewurl: '', webviewsize: 'FULL', openWebsite: false, openWebView: false, checkbox: false, defaultAction: ''})
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
    this.setState({
      openPopover: false
    })
    if (this.state.checkbox) {
      this.props.topElementStyle('LARGE')
    } else {
      this.props.topElementStyle('compact')
    }
  }
  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
  }
  showWebView () {
    this.setState({openWebView: true})
  }
  showWebsite () {
    this.setState({openWebsite: true})
  }
  componentDidMount () {
    console.log('this.props', this.props)
    this.updateCardDetails(this.props)
    if (this.props.cardDetails) {
      this.setState({default_action: this.props.cardDetails.default_action})
      if (this.props.pages) {
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
    }
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.updateCardDetails(nextProps)
  }
  updateCardDetails (cardProps) {
    console.log('cardProps.cardDetails', cardProps.cardDetails)
    if (cardProps.cardDetails && cardProps.cardDetails !== '') {
      if (cardProps.cardDetails.default_action !== '' && cardProps.cardDetails.default_action !== undefined) {
        if (cardProps.cardDetails.default_action.type === 'web_url' && cardProps.cardDetails.default_action.messenger_extensions === undefined) {
          this.setState({elementUrl: cardProps.cardDetails.default_action.url})
        } else {
          this.setState({webviewurl: cardProps.cardDetails.default_action.url, webviewsize: cardProps.cardDetails.default_action.webview_height_ratio})
        }
      }
      this.setState({
        //  id: cardProps.id,
        componentType: 'card',
        title: cardProps.cardDetails.title,
        imgSrc: cardProps.cardDetails.image_url,
        buttons: cardProps.cardDetails.buttons,
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
      if (cardProps.id === 1 && cardProps.topStyle && cardProps.topStyle === 'LARGE') {
        this.setState({ checkbox: true })
      }
    }
  }
  removeImage (event) {
    console.log('remove image')
    event.stopPropagation()
    this.setState({imgSrc: ''})
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: '',
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.buttons,
      default_action: this.state.defaultAction
    })
  }
  _onChange (event) {
  // Assuming only image
    event.stopPropagation()
    console.log('+onChange')
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
      console.log('id:', this.props.id)
      console.log('this.props.pages', this.props.pages)
      this.props.uploadImage(file, this.props.pages, 'image', {fileurl: '',
        fileName: file.name,
        type: file.type,
        image_url: '',
        size: file.size}, this.updateImageUrl, this.setLoading)
      // this.props.uploadImage(file, {fileurl: '',
      //   fileName: file.name,
      //   type: file.type,
      //   image_url: '',
      //   size: file.size}, this.updateImageUrl, this.setLoading)szerxcdtfvygbuhnijmk,l;.'scvbtyumiop[]'
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
      buttons: this.state.buttons,
      default_action: this.state.defaultAction
    })
    // this.setState({buttons: temp}, () => {
    //   this.props.handleCard({id: this.props.id,
    //     componentType: 'card',
    //     fileurl: this.state.fileurl,
    //     image_url: this.state.image_url,
    //     fileName: this.state.fileName,
    //     type: this.state.type,
    //     size: this.state.size,
    //     title: this.state.title,
    //     description: this.state.subtitle,
    //     buttons: this.state.buttons,
    //     default_action: this.state.defaultAction
    //   })
    // })
  }

  editButton (obj) {
    var temp = this.state.buttons.map((elm, index) => {
      if (index === obj.id) {
        elm = obj.button
      }
      return elm
    })
    this.setState({buttons: temp}, () => {
      console.log('In edit temp the value of temp is', temp)
      console.log('In edit button the value of button is', this.state.buttons)
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
    })
  }
  removeButton (obj) {
    var temp = this.state.buttons.filter((elm, index) => { return index !== obj.id })
    console.log('temp in removeButton', temp)
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
      fileurl: data.fileurll,
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
      <div style={{minHeight: 250, maxWidth: 400, marginBottom: '-7px', backgroundImage: this.state.checkbox && this.state.imgSrc === '' ? 'url(http://cdn.cloudkibo.com/public/icons/list.jpg)' : this.state.checkbox && this.state.imgSrc ? 'url(' + this.state.imgSrc + ')' : '', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: this.state.checkbox ? '350px' : ''}} className='ui-block hoverbordersolid'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Popover placement='right-end' isOpen={this.state.openPopover} className='buttonPopoverList' target={'buttonTarget-' + this.props.id} toggle={this.handleToggle}>
          <PopoverHeader><strong>Edit List Element</strong></PopoverHeader>
          <PopoverBody>
            <div>
              <br />
              {this.props.cardDetails && this.props.id === 0
                ? <div>
                  <span>
                    <input type='checkbox' value={!this.state.checkbox} onChange={this.handleCheckbox} checked={this.state.checkbox} />&nbsp;&nbsp;
                    Make first item large
                  </span>
                  <br /><br />
                </div>
                : (!this.props.cardDetails && this.props.id === 1) &&
                  <div>
                    <span>
                      <input type='checkbox' value={!this.state.checkbox} onChange={this.handleCheckbox} checked={this.state.checkbox} />&nbsp;&nbsp;
                      Make first item large
                    </span>
                    <br /><br />
                  </div>
                }
              This can be used to open a web page on a list item click
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
                    <label className='form-label col-form-label' style={{textAlign: 'left'}}>WebView Sizes</label>
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
        <div onClick={() => { this.props.removeElement({id: this.props.id}) }} style={{marginLeft: '-15px', marginTop: '-23px', float: 'left'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times-circle-o' style={{fontSize: '1.3rem'}} />
          </span>
        </div>
        {this.state.checkbox &&
        <center>
          <div style={{display: 'flex', backgroundColor: '#F2F3F8', height: '60px'}} className='cardimageblock col-md-4'>
            <input
              ref='file'
              type='file'
              name='user[image]'
              multiple='true'
              accept='image/*'
              title=' '
              onChange={this._onChange} style={{position: 'absolute', opacity: 0, maxWidth: 370, minHeight: 170, zIndex: 5, cursor: 'pointer'}} />
            <img style={{maxHeight: 40, margin: 'auto'}} src='http://cdn.cloudkibo.com/public/icons/picture.png' alt='Text' />
          </div>
          <br />
        </center>
         }
        <div className='row'>
          <div className={this.state.checkbox ? 'col-md-12' : 'col-md-8'} style={{marginLeft: this.state.checkbox ? '' : '-20px'}}>
            <center>
              <input onChange={this.handleChange} value={this.state.title} className='form-control' style={{fontWeight: 'bold', paddingTop: '5px', borderStyle: 'none', width: this.state.checkbox ? '90%' : ''}} type='text' placeholder='Enter Title...' maxLength='80' />
              <br />
              <textarea onChange={this.handleSubtitle} value={this.state.subtitle} className='form-control' style={{borderStyle: 'none', height: '90px', width: this.state.checkbox ? '90%' : '100%'}} rows='5' placeholder='Enter subtitle...' maxLength='80' />
            </center>
          </div>

          {!this.state.checkbox &&

            <div style={{ display: 'inline-grid', backgroundColor: '#F2F3F8' }} className='cardimageblock col-md-4'>
              {
                (this.state.loading)
                  ? <span style={{marginTop: '50px', marginLeft: '16px'}}><RingLoader color='#FF5E3A' /></span>
                  : <input
                    ref='file'
                    type='file'
                    name='user[image]'
                    multiple='true'
                    accept='image/*'
                    title=' '
                    onChange={this._onChange} style={{ position: 'absolute', opacity: 0, maxWidth: 370, minHeight: 170, zIndex: 5, cursor: 'pointer', width: '80%', marginLeft: '-10px' }} />
              }
            {
            (this.state.imgSrc === '' && !this.state.loading)
            ? <img style={{maxHeight: '40px', margin: 'auto'}} src='http://cdn.cloudkibo.com/public/icons/picture.png' alt='Text' />
          : (!this.state.loading) && <img alt='' style={{maxHeight: '140px', maxWidth: '85px', marginLeft: '-11px', marginTop: '3px', height: '140px'}} src={this.state.imgSrc} />
           }
          </div>
          }
          {this.state.imgSrc !== '' && !this.state.checkbox &&
            <div className='col-md-2' style={{display: 'contents'}} >
              <i className='fa fa-times-circle-o' style={{fontSize: '1rem', position: 'relative', marginLeft: '7px'}} onClick={this.removeImage} />
            </div>
          }
        </div>
        <br />
        <div className='row'>
          <div className='col-md-6'>
            {(!this.state.buttons || !this.state.buttons.length > 0) &&
              <Button replyWithMessage={this.props.replyWithMessage} buttonLimit={1} pageId={this.props.pageId} buttonActions={this.props.buttonActions} button_id={this.props.button_id !== null ? (this.props.button_id + '-' + this.props.id) : this.props.id} onAdd={this.addButton} styling={{width: '120%', marginLeft: this.state.checkbox ? '15px' : '12px'}} />
            }
            {(this.state.buttons) ? this.state.buttons.map((obj, index) => {
              return (<div style={{width: '120%', marginTop: '10px', marginLeft: this.state.checkbox ? '15px' : '12px'}}>
                <EditButton
                  index={index}
                  pageId={this.props.pageId}
                  buttonActions={this.props.buttonActions}
                  button_id={(this.props.button_id !== null ? this.props.button_id + '-' + this.props.id : this.props.id) + '-' + index}
                  data={{id: index, button: obj}}
                  onEdit={this.editButton}
                  onRemove={this.removeButton}
                  replyWithMessage={this.props.replyWithMessage}
                />
              </div>)
            }) : ''}
          </div>
          <div className='col-md-6' style={{marginTop: '15px'}}>
            {(this.state.elementUrl === '' && this.state.webviewurl === '') && !this.state.checkbox
              ? <a href='#/' className='m-link' onClick={this.handleClick} id={'buttonTarget-' + this.props.id} ref={(b) => { this.target = b }} style={{color: '#716aca', cursor: 'pointer', width: '110px'}}>
                <i className='la la-plus' /> Add Action
                </a>
              : <a href='#/' className='m-link' onClick={this.handleClick} id={'buttonTarget-' + this.props.id} ref={(b) => { this.target = b }} style={{cursor: 'pointer', width: '110px', fontWeight: 'bold'}}>
                Edit Action
                </a>
              }
          </div>
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
