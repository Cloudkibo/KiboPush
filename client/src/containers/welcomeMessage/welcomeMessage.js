/* eslint-disable no-useless-constructor */
import React from 'react'
import { Link, browserHistory } from 'react-router'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {isWelcomeMessageEnabled} from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
class WelcomeMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      surveysData: [],
      totalLength: 0,
      filterValue: ''
    }
    props.loadMyPagesList()
    this.onSurveyClick = this.onSurveyClick.bind(this)
    this.displayData = this.displayData.bind(this)
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.gotoEdit = this.gotoEdit.bind(this)
  }
  onSurveyClick (e, page) {
    console.log('Page Click', page)
  }
  showDropDown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps called')
    if (nextProps.pages) {
      // this.initializeSwitch(false)
    }
  }
  displayData (n, surveys) {
    console.log(surveys)
    this.setState({surveysData: surveys})
    console.log('surveysDatainside', this.state.surveysData)
  }
  onFilter (e) {
    console.log(e.target.value)
    this.setState({filterValue: e.target.value})
    var filtered = []
    if (e.target.value !== '') {
      for (let i = 0; i < this.props.surveys.length; i++) {
        if (e.target.value === 'all') {
          if (this.props.surveys[i].category.length > 1) {
            filtered.push(this.props.surveys[i])
          }
        } else {
          for (let j = 0; j < this.props.surveys[i].category.length; j++) {
            if (this.props.surveys[i].category[j] === e.target.value) {
              filtered.push(this.props.surveys[i])
            }
          }
        }
      }
    } else {
      filtered = this.props.surveys
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }
  gotoView () {
    this.props.history.push({
      pathname: `/surveys`
    })
  }
  initializeSwitch (state) {
    var self = this
    /* eslint-disable */
    $("[name='switch']").bootstrapSwitch({
      /* eslint-enable */
      onText: 'Enabled',
      offText: 'Disabled',
      offColor: 'danger',
      state: state
    })
    /* eslint-disable */
    $('input[name="switch"]').on('switchChange.bootstrapSwitch', function (event, state) {
      /* eslint-enable */
      console.log('event', event.target.attributes.id.nodeValue)
      console.log('state', state)
      if (state === true) {
        self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: true})
      } else {
        self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: false})
      }
    })
  }
  gotoCreate (page) {
    browserHistory.push({
      pathname: `/createconvo`,
      state: {module: 'welcome', _id: page}
    })
  }
  gotoEdit (page) {
    console.log('gotoEdit called', page)
    browserHistory.push({
      pathname: `/editTemplateBroadcast`,
      state: {module: 'welcome', _id: page._id, payload: page.welcomeMessage}
    })
  }
  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Welcome Message</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding Welcome Message? <a href='http://kibopush.com/welcomeMessage/' target='_blank'>Click Here </a>
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
                                      this.props.pages && this.props.pages.length > 0
                                    ? <div className='m-widget4' >
                                      {
                                       this.props.pages.map((page, i) => (
                                         <div className='m-widget4__item' key={i}>
                                           <div className='m-widget4__info'>
                                             <span className='m-widget4__title'>
                                               {page.pageName}
                                             </span>
                                             <br />
                                             <span className='m-widget4__sub'>
                                               <div className='bootstrap-switch-id-test bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate bootstrap-switch-on' style={{width: '130px'}}>
                                                 <div className='bootstrap-switch-container'>
                                                   <input data-switch='true' type='checkbox' name='switch' id={page._id} data-on-color='success' data-off-color='warning' aria-describedby='switch-error' aria-invalid='false' checked={this.state.buttonState} />
                                                 </div>
                                               </div>
                                               {this.initializeSwitch(page.isWelcomeMessageEnabled)}
                                             </span>
                                           </div>
                                           {page.welcomeMessage && page.welcomeMessage.length > 0
                                           ? <div><div className='m-widget4__ext'>
                                             <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                              View Message
                                            </button>
                                           </div>
                                           <div className='m-widget4__ext'>
                                             <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={() => this.gotoEdit(page)}>
                                             Edit Message
                                           </button>
                                           </div>
                                           <div className='m-widget4__ext'>
                                             <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                             Delete Message
                                           </button>
                                           </div>
                                         </div>
                                         : <div className='m-widget4__ext'>
                                           <button onClick={() => this.gotoCreate(page._id)} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                           Create Message
                                         </button>
                                         </div>
                                         }
                                         </div>
                                      ))}
                                    </div>
                                      : <div>No Data to display</div>
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
