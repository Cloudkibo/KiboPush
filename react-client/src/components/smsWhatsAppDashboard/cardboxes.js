/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import CardBox from '../Dashboard/CardBox'
import { Link } from 'react-router-dom'
import { UncontrolledTooltip } from 'reactstrap'

/* card box style must be any of these
  band
  success
  danger
  accent
 */
/* eslint-disable */
class CardBoxesContainer extends React.Component {
  render () {
    const url = window.location.hostname
    return (
      <div className='col-xl-12'>
        <div className='row m-row--full-height'>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='subscribers'>
            <span>Number of subscribers</span>
          </UncontrolledTooltip>
          <div className='col-sm-6 col-md-6 col-lg-6'>
            <Link to='/smsSubscribers' >
              <CardBox
                style='danger'
                value={this.props.cardBoxesData.subscribers ? this.props.cardBoxesData.subscribers : 0}
                label='Subscribers'
                id='subscribers'
              />
            </Link>
          </div>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='properties'>
            {url.includes('kibochat.cloudkibo.com')
              ? <span>Number of new messages</span>
              : <span>Nunmber of broadcasts</span>
            }
          </UncontrolledTooltip>
          <div className='col-sm-6 col-md-6 col-lg-6'>
            { url.includes('kibochat.cloudkibo.com') || url.includes('localhost') &&
            <Link to={(this.props.platform === 'sms' ? '/smsChat' : '/whatsAppChat')} >
              <CardBox
                style='accent'
                value={ this.props.cardBoxesData.chats ?  this.props.cardBoxesData.chats : 0}
                label={'New Messages'}
                id='properties'
              />
            </Link>
          }

          { url.includes('kiboengage.cloudkibo.com') || url.includes('localhost') &&
            <Link to={(this.props.platform === 'sms' ? '/smsBroadcasts' : '/whatsAppBroadcasts')} >
              <CardBox
                style='accent'
                value={this.props.cardBoxesData.broadcasts ? this.props.cardBoxesData.broadcasts : 0}
                label={'Broadcasts'}
                id='properties'
              />
            </Link>
          }
          </div>
        </div>
      </div>
    )
  }
}
/* eslint-enable */
export default CardBoxesContainer
