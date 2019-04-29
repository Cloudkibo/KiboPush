/* eslint-disable no-useless-constructor */
import React from 'react'
import { browserHistory, Link } from 'react-router'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {isWelcomeMessageEnabled} from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import YouTube from 'react-youtube'
import AlertMessage from '../../components/alertMessages/alertMessage'

class WelcomeMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      surveysData: [],
      totalLength: 0,
      filterValue: '',
      showVideo: false
    }
    props.loadMyPagesList()
    this.switchInitialized = false
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.gotoEdit = this.gotoEdit.bind(this)
    this.gotoView = this.gotoView.bind(this)
  }
  componentDidMount () {
    console.log('welcomeMessage componentDidMount')
    if (this.props.pages) {
      for (var i = 0; i < this.props.pages.length; i++) {
        this.initializeSwitch(this.props.pages[i].isWelcomeMessageEnabled, this.props.pages[i]._id)
      }
    }
  }
  initializeSwitch (state, id) {
    if (!this.switchInitialized) {
      var self = this
      var temp = '#' + id
      /* eslint-disable */
      $(temp).bootstrapSwitch({
        /* eslint-enable */
        onText: 'Enabled',
        offText: 'Disabled',
        offColor: 'danger',
        state: state
      })
      /* eslint-disable */
      $(temp).on('switchChange.bootstrapSwitch', function (event) {
        /* eslint-enable */
        var state = event.target.checked
        if (state === true) {
          self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: true})
        } else {
          self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: false})
        }
      })
    }
  }

  gotoCreate (page) {
    browserHistory.push({
      pathname: `/createBroadcast`,
      state: {module: 'welcome', _id: page}
    })
  }

  gotoEdit (page) {
    browserHistory.push({
      pathname: `/editWelcomeMessage`,
      state: {module: 'welcome', pages: [page._id], payload: page.welcomeMessage}
    })
  }

  gotoView (page) {
    browserHistory.push({
      pathname: `/viewWelcomeMessage`,
      state: {module: 'welcome', _id: page._id, payload: page}
    })
  }

  render () {
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px', top: 100}}
            onClose={() => { this.setState({showVideo: false }) }}>
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
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Welcome Message
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
              <div className='form-group m-form__group'>
                <div style={{textAlign: 'center'}} className='alert m-alert m-alert--default' role='alert'>
                  Need help in understanding Welcome Message? <a href='http://kibopush.com/welcome-message/' target='_blank'>Click Here </a>
                  Or Check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a> to understand this feature.
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div>
                    <div className='m-portlet__body'>
                      <div className='tab-content'>
                        <div className='tab-pane active m-scrollable' role='tabpanel'>
                          <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                            <div style={{height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                              <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                                <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >

                                  <div className='tab-pane active' id='m_widget4_tab1_content'>
                                    {
                                      this.props.pages && this.props.pages.length > 0
                                    ? <div className='m-widget4' >
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
                                               <div className='bootstrap-switch-id-test bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate bootstrap-switch-on' style={{width: '130px'}}>
                                                 <div className='bootstrap-switch-container'>
                                                   <input data-switch='true' type='checkbox' id={page._id} data-on-color='success' data-off-color='warning' aria-describedby='switch-error' aria-invalid='false' checked={page.isWelcomeMessageEnabled} />
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
                                             <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={() => this.gotoEdit(page)}>
                                             Edit Message
                                           </button>
                                           </div>
                                         </div>
                                      ))}
                                    </div>
                                      : <AlertMessage type='page' />
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
