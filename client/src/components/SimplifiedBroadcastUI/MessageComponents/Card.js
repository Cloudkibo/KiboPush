/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadImage, uploadTemplate } from '../../../redux/actions/convos.actions'
import { checkWhitelistedDomains } from '../../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import CardModal from '../CardModal'

class Card extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.updateCardDetails = this.updateCardDetails.bind(this)
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
      fileurl: props.file ? props.file.fileurl : '',
      fileName: props.file ? props.file.fileName : '',
      type: props.file ? props.file.type : '',
      size: props.file ? props.file.size : '',
      image_url: props.file ? props.file.image_url : '',
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

  openCardModal () {
    console.log('opening CardModal for edit', this.state)
    return (<CardModal edit
      file={this.props.file}
      webviewsize={this.state.webviewsize}
      webviewurl={this.state.webviewurl}
      elementUrl={this.props.elementUrl}
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
        <div className='broadcast-component' style={{marginBottom: '70px'}}>
          {
            <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: this.state.buttons.map((button) => button.payload)}) }} style={{float: 'right', height: 20 + 'px', marginTop: '-20px'}}>
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
