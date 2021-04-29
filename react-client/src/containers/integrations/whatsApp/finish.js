import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './../../wizard/header'
import SIDEBAR from '../sidebar'
import { Link } from 'react-router-dom'

class WhatsAppFinishScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
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
    document.title = `${title} | Finish`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    $('#headerDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  render () {
    return (
      <div>
        <Header showTitle hideMessages hideSettings />
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin"
        style={{ height: 'calc(100vh - 130px)', margin: '30px'}}>
          <SIDEBAR 
            heading='Configure WhatsApp Channel'
            description='Reach out to 2 billion WhatsApp users to grow your business!'
          />
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
            <div style={{position: 'relative'}}>
              <div style={{position: 'absolute', marginTop: '25%', left: '15%'}}>
                <center>
                  <img alt='completed' src='https://cdn.cloudkibo.com/public/icons/PE-Success-Icon.png' width='150' height='150'></img>
                  <br /><br />
                  {this.props.channelOnboarding && this.props.channelOnboarding.planName && this.props.channelOnboarding.planName.includes('Enterprise')
                    ? <span>
                        Congratulations! you have successfully applied for Enterprise Plan for WhatsApp. Someone from our team will contact you soon.
                      </span>
                    : <span>
                        Congratulations! you have successfully configured WhatsApp channel.
                      </span>
                  }
                  <br /><br /><br /><br></br>
                  {this.props.channelOnboarding && this.props.channelOnboarding.planName && !this.props.channelOnboarding.planName.includes('Enterprise') &&
                    <Link to='/dashboard' className='btn btn-success m-btn m-btn--custom m-btn--icon'>
                      Finish
                    </Link>
                  }
                </center>
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
    channelOnboarding: (state.channelOnboarding)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppFinishScreen)
