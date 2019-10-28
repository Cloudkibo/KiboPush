/* eslint-disable no-useless-constructor */
import React from 'react'
import { browserHistory } from 'react-router'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {isWelcomeMessageEnabled} from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertMessage from '../../components/alertMessages/alertMessage'
import AlertMessageModal from '../../components/alertMessages/alertMessageModal'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import YouTube from 'react-youtube'

class WelcomeMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      surveysData: [],
      totalLength: 0,
      filterValue: '',
      showVideo: false,
      isShowingModal: false,
      isShowingZeroPageModal: props.pages && props.pages.length === 0
    }
    props.loadMyPagesList()
    this.gotoCreate = this.gotoCreate.bind(this)
    this.gotoEdit = this.gotoEdit.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.closeZeroSubDialog = this.closeZeroSubDialog.bind(this)
    this.handleEnableWelMessage = this.handleEnableWelMessage.bind(this)
  }
  handleEnableWelMessage (pageId, enable) {
    if (enable === true) {
      this.props.isWelcomeMessageEnabled({_id: pageId, isWelcomeMessageEnabled: true})
    } else {
      this.props.isWelcomeMessageEnabled({_id: pageId, isWelcomeMessageEnabled: false})
    }
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Welcome Message`
  }

  closeZeroSubDialog () {
    this.setState({isShowingZeroSubModal: false, isShowingZeroPageModal: false})
  }

  gotoCreate (page) {
    browserHistory.push({
      pathname: `/createBroadcast`,
      state: {module: 'welcome', _id: page}
    })
  }

  gotoEdit (page) {
    //var default_action= page.welcomeMessage[0].default_action
    //page.welcomeMessage[0].default_action=default_action
  //  console.log('pagein edit', default_action)
   console.log( 'page.welcomeMessage',  page.welcomeMessage)
     browserHistory.push({
       pathname: `/editWelcomeMessage`,
       state: {module: 'welcome', pages: [page._id], payload: page.welcomeMessage}
     })
  }

  gotoView (page) {
    console.log('page.welcomeMessage',page)
    browserHistory.push({
      pathname: `/viewWelcomeMessage`,
      state: {module: 'welcome', _id: page._id, payload: page}
    })
  }

  render () {
    console.log('this.props.pages',this.props.pages)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Welcome Message</h3>
            </div>
          </div>
        </div>
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px', top: 100}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='7AEdAMXW6gE'
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
          (this.state.isShowingZeroPageModal) &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeZeroSubDialog}>
            <ModalDialog style={{width: '700px', top: '75px'}}
              onClose={this.closeZeroSubDialog}>
              <AlertMessageModal type='page' />
              <div>
                <YouTube
                  videoId='9kY3Fmj_tbM'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: {
                      autoplay: 0
                    }
                  }}
                />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-content'>
          {
            this.props.pages && this.props.pages.length === 0 &&
              <AlertMessage type='page' />
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Welcome Message? <a href='http://kibopush.com/welcome-message/' target='_blank'>Click Here </a>
              Or Check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a> to understand this feature.
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12 col-md-12 col-sm-12'>
              <div className='m-portlet m-portlet--full-height '>
                <div className='m-portlet__body'>
                  <div className='tab-content'>
                    <div className='tab-pane active m-scrollable' role='tabpanel'>
                      <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                        <div style={{height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                          <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                            <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >

                              <div className='tab-pane active' id='m_widget4_tab1_content'>
                                {
                                  this.props.pages && this.props.pages.length > 0 &&
                                  <div className='m-widget4' >
                                  {
                                   this.props.pages.map((page, i) => (
                                     <div className='m-widget4__item' key={i}>
                                       <div className='m-widget4__img m-widget4__img--pic'>
                                         <img alt='pic' src={(page.pagePic) ? page.pagePic : ''} />
                                       </div>
                                       <div className='m-widget4__info'>
                                         <span className='m-widget4__title'>
                                           {page.pageName}
                                         </span>
                                         <br />
                                         <span className='m-widget4__sub'>
                                         {(page.isWelcomeMessageEnabled) &&

                                            <a className='m-widget4__icon'>
                                              <button onClick={() => {this.handleEnableWelMessage(page._id, !page.isWelcomeMessageEnabled)}} type='button' className='btn m-btn--pill btn-success btn-sm m-btn m-btn--custom'>Enabled</button>
                                            </a>
                                          }
                                          {(!page.isWelcomeMessageEnabled) &&

                                            <a className='m-widget4__icon'>
                                              <button type='button' onClick={() => { this.handleEnableWelMessage(page._id, !page.isWelcomeMessageEnabled)}} className='btn m-btn--pill btn-danger btn-sm m-btn m-btn--custom'>Disabled</button>
                                            </a>

                                          }
                                         </span>
                                       </div>
                                       <div className='m-widget4__ext'>
                                         <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={() => this.gotoView(page)}>
                                          View Message
                                        </button>
                                       </div>
                                       <div className='m-widget4__ext'>
                                         <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={() => {
                                           console.log('page before edit', page)
                                           this.gotoEdit(page)
                                         }}>
                                         Edit Message
                                       </button>
                                       </div>
                                     </div>
                                  ))}
                                </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
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
  return {
    pages: (state.pagesInfo.pages)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    isWelcomeMessageEnabled: isWelcomeMessageEnabled
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WelcomeMessage)
