import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import Popover from 'react-simple-popover'
import CopyLink from './copyLink'
import { Link } from 'react-router-dom'

class GrowthTools extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      toolsData: [],
      totalLength: 0,
      copyPopover: false
    }
    this.showCopyPopover = this.showCopyPopover.bind(this)
    this.closeCopyPopover = this.closeCopyPopover.bind(this)
  }

  showCopyPopover () {
    this.setState({
      copyPopover: true
    })
  }

  closeCopyPopover () {
    this.setState({
      copyPopover: false
    })
  }
  componentWillReceiveProps (nextprops) {
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Growth Tools`;
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div id='growthTools' className='container'>
          <br /><br /><br /><br /><br /><br />
          <h3>Growth Tools</h3>
          <div className='row'>
            <div
              className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 card-outer'>
              <div className='card'>
                <img className='img-card' src='https://cdn.cloudkibo.com/public/icons/smartphone.png' style={{width: 200, height: 200}} alt='Card cap' />
                <div className='col-md-6 col-sm-6 col-xs-6' style={{padding: 10}}>
                  <div className='card-body' >
                    <h4 className='card-title'>Customer Matching Using Phone Numbers</h4>
                    <hr />
                    <p className='card-text'>Upload your csv file containing your customers phone numbers to invite them for a chat on Messenger</p>
                    <Link to={`/customerMatchingUsingPhNum`} className='btn btn-primary'>
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div
              className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 card-outer'>
              <div className='card'>
                <img className='img-card' src='https://cdn.cloudkibo.com/public/icons/messenger.png' style={{width: 200, height: 200}} alt='Card cap' />
                <div className='col-md-6 col-sm-6 col-xs-6' style={{margin: 10}}>
                  <div className='card-body'>
                    <h4 className='card-title'>Subscribe to Messenger</h4>
                    <hr />
                    <p className='card-text'>Add a button to your website which sends your facebook page link to your followers on the messenger.</p>
                    <Link to={`/subscribeToMessenger`} className='btn btn-primary'>
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row' style={{marginTop: '10px'}}>
            <div
              className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 card-outer'>
              <div className='card'>
                <img className='img-card' src='https://cdn.cloudkibo.com/public/icons/invitation.png' style={{width: 200, height: 200}} alt='Card cap' />
                <div className='col-md-6 col-sm-6 col-xs-6' style={{padding: 10}}>
                  <div className='card-body' >
                    <h4 className='card-title'>Copy Page Link</h4>
                    <hr />
                    <p className='card-text'>Copy facebook page link to send to your friends</p>
                    <button ref={(c) => { this.copyLink = c }} onClick={this.showCopyPopover} className='btn btn-primary' data-tip='copyLink'>
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Popover
          style={{ width: '305px', height: '360px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, border: '1px solid #7ed321' }}
          placement='top'
          target={this.copyLink}
          show={this.state.copyPopover}
          onHide={this.closeCopyPopover}
        >
          <CopyLink />
        </Popover>
      </div>
    )
  }
}

export default GrowthTools
