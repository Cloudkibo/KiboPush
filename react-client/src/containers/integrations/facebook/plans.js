import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './../../wizard/header'
import AlertContainer from 'react-alert'
import { loadPlans } from '../../../redux/actions/plans.actions'
import { setPlanId, setPlanName, setPlanUniqueId, setOnboardingPlatform } from '../../../redux/actions/channelOnboarding.actions'
import SIDEBAR from '../sidebar'
import PLANITEM from '../planItem'

class FacebookPlansScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedPlan: null
    }
    this.nextBtnAction = this.nextBtnAction.bind(this)
    this.updateState = this.updateState.bind(this)
    this.isPlanSelected = this.isPlanSelected.bind(this)
    this.getDescription = this.getDescription.bind(this)

    props.loadPlans('messenger', this.isPlanSelected)
  }

  updateState (state) {
    this.setState(state)
  }

  getDescription (plan) {
    let description = ''
    switch (plan.unique_ID) {
      case 'plan_F':
        description = '500 subscribers, 1 seat, 1 Facebook page'
        break
      case 'plan_A':
        description = '2500 subscribers, 3 seats, 3 Facebook pages'
        break
      case 'plan_B':
        description = '5000 subscribers, 10 seats, 5 Facebook pages'
        break
      case 'plan_C':
        description = '10000 subscribers, unlimited seats, 10 Facebook pages'
        break
      case 'plan_D':
        description = 'Unlimited subscribers, unlimited seats, unlimited Facebook pages'
        break
      default:
    }
    return description
  }

  componentWillMount (nextprops) {
    if (this.props.channelOnboarding && this.props.channelOnboarding.planId) {
      this.setState({selectedPlan: this.props.channelOnboarding.planId})
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
    document.title = `${title} | Select WhatsApp Plans`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    $('#headerDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  isPlanSelected (res) {
    if (
      res.status === 'success' && this.props.history.location.state &&
      this.props.history.location.state.plan
    ) {
      const plans = res.payload
      const selectedPlan = plans.find((item) => item.unique_ID === this.props.history.location.state.plan)
      if (selectedPlan) {
        this.setState({selectedPlan: selectedPlan._id}, () => {
          this.nextBtnAction()
        })
      }
    }
  }

  nextBtnAction () {
    if (this.state.selectedPlan) {
      this.props.setPlanId(this.state.selectedPlan)
      this.props.setPlanName(this.props.plansInfo.filter(item => item._id === this.state.selectedPlan)[0].name)
      this.props.setPlanUniqueId(this.props.plansInfo.filter(item => item._id === this.state.selectedPlan)[0].unique_ID)
      this.props.setOnboardingPlatform('whatsApp')
      this.props.history.push({
        pathname: '/facebookBillingScreen'
      })
    } else {
      this.msg.error('Please select a plan first.')
    }
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <Header showTitle hideMessages hideSettings />
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin"
        style={{ height: 'calc(100vh - 130px)', margin: '30px'}}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <SIDEBAR 
            heading='Configure Facebook Messenger Channel'
            description='Get connected with you Facebook Messenger audience!'
          />
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
            <div style={{height: '30px'}}>
              <h2> Step 1: Choose a plan </h2>
            </div>
            <div style={{overflowY: 'scroll', height: 'calc(100% - 70px)'}}>
              {
                this.props.plansInfo && this.props.plansInfo.map((planInfo, i) => (
                  <PLANITEM 
                    planInfo={planInfo}
                    selectedPlan={this.state.selectedPlan}
                    updateState={this.updateState}
                    description={this.getDescription(planInfo)}
                  />
                ))
              }
              <br />
              <label style={{fontWeight: 'normal'}} className='control-label'>
                View our <a href='https://kibopush.com/pricing-test/#1619454123984-81484906-ec63' target='_blank' rel='noopener noreferrer'> pricing page</a> to learn more about our pricing plans
              </label>
            </div>
            <div className='row'>
              <div className='col-lg-6 m--align-left' />
              <div className='col-lg-6 m--align-right'>
                <button className='btn btn-success m-btn m-btn--custom m-btn--icon' onClick={this.nextBtnAction}>
                  <span>
                    <span>Next</span>&nbsp;&nbsp;
                    <i className='la la-arrow-right' />
                  </span>
                </button>
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
    user: (state.basicInfo.user),
    plansInfo: (state.plansInfo.plansInfo),
    superUser: (state.basicInfo.superUser),
    channelOnboarding: (state.channelOnboarding)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPlans,
    setPlanId,
    setPlanName,
    setPlanUniqueId,
    setOnboardingPlatform
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FacebookPlansScreen)
