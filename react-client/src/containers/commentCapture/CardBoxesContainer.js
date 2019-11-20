/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import CardBox from './CardBox'
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
    return (
      <div className='col-xl-12'>
        <div className='row m-row--full-height'>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='totalComments'>
            <span>Number of Total Comments of All Posts</span>
          </UncontrolledTooltip>
          <div className='col-sm-3 col-md-3 col-lg-3'>
              <CardBox
                style='brand'
                value={(this.props.data && this.props.data.totalComments) ? this.props.data.totalComments : 0}
                label='Total Comments'
                id='totalComments'
              />
          </div>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='conversions'>
            <span>Number of Total Conversions of All Posts</span>
          </UncontrolledTooltip>
          <div className='col-sm-3 col-md-3 col-lg-3'>
              <CardBox
                style='success'
                value={(this.props.data && this.props.data.conversions) ? this.props.data.conversions : 0}
                label='Conversions'
                id='conversions'
              />
          </div>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='totalRepliesSent'>
            <span>Number of Total Replies Sent of All Posts</span>
          </UncontrolledTooltip>
          <div className='col-sm-3 col-md-3 col-lg-3'>
              <CardBox
                style='danger'
                value={(this.props.data && this.props.data.totalRepliesSent) ? this.props.data.totalRepliesSent : 0}
                label='Total Replies Sent'
                id='totalRepliesSent'
              />
          </div>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='waitingConversion'>
            <span>Number of waitingConversions of All Posts</span>
          </UncontrolledTooltip>
          <div className='col-sm-3 col-md-3 col-lg-3'>
              <CardBox
                style='success'
                value={(this.props.data && this.props.data.waitingConversions) ? this.props.data.waitingConversions : 0}
                label='Waiting Conversion'
                id='waitingConversion'
              />
          </div>
        </div>
      </div>
    )
  }
}
/* eslint-enable */

export default CardBoxesContainer
