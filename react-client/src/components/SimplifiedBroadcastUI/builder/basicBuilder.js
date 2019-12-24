/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import Targeting from '../../../containers/convo/Targeting'
import GenericMessage from '../MessageContainer'

class BasicBuilder extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    console.log('BasicBuilder props', this.props)
    return (
      <div className='m-content'>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <div className='m-portlet m-portlet--mobile'>
              <div className='m-portlet__body'>
                <div className='row'>
                  <div className='col-12'>
                    {
                      this.props.showTabs &&
                      <ul className='nav nav-tabs'>
                      {
                        this.props.linkedMessages.map((message, index) =>
                        <li key={message.id}>
                          <a href='#/' className={'broadcastTabs' + (this.props.currentId === message.id ? ' active' : '')} onClick={() => this.props.changeMessage(message.id)} id={'tab-' + message.id} data-toggle='tab' role='tab' style={{cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px'}}>
                            {message.title}
                          </a>
                        </li>
                        )
                      }
                      {
                        this.props.unlinkedMessages.map((message, index) =>
                        <li key={message.id}>
                          <a href='#/' className={'broadcastTabs' + (this.props.currentId === message.id ? ' active' : '')} onClick={() => this.props.changeMessage(message.id)} id={'tab-' + message.id} data-toggle='tab' role='tab' style={{cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px', color: 'red'}}>
                            {message.title}
                          </a>
                        </li>
                        )
                      }
                      </ul>
                    }
                    <div className='tab-content'>
                      <div className='tab-pane fade active in' id='tab_1'>
                        <GenericMessage
                          titleEditable
                          convoTitle={this.props.convoTitle}
                          showDialog={this.props.showDialog}
                          hiddenComponents={this.props.hiddenComponents}
                          showAddComponentModal={this.props.showAddComponentModal}
                          list={this.props.list}
                          module={this.props.module}
                          noDefaultHeight={this.props.noDefaultHeight}
                          getItems={() => this.props.getItems(this.props.currentId)}
                        />
                      </div>
                      <div className='tab-pane' id='tab_2'>
                        <Targeting
                          handleTargetValue={this.props.handleTargetValue}
                          subscriberCount={this.props.subscriberCount}
                          totalSubscribersCount={this.props.totalSubscribersCount}
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
  'convoTitle': PropTypes.string.isRequired,
  'pageId': PropTypes.object.isRequired,
  'handleTargetValue': PropTypes.func.isRequired,
  'subscriberCount': PropTypes.number.isRequired,
  'totalSubscribersCount': PropTypes.number.isRequired,
  'resetTarget': PropTypes.bool.isRequired,
  'showTabs': PropTypes.bool.isRequired,
  'showDialog': PropTypes.func.isRequired,
  'hiddenComponents': PropTypes.array.isRequired,
  'showAddComponentModal': PropTypes.func.isRequired,
  'list': PropTypes.array.isRequired,
  'noDefaultHeight': PropTypes.bool,
  'linkedMessages': PropTypes.array.isRequired,
  'unlinkedMessages': PropTypes.array.isRequired,
  'currentId': PropTypes.number.isRequired,
  'changeMessage': PropTypes.func.isRequired,
  'titleEditable': PropTypes.bool,
  'module': PropTypes.string,
  'getItems': PropTypes.func.isRequired
}

export default BasicBuilder
