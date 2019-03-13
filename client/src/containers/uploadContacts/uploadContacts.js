/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesListNew } from '../../redux/actions/pages.actions'
import { requestMessengerCode } from '../../redux/actions/messengerCode.actions'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Files from 'react-files'

class MessengerCode extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedPage: {},
      ref: '',
      resoltion: '1000',
      image: '',
      showVideo: false
    }
    props.loadMyPagesListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: ''}})

    this.onPageChange = this.onPageChange.bind(this)
    this.onResolutionChange = this.onResolutionChange.bind(this)
    this.onRefChange = this.onRefChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Upload Contacts`
  }

  onPageChange (event) {
    console.log('event', event.target.value)
    if (event.target.value !== -1) {
      let page
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i]._id === event.target.value) {
          page = this.props.pages[i]
          break
        }
      }
      if (page) {
        this.setState({
          selectedPage: page
        })
      }
    } else {
      this.setState({
        selectedPage: {}
      })
    }
  }

  onResolutionChange (event) {
    this.setState({resoltion: event.target.value})
  }

  onRefChange (event) {
    this.setState({ref: event.target.value})
  }

  onSubmit (event) {
    if (parseInt(this.state.resoltion) < 100 || parseInt(this.state.resoltion) > 2000) {
      this.msg.error('Resolution must be between 100 to 2000 px')
      return
    }
    if (this.state.ref !== '') {
      this.props.requestMessengerCode({
        pageId: this.state.selectedPage.pageId,
        image_size: parseInt(this.state.resoltion),
        data: {ref: this.state.ref}
      })
    } else {
      this.props.requestMessengerCode({pageId: this.state.selectedPage.pageId, image_size: parseInt(this.state.resoltion)})
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextProps in pages', nextProps)
    console.log('nextProps in image', nextProps.image)
    if (nextProps.pages) {
      this.setState({
        selectedPage: nextProps.pages[0]
      })
    }
    if (nextProps.image) {
      this.setState({image: nextProps.image})
    }
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px', top: 100}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='xpVyOxXvZPE'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Upload Contacts</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__body'>
                  <div className='form-group m-form__group row'>
                    <label className='col-2 col-form-label' />
                    <div className='col-lg-6 col-md-9 col-sm-12'>
                      <div className='m-dropzone dropzone dz-clickable'
                        id='m-dropzone-one'>
                        <button style={{cursor: 'pointer'}} onClick={() => this.enterPhoneNoManually()} className='btn m-btn--pill btn-success'>Enter phone numbers manually</button>
                        <h4 style={{marginTop: '20px', marginBottom: '15px'}}>OR</h4>
                        <Files
                          className='file-upload-area'
                          onChange={this.onFilesChange}
                          onError={this.onFilesError}
                          accepts={[
                            'text/comma-separated-values',
                            'text/csv',
                            'application/csv',
                            '.csv',
                            'application/vnd.ms-excel']}
                          multiple={false}
                          maxFileSize={25000000}
                          minFileSize={0}
                          clickable>
                          <button style={{cursor: 'pointer'}} className='btn m-btn--pill btn-success'>Upload CSV File</button>
                        </Files>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages),
    image: (state.messengerCodeInfo.image)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesListNew: loadMyPagesListNew,
    requestMessengerCode: requestMessengerCode
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessengerCode)
