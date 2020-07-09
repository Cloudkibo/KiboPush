import React from 'react'
import CommentCaptures from './commentCaptures'
import ChatBots from './chatbots'
import { getMessagesCount } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class CompanyDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('this.props.location.state', this.props.location.state)
    if (this.props.location.state) {
      props.getMessagesCount({companyId: this.props.location.state.companyId})
    }
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

    document.title = `${title} | Company Details`
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper' style={{height: 'fit-content'}}>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>{this.props.location.state.companyName}&nbsp;&nbsp;&nbsp;
              {this.props.messagesCount &&
                <span className='m-badge m-badge--wide m-badge--primary'>{`${this.props.messagesCount.totalMessagesSent} Messages Sent`}</span>
              }
              </h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <CommentCaptures history={this.props.history} location={this.props.location} companyId={this.props.location.state.companyId} />
          <ChatBots history={this.props.history} location={this.props.location} companyId={this.props.location.state.companyId} />
          <div style={{'overflow': 'auto'}}>
            <Link to='/operationalDashboard' className='btn btn-primary btn-sm' style={{ float: 'right', margin: '20px' }}>Back
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messagesCount: state.backdoorInfo.messagesCount
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getMessagesCount: getMessagesCount
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetails)
