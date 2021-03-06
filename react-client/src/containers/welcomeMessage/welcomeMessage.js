/* eslint-disable no-useless-constructor */
import React from 'react'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {isWelcomeMessageEnabled} from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertMessage from '../../components/alertMessages/alertMessage'
import AlertMessageModal from '../../components/alertMessages/alertMessageModal'
import YouTube from 'react-youtube'
import AlertContainer from 'react-alert'

class WelcomeMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      surveysData: [],
      totalLength: 0,
      filterValue: '',
      isShowingModal: false,
      isShowingZeroPageModal: props.pages && props.pages.length === 0,
      openVideo: false
    }
    props.loadMyPagesList()
    this.gotoCreate = this.gotoCreate.bind(this)
    this.gotoEdit = this.gotoEdit.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.closeZeroSubDialog = this.closeZeroSubDialog.bind(this)
    this.handleEnableWelMessage = this.handleEnableWelMessage.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoWelcomeMessage.click()
  }
  handleEnableWelMessage (pageId, enable) {
    if (enable === true) {
      this.props.isWelcomeMessageEnabled({_id: pageId, isWelcomeMessageEnabled: true}, (res) => {
        if (res.status !== 'success') {
          let msg = res.description
          this.msg.error(msg)
        }
      })
    } else {
      this.props.isWelcomeMessageEnabled({_id: pageId, isWelcomeMessageEnabled: false}, (res) => {
        if (res.status !== 'success') {
          let msg = res.description
          this.msg.error(msg)
        }
      })
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
    this.props.history.push({
      pathname: `/createBroadcast`,
      state: {module: 'welcome', _id: page}
    })
  }

  gotoEdit (page) {
    //var default_action= page.welcomeMessage[0].default_action
    //page.welcomeMessage[0].default_action=default_action
  //  console.log('pagein edit', default_action)
   console.log( 'page.welcomeMessage',  page.welcomeMessage)
     this.props.history.push({
       pathname: `/editWelcomeMessage`,
       state: {module: 'welcome', pages: [page._id], payload: page.welcomeMessage}
     })
  }

  gotoView (page) {
    console.log('page.welcomeMessage',page)
    this.props.history.push({
      pathname: `/viewWelcomeMessage`,
      state: {module: 'welcome', _id: page._id, payload: page}
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (((nextProps.subscribers && nextProps.subscribers.length === 0) ||
    (nextProps.pages && nextProps.pages.length === 0))
  ) {
    this.refs.zeroModal.click()
  }
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Welcome Message</h3>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='videoWelcomeMessage' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoWelcomeMessage">videoWelcomeMessage</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoWelcomeMessage" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Welcome Messages Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({
                      openVideo: false
                    })}}>
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                {this.state.openVideo && <YouTube
                  videoId='7AEdAMXW6gE'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
                }
                </div>
              </div>
            </div>
          </div>
        <a href='#/' style={{ display: 'none' }} ref='zeroModal' data-toggle="modal" data-target="#zeroModal">ZeroModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="zeroModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                {(this.props.pages && this.props.pages.length === 0)
                  ? <AlertMessageModal type='page' />
                  : <AlertMessageModal type='subscriber' />
                }
                <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
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
              </div>
            </div>
          </div>
        </div>
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
              Need help in understanding Welcome Message? <a href='https://kibopush.com/welcome-message/' target='_blank' rel='noopener noreferrer'>Click Here </a>
              Or Check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a> to understand this feature.
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
                                       <div className='m-widget4__info' style = {{paddingTop:'26px'}}>
                                         <span className='m-widget4__title'>
                                           {page.pageName}
                                         </span>
                                         <br />
                                         <span className='m-widget4__sub'>
                                           <div className= 'm-form__group form-group row'>
                                             { page.isWelcomeMessageEnabled
                                              ? <label className='col-1 col-form-label' style={{color: '#34bfa3', marginTop: '5px'}}>
                                               Enabled
                                               </label>
                                              :<label className='col-1 col-form-label' style={{marginTop: '5px'}}>
                                                Disabled
                                              </label>
                                             }
                                            <div className='col-3' style={{marginLeft: '15px'}}>
                                              <span className={'m-switch m-switch--outline m-switch--icon m-switch--success'}>
                                                <label>
                                                  <input type='checkbox' data-switch='true' checked={page.isWelcomeMessageEnabled} onChange={() => { this.handleEnableWelMessage(page._id, !page.isWelcomeMessageEnabled)}} />
                                                  <span></span>
                                                </label>
                                              </span>
                                            </div>
                                          </div>
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
