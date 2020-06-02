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
            {
              this.props.singlePostResult ?
              <span> Number of comments received on the post by the users</span>:
              <span> Number of comments received on the posts by the users</span>
            }
          </UncontrolledTooltip>
          <div className='col-sm-3 col-md-3 col-lg-3'  style={this.props.singlePostResult ? {maxWidth: '20%'} : {maxWidth: '25%'}}>
              <CardBox
                style='brand'
                value={(this.props.data && this.props.data.totalComments) ? this.props.data.totalComments : 0}
                label='Total Users Comments'
                deletedComments={this.props.data && this.props.data.deletedComments ? this.props.data.deletedComments : 0}
                id='totalComments'
              />
          </div>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='conversions'>
            <span>Number of users who subscribed using comment capture</span>  
          </UncontrolledTooltip>
          <div className='col-sm-3 col-md-3 col-lg-3' style={this.props.singlePostResult ? {maxWidth: '20%'} : {maxWidth: '25%'}}>
              <CardBox
                style='success'
                value={(this.props.data && this.props.data.conversions) ? this.props.data.conversions : 0}
                label='Total Conversions'
                id='conversions'
              />
          </div>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='totalRepliesSent'>
            <span>Number of comments for which an auto reply was sent in messenger</span>
          </UncontrolledTooltip>
          <div className='col-sm-3 col-md-3 col-lg-3' style={this.props.singlePostResult ? {maxWidth: '20%'} : {maxWidth: '25%'}}>
              <CardBox
                style='info'
                value={(this.props.data && this.props.data.totalRepliesSent) ? this.props.data.totalRepliesSent : 0}
                label='Total Replies Sent'
                id='totalRepliesSent'
              />
          </div>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='waitingConversion'>
          <span> Number of commentors who have yet not responded to the auto reply in messenger</span>

          </UncontrolledTooltip>
          <div className='col-sm-3 col-md-3 col-lg-3' style={this.props.singlePostResult ? {maxWidth: '20%'} : {maxWidth: '25%'}}>
              <CardBox
                style='warning'
                value={(this.props.data && this.props.data.waitingConversions) ? this.props.data.waitingConversions : 0}
                label='Waiting Conversion'
                id='waitingConversion'
              />
          </div>
          {this.props.singlePostResult &&
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='negativeMatch'>
            <span>Number of comments for which an auto reply was not sent in the messenger</span>
          </UncontrolledTooltip>
          }
          {this.props.singlePostResult &&
          <div className='col-sm-3 col-md-3 col-lg-3' style={{maxWidth: '20%'}}>
              <CardBox
                style='danger'
                value={(this.props.data && this.props.data.negativeMatch) ? this.props.data.negativeMatch : 0}
                label='Negative Match'
                id='negativeMatch'
              />
          </div>
        }
        </div>
      </div>
    )
  }
}
/* eslint-enable */

export default CardBoxesContainer
