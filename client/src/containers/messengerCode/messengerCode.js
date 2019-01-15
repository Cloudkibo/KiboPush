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
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Messenger Code`;
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
              <h3 className='m-subheader__title'>Facebook Messenger Code Generator</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Messenger Code? Here is the <a href='http://kibopush.com/messenger-codes' target='_blank'>documentation</a>.
              Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__body'>
                  <div className='form-row' style={{display: 'block'}}>
                    <div className='form-group m-form__group col-md-12 col-sm-12 col-lg-12' style={{display: 'flex'}}>
                      <div className='col-3'>
                        <label className='col-form-label'>Choose Page:
                        </label>
                      </div>
                      <div className='col-6'>
                        <select className='form-control' value={this.state.selectedPage._id} onChange={this.onPageChange}>
                          {
                            this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                              <option key={page._id} value={page._id} selected={page._id === this.state.selectedPage._id}>{page.pageName}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                    <br />
                    <div className='form-group m-form__group col-md-12 col-sm-12 col-lg-12' style={{display: 'flex'}}>
                      <div className='col-3'>
                        <label className='col-form-label'>Resolution (100 - 2000px):
                        </label>
                      </div>
                      <div className='col-6'>
                        <input type='number' min='100' max='2000' step='1' className='form-control' value={this.state.resoltion} onChange={this.onResolutionChange} />
                      </div>
                    </div>
                    <br />
                    <div className='form-group m-form__group col-md-12 col-sm-12 col-lg-12' style={{display: 'flex'}}>
                      <div className='col-3'>
                        <label className='col-form-label'>Ref-paramter (optional):
                        </label>
                      </div>
                      <div className='col-6'>
                        <input type='text' className='form-control' value={this.state.ref} onChange={this.onRefChange} />
                      </div>
                    </div>
                    <br />
                    {this.state.image !== '' &&
                      <div className='form-group m-form__group col-md-12 col-sm-12 col-lg-12' style={{display: 'flex'}}>
                        <div className='col-3' />
                        <div className='col-6'>
                          <img src={this.state.image} style={{display: 'block', width: '100%'}} />
                          <br />
                          <center>
                            <a href={this.state.image} target='_blank' download className='btn btn-outline-success' style={{borderColor: '#34bfa3'}}>
                              <i className='fa fa-download' />&nbsp;&nbsp;Download Image
                            </a>
                          </center>
                        </div>
                      </div>
                      }
                    <br />
                  </div>
                  <br /><br />
                  <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                    <div className='col-12'>
                      <div className='m-form__actions' style={{'float': 'right', marginTop: '20px'}}>
                        <button className='btn btn-primary' onClick={this.onSubmit}> Request Messenger Code
                        </button>
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
