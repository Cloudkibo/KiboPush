/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import Targeting from '../Targeting'
import GenericMessage from '../../../components/SimplifiedBroadcastUI/GenericMessage'

class BasicBuilder extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className='m-content'>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <div className='m-portlet m-portlet--mobile'>
              <div className='m-portlet__body'>
                <div className='row'>
                  <div className='col-12'>
                    <ul className='nav nav-tabs'>
                      <li>
                        <a href='#/' id='titleBroadcast' className='broadcastTabs active' onClick={this.props.onBroadcastClick}>Broadcast </a>
                      </li>
                      <li>
                        {this.props.broadcast.length > 0
                          ? <a href='#/' id='titleTarget' className='broadcastTabs' onClick={this.props.onTargetClick}>Targeting </a>
                          : <a href='#/'>Targeting</a>
                        }
                      </li>

                    </ul>
                    <div className='tab-content'>
                      <div className='tab-pane fade active in' id='tab_1'>
                        <GenericMessage
                          broadcast={this.props.broadcast}
                          handleChange={this.props.handleChange}
                          setReset={this.props.reset}
                          convoTitle={this.props.convoTitle}
                          titleEditable
                          pageId={this.props.pageId.pageId}
                          pages={this.props.location.state && this.props.locationPages}
                          buttonActions={this.props.buttonActions} />
                      </div>
                      <div className='tab-pane' id='tab_2'>
                        <Targeting
                          handleTargetValue={this.props.handleTargetValue}
                          subscriberCount={this.props.subscriberCount}
                          resetTarget={this.props.resetTarget}
                          page={this.props.pageId}
                          component='broadcast'
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

BasicBuilder.propTypes = {
  'broadcast': PropTypes.array.isRequired,
  'onBroadcastClick': PropTypes.func.isRequired,
  'onTargetClick': PropTypes.func.isRequired,
  'handleChange': PropTypes.func.isRequired,
  'reset': PropTypes.func.isRequired,
  'convoTitle': PropTypes.string.isRequired,
  'pageId': PropTypes.object.isRequired,
  'location': PropTypes.object.isRequired,
  'locationPages': PropTypes.object.isRequired,
  'buttonActions': PropTypes.array.isRequired,
  'handleTargetValue': PropTypes.func.isRequired,
  'subscriberCount': PropTypes.number.isRequired,
  'resetTarget': PropTypes.bool.isRequired
}

export default BasicBuilder
