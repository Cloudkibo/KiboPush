/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesListNew } from '../../redux/actions/pages.actions'
import { requestMessengerCode, resetState } from '../../redux/actions/messengerCode.actions'
import { Link, browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class MessengerCode extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingCreate: false,
      pageSelected: {}
    }
    props.loadMyPagesListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: ''}})
    this.showCreateDialog = this.showCreateDialog.bind(this)
    this.closeCreateDialog = this.closeCreateDialog.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.changePage = this.changePage.bind(this)
  
  }

  showCreateDialog () {
    this.setState({isShowingCreate: true})
  }
  closeCreateDialog () {
    this.setState({isShowingCreate: false})
  }

  changePage (e) {
    this.setState({pageSelected: e.target.value})
  }

  gotoCreate () {
    this.props.resetState()
    console.log(this.state.pageSelected)
    console.log(this.props.pages)
    let pageId = this.props.pages.filter((page) => page._id === this.state.pageSelected._id)[0].pageId
    console.log('pageId', pageId)
    browserHistory.push({
      pathname: `/createMessengerCode`,
      state: {_id: this.state.pageSelected, pageId: pageId, module: 'createMessage'}
    })
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

  componentWillReceiveProps (nextProps) {
    console.log('nextProps in pages', nextProps)
    if (nextProps.pages) {
      this.setState({
        pageSelected: nextProps.pages[0]
      })
    }
    if (nextProps.image) {
      this.setState({image: nextProps.image})
    }
  }

  render () {
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
        {
          this.state.isShowingCreate &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeCreateDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeCreateDialog}>
              <h3>Create Messenger Code</h3>
              <div className='m-form'>
                <div className='form-group m-form__group'>
                  <label className='control-label'>Select Page:&nbsp;&nbsp;&nbsp;</label>
                  <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.pageSelected} onChange={this.changePage}>
                    {
                      this.props.pages.map((page, i) => (
                        <option key={i} value={page._id}>{page.pageName}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px', float: 'right'}}>
                  <button className='btn btn-primary' onClick={() => this.gotoCreate()}>
                    Create
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
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
              <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Messenger Codes
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <Link onClick={this.showCreateDialog} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                      <span>
                        <i className='la la-plus' />
                        <span>
                          Create New
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
                <div className='m-portlet__body'>    
              
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
    resetState: resetState,
    requestMessengerCode: requestMessengerCode
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessengerCode)
