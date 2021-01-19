import React from "react"
import IconStack from "../../components/Dashboard/IconStack"

class SLAStats extends React.Component {
  render() {
    return (
      <div style={{ marginBottom: '75px', paddingLeft: '2.2rem' }}>
        <div className='row' style={{ marginBottom: '35px' }}>
          <div className='col-md-4'>
            <IconStack
              icon='la la-comments'
              title={this.props.newSessions}
              subtitle='New Sessions'
              iconStyle='brand'
              id='newSubscribers'
              iconFontSize='1.8rem'
              titleFontSize='20px'
              iconHeight='50px'
              iconWidth='50px'
            />
          </div>
          <div className='col-md-4'>
            <IconStack
              icon='la la-check-circle'
              title={this.props.resolvedSessions}
              subtitle='Resolved Sessions'
              iconStyle='success'
              id='triggers'
              iconFontSize='1.8rem'
              titleFontSize='20px'
              iconHeight='50px'
              iconWidth='50px'
            />
          </div>
          <div className='col-md-4'>
            <IconStack
              icon='la la-hourglass-start'
              title={this.props.pendingSessions}
              subtitle='Pending Sessions'
              iconStyle='danger'
              id='triggers'
              iconFontSize='1.8rem'
              titleFontSize='20px'
              iconHeight='50px'
              iconWidth='50px'
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-4'>
            <IconStack
              icon='la la-comments'
              title={this.props.openSessions}
              subtitle='Open Sessions'
              iconStyle='warning'
              id='newSubscribers'
              iconFontSize='1.8rem'
              titleFontSize='20px'
              iconHeight='50px'
              iconWidth='50px'
            />
          </div>
          <div className='col-md-4'>
            <IconStack
              icon='la la-comment'
              title={this.props.messagesReceived}
              subtitle='Messages Received'
              iconStyle='info'
              id='triggers'
              iconFontSize='1.8rem'
              titleFontSize='20px'
              iconHeight='50px'
              iconWidth='50px'
            />
          </div>
          <div className='col-md-4'>
            <IconStack
              icon='la la-send-o'
              title={this.props.messagesSent}
              subtitle='Messages Sent'
              iconStyle='success'
              id='triggers'
              iconFontSize='1.8rem'
              titleFontSize='20px'
              iconHeight='50px'
              iconWidth='50px'
            />
          </div>
        </div>
      </div>
    )
  }
}

export default SLAStats
