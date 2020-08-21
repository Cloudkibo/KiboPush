import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAnalytics, fetchChatbots } from '../../redux/actions/chatbotAutomation.actions'
import BACKBUTTON from '../../components/extras/backButton'
import LIFETIMESTATISTICS from '../../components/chatbotAutomation/lifeTimeStatistics'
import PERIODICSTATISTICS from '../../components/chatbotAutomation/periodicStatistics'

class Analytics extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      chatbot: '',
      periodicAnalytics: '',
      days: '30'
    }
    this.handleChatbots = this.handleChatbots.bind(this)
    this.handleAnalytics = this.handleAnalytics.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.onBack = this.onBack.bind(this)
  }

  onDaysChange (e) {
    var value = e.target.value
    this.setState({days: value})
    if (value && value !== '' && parseInt(value) !== 0) {
      this.props.fetchAnalytics(this.props.location.state.chatbot._id, parseInt(value), this.handleAnalytics)
    }
  }

  componentDidMount () {
    this.props.fetchChatbots(this.handleChatbots)
    this.props.fetchAnalytics(this.props.location.state.chatbot._id, parseInt(this.state.days), this.handleAnalytics)
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push'
    document.title = 'KiboChat | Configure ChatBot'

    var addScript = document.createElement('script')
    addScript.setAttribute('type', 'text/javascript')
    addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/custom/components/base/toastr.js')
    addScript.type = 'text/javascript'
    document.body.appendChild(addScript)

    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    /* eslint-enable */
  }

  handleAnalytics (res) {
    if (res.status === 'success') {
      this.setState({periodicAnalytics: res.payload, loading: false})
    } else {
      this.setState({loading: false})
    }
  }

  handleChatbots (res) {
    let chatbot = res.payload.filter(a => a._id === this.props.location.state.chatbot._id)[0]
    this.setState({chatbot: chatbot})
  }

  onBack() {
    this.props.history.push({
      pathname: this.props.location.state.backUrl,
      state: {chatbot: this.props.location.state.chatbot, page: this.props.location.state.page}
    })
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {
          this.state.loading
          ? <div id='_chatbot_please_wait' style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
            <div className="m-loader m-loader--brand" style={{width: "30px", display: "inline-block"}} ></div>
            <span className='m--font-brand'>Please wait...</span>
          </div>
          : <div id='_chatbot_main_container'>
          <div className='m-subheader '>
            <div className='d-flex align-items-center'>
              <div className='mr-auto'>
                <h3 className='m-subheader__title'>{this.props.location.state.page.pageName} Chat Bot Analytics</h3>
              </div>
            </div>
          </div>
          <div className='m-content'>
            <LIFETIMESTATISTICS
              triggerWordsMatched={this.state.chatbot.stats ? this.state.chatbot.stats.triggerWordsMatched : 0}
              newSubscribers={this.state.chatbot.stats ? this.state.chatbot.stats.newSubscribers : 0}
            />
            <PERIODICSTATISTICS
              newSubscribersCount={this.state.periodicAnalytics.newSubscribers ? this.state.periodicAnalytics.newSubscribers : 0}
              triggerWordsMatched={this.state.periodicAnalytics.triggerWordsMatched ? this.state.periodicAnalytics.triggerWordsMatched : 0}
              urlBtnClickedCount={this.state.periodicAnalytics.urlBtnClickedCount ? this.state.periodicAnalytics.urlBtnClickedCount : 0}
              sentCount={this.state.periodicAnalytics.sentCount ? this.state.periodicAnalytics.sentCount : 0}
              returningSubscribers={this.state.periodicAnalytics.returningSubscribers ? this.state.periodicAnalytics.returningSubscribers : 0}
              days={this.state.days}
              onDaysChange={this.onDaysChange}
            />
          </div>
            <BACKBUTTON
              onBack={this.onBack}
              position='bottom-left'
            />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAnalytics,
    fetchChatbots
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Analytics)
