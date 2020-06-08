/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import PostMetric from './PostMetric'
import { UncontrolledTooltip } from 'reactstrap'
import ProgressBar from '../../components/Dashboard/ProgressBar'

/* card box style must be any of these
  band
  success
  danger
  accent
 */

/* eslint-disable */

class PostAnalytics extends React.Component {
  render () {
    return (
    <div className='m-portlet m-portlet--full-height '>
        <div className='m-portlet__head'>
          <div className='m-portlet__head-caption'>
            <div className='m-portlet__head-title'>
              <h3 className='m-portlet__head-text'>Comment Capture Analytics</h3>
            </div>
          </div>
        </div>
        <div className='m-portlet__body'>
            <div className='row'>
                <div className='col-4'>
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='totalComments'>
                        <span> Number of comments received on the posts by the users</span>   
                    </UncontrolledTooltip>
                    <PostMetric
                    id='totalComments'
                    icon='flaticon-comment'
                    title={this.props.data.totalComments !== null ? this.props.data.totalComments : 0}
                    subtitle='Total User Comments'
                    iconStyle='brand'
                    />
                </div>
                <div className='col-4'>
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='deletedComments'>
                        <span> Number of comments deleted on the priginal FB post</span>   
                    </UncontrolledTooltip>
                    <PostMetric
                    id='deletedComments'
                    icon='la la-trash'
                    title={this.props.data.deletedComments !== null ? this.props.data.deletedComments : 0}
                    subtitle='Comments removed from FB'
                    iconStyle='metal'
                    />
                </div>
                <div className='col-4'>
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='conversions'>
                        <span>Number of users who subscribed using comment capture</span>  
                    </UncontrolledTooltip>
                    <PostMetric
                    id='conversions'
                    icon='la la-user-plus'
                    title={this.props.data.conversions !== null ? this.props.data.conversions : 0}
                    subtitle='Total Conversions'
                    iconStyle='success'
                    />
                </div>
            </div>
            <div className='row' style={{marginTop: '20px'}}>
                <div className='col-4'>
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='totalRepliesSent'>
                        <span>Number of comments for which an auto reply was sent in messenger</span>
                    </UncontrolledTooltip>
                    <PostMetric
                    id='totalRepliesSent'
                    icon='la la-mail-reply'
                    title={this.props.data.totalRepliesSent !== null ? this.props.data.totalRepliesSent : 0}
                    subtitle='Total Replies Sent'
                    iconStyle='info'
                    />
                </div>
                <div className='col-4'>
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='waitingConversions'>
                        <span> Number of commentors who have yet not responded to the auto reply in messenger</span>
                    </UncontrolledTooltip>
                    <PostMetric
                    id='waitingConversions'
                    icon='fa fa-clock-o'
                    title={this.props.data.waitingConversions !== null ? this.props.data.waitingConversions : 0}
                    subtitle='Waiting Conversions'
                    iconStyle='warning'
                    />
                </div>
                <div className='col-4'>
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='negativeMatch'>
                        <span>Number of comments for which an auto reply was not sent in the messenger</span>
                    </UncontrolledTooltip>
                    <PostMetric
                    id='negativeMatch'
                    icon='la la-exclamation-triangle'
                    title={this.props.data.negativeMatch !== null ? this.props.data.negativeMatch : 0}
                    subtitle='Negative Match'
                    iconStyle='danger'
                    />
                </div>
            </div>
            { this.props.data.conversions > 0 || this.props.data.waitingConversions > 0 ?         
            <div className='col-12'>
                <div className='m--space-30' />
                  <ProgressBar
                    rate={ this.props.data.conversions > 0 || this.props.data.waitingConversions > 0 ? ((this.props.data.conversions / (this.props.data.conversions + this.props.data.waitingConversions)) * 100).toFixed(1) + '%' : '0%'}
                    label='Coversion Rate'
                    progressStyle='success'
                  />
            </div>
            : <div />
            }
        </div>
    </div>
    )
  }
}
/* eslint-enable */

export default PostAnalytics
