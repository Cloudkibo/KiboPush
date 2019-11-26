/**
 * Created by sojharo on 20/07/2017.
 */

import React from "react"
import { FlowChartWithState, INodeInnerDefaultProps } from "@mrblenny/react-flow-chart"
import PropTypes from 'prop-types'
import STARTINGSTEP from '../../../components/FlowBuilder/startingStep'
import COMPONENTSBLOCK from '../../../components/FlowBuilder/componentBlock'
import ACTIONBLOCK from '../../../components/FlowBuilder/actionBlock'
import SIDEBAR from '../../../components/FlowBuilder/sidebar'
import Targeting from '../../../containers/convo/Targeting'
import ReactFullScreenElement from "react-fullscreen-element"
import Sticky from 'react-sticky-el'

class FlowBuilder extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      fullScreen: false
    }

    this.getNodeInner = this.getNodeInner.bind(this)
    this.getChartData = this.getChartData.bind(this)
    this.toggleFullScreen = this.toggleFullScreen.bind(this)

    this.NodeInnerCustom = this.getNodeInner()
  }

  toggleFullScreen () {
    this.setState({fullScreen: !this.state.fullScreen})
  }

  getChartData = () => {
    const messages = this.props.linkedMessages.concat(this.props.unlinkedMessages)
    let chartSimple = {
      offset: {
        x: 0,
        y: 0
      },
      nodes: {},
      links: {},
      selected: {},
      hovered: {}
    }
    let positionX = 25
    let positionY = 50
    chartSimple['nodes'][`${messages[0].id}`] = {
      id: `${messages[0].id}`,
      type: "starting_step",
      position: {
        x: 25,
        y: 50
      },
      ports: {},
      properties: {
        id: messages[0].id
      }
    }
    console.log('messages', messages)
    for (let i = 1; i < messages.length; i++) {
      positionX = positionX + 400
      chartSimple['nodes'][`${messages[i].id}`] = {
        id: `${messages[i].id}`,
        type: "component_block",
        position: {
          x: positionX,
          y: positionY
        },
        ports: {
          port1: {
            id: 'port1',
            type: 'input'
          }
        },
        properties: {
          id: messages[i].id
        }
      }
      console.log('chartSimple', chartSimple)
    }
    return chartSimple
  }

  getNodeInner = () => {
    const NodeInnerCustom = ({ node, config } = INodeInnerDefaultProps) => {
      if (node.type === 'starting_step') {
        return (
          <STARTINGSTEP
            showAddComponentModal={this.props.showAddComponentModal}
            getQuickReplies={this.props.getQuickReplies}
            getComponent={this.props.getComponent}
            linkedMessages={this.props.linkedMessages}
            unlinkedMessages={this.props.unlinkedMessages}
            items={this.props.items}
          />
        )
      } else if (node.type === 'component_block') {
        console.log('nodeId', node.id)
        return (
          <COMPONENTSBLOCK
            showAddComponentModal={this.props.showAddComponentModal}
            getQuickReplies={this.props.getQuickReplies}
            getComponent={this.props.getComponent}
            linkedMessages={this.props.linkedMessages}
            unlinkedMessages={this.props.unlinkedMessages}
            currentId={node.properties.id}
          />
        )
      } else if (node.type === 'action_block') {
        return (
          <ACTIONBLOCK
            currentId={node.properties.id}
          />
        )
      } else {
        return (
          <div>
            <button>Don't Hit Me</button>
          </div>
        )
      }
    }
    return NodeInnerCustom
  }

  render () {
    return (
      <div className='m-content'>
        <div className='tab-content'>
          <ReactFullScreenElement fullScreen={this.state.fullScreen}>
            <div style={{background: 'white'}} className='tab-pane fade active in' id='tab_1'>
              <SIDEBAR
                unlinkedMessages={this.props.unlinkedMessages}
                toggleFullScreen={this.toggleFullScreen}
                fullScreen={this.state.fullScreen}
              />
              <div style={{border: '1px solid #ccc', overflow: 'hidden'}}>
                <FlowChartWithState
                  initialValue={this.getChartData()}
                  Components={ {
                    NodeInner: this.NodeInnerCustom
                  }}
                />
              </div>
            </div>
          </ReactFullScreenElement>
          <div className='tab-pane' id='tab_2'>
            <div className='m-portlet m-portlet--mobile'>
              <div className='m-portlet__body'>
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
    )
  }
}

FlowBuilder.propTypes = {
  'showAddComponentModal': PropTypes.func.isRequired,
  'linkedMessages': PropTypes.array.isRequired,
  'unlinkedMessages': PropTypes.array.isRequired,
  'handleTargetValue': PropTypes.func.isRequired,
  'subscriberCount': PropTypes.number.isRequired,
  'resetTarget': PropTypes.func.isRequired,
  'pageId': PropTypes.object.isRequired,
  'items': PropTypes.array.isRequired
}

export default FlowBuilder
