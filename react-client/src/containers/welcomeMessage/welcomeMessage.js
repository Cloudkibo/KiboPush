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
import YouTube from 'react-youtube'

class WelcomeMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      surveysData: [],
      totalLength: 0,
      filterValue: '',
      isShowingModal: false,
      isShowingZeroPageModal: props.pages && props.pages.length === 0
    }
    props.loadMyPagesList()
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.gotoEdit = this.gotoEdit.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.closeZeroSubDialog = this.closeZeroSubDialog.bind(this)
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
  initializeSwitch (state, id) {
    var self = this
    var temp = '#' + id
    /* eslint-disable */
    $(temp).bootstrapSwitch({
      /* eslint-enable */
      onText: 'Yes',
      offText: 'No',
      offColor: 'danger',
      state: state
    })
    /* eslint-disable */
    $(temp).on('switchChange.bootstrapSwitch', function (event, state) {
      if (state === true) {
        self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: true})
      } else {
        self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: false})
      }
    })
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

  componentWillReceiveProps(nextProps) {
    if (((nextProps.subscribers && nextProps.subscribers.length === 0) ||
    (nextProps.pages && nextProps.pages.length === 0))
  ) {
    this.refs.zeroModal.click()
  }
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Welcome Messages Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
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
              </div>
            </div>
          </div>
        <a href='#' style={{ display: 'none' }} ref='zeroModal' data-toggle="modal" data-target="#zeroModal">ZeroModal</a>
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
              Need help in understanding Welcome Message? <a href='http://kibopush.com/welcome-message/' target='_blank'>Click Here </a>
              Or Check out this <a href='#' data-toggle="modal" data-target="#video" onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a> to understand this feature.
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
                                           <div className='bootstrap-switch-id-test bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate bootstrap-switch-on'>
                                             <div className='bootstrap-switch-container'>
                                               <input data-switch='true' type='checkbox' name='switch' id={page._id} data-on-color='success' data-off-color='warning' aria-describedby='switch-error' aria-invalid='false' checked={this.state.buttonState} />
                                             </div>
                                           </div>
                                           {this.initializeSwitch(page.isWelcomeMessageEnabled, page._id)}
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
