/**
 * Created by sojharo on 20/07/2017.
 */

import React from "react"
import { FlowChartWithState, INodeInnerDefaultProps, IPortDefaultProps } from "@mrblenny/react-flow-chart"
import PropTypes from 'prop-types'
import STARTINGSTEP from '../../../components/FlowBuilder/startingStep'
import COMPONENTSBLOCK from '../../../components/FlowBuilder/componentBlock'
import ACTIONBLOCK from '../../../components/FlowBuilder/actionBlock'
import SIDEBAR from '../../../components/FlowBuilder/sidebar'
import Targeting from '../../../containers/convo/Targeting'
import ReactFullScreenElement from "react-fullscreen-element"

class FlowBuilder extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      fullScreen: false,
      scale: 1,
      maxScale: 2,
      minScale: 0.5
    }

    this.getNodeInner = this.getNodeInner.bind(this)
    this.getPortOuter = this.getPortOuter.bind(this)
    this.getPortInner = this.getPortInner.bind(this)
    this.getChartData = this.getChartData.bind(this)
    this.toggleFullScreen = this.toggleFullScreen.bind(this)
    this.zoomIn = this.zoomIn.bind(this)
    this.zoomOut = this.zoomOut.bind(this)
    this.resetTransform = this.resetTransform.bind(this)

    this.NodeInnerCustom = this.getNodeInner()
    this.PortOuter = this.getPortOuter()
    this.PortInner = this.getPortInner()
  }

  resetTransform () {
    this.setState({scale: 1})
    const children = document.getElementById('flowBuilderChart').firstChild.firstChild.childNodes
    for (let i = 0; i < children.length; i++) {
      children[i].style.transform = `${children[i].style.transform.split(')')[0]}) scale(1)`
    }
  }

  zoomIn (step) {
    let newScale = this.state.scale + step
    console.log(newScale)
    if (newScale <= this.state.maxScale) {
      this.setState({
        scale: newScale
      })
      const children = document.getElementById('flowBuilderChart').firstChild.firstChild.childNodes
      for (let i = 0; i < children.length; i++) {
        children[i].style.transform = `${children[i].style.transform.split(')')[0]}) scale(${newScale})`
      }
    }
  }

  zoomOut (step) {
    let newScale = this.state.scale - step
    if (newScale >= this.state.minScale) {
      this.setState({
        scale: newScale
      })
      const children = document.getElementById('flowBuilderChart').firstChild.firstChild.childNodes
      for (let i = 0; i < children.length; i++) {
        children[i].style.transform = `${children[i].style.transform.split(')')[0]}) scale(${newScale})`
      }
    }
  }

  toggleFullScreen () {
    this.setState({fullScreen: !this.state.fullScreen})
  }

  getChartData = () => {
    console.log('getting chart data')
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
    }
    console.log('chartSimple', chartSimple)
    return chartSimple
  }

  getPortOuter = () => {
    const PortOuter = () => (
      <div style={{
        width: '24px',
        height: '24px',
        background: 'cornflowerblue',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${this.state.scale}, ${this.state.scale})`
      }} />
    )
    return PortOuter
  }

  getPortInner = () => {
    const PortInner = (props = IPortDefaultProps) => (
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'white',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${this.state.scale}, ${this.state.scale})`
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'grey',
          cursor: 'pointer'
        }}>

        </div>
      </div>
    )
    return PortInner
  }

  getNodeInner = () => {
    const NodeInnerCustom = ({ node, config } = INodeInnerDefaultProps) => {
      if (node.type === 'starting_step') {
        return (
          <STARTINGSTEP
            showAddComponentModal={this.props.showAddComponentModal}
            getComponent={this.props.getComponent}
            linkedMessages={this.props.linkedMessages}
            unlinkedMessages={this.props.unlinkedMessages}
            getItems={this.props.getItems}
            currentId={node.properties.id}
            changeMessage={this.props.changeMessage}
          />
        )
      } else if (node.type === 'component_block') {
        console.log('nodeId', node.id)
        return (
          <COMPONENTSBLOCK
            showAddComponentModal={this.props.showAddComponentModal}
            getComponent={this.props.getComponent}
            linkedMessages={this.props.linkedMessages}
            unlinkedMessages={this.props.unlinkedMessages}
            currentId={node.properties.id}
            changeMessage={this.props.changeMessage}
            getItems={this.props.getItems}
            removeMessage={this.props.removeMessage}
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
    console.log('rendering flow builder', this.props)
    return (
      <div className='m-content'>
        <div className='tab-content'>
          <div className='tab-pane fade active in' id='tab_1'>
            <ReactFullScreenElement fullScreen={this.state.fullScreen}>
              <div style={{background: 'white'}}>
                <SIDEBAR
                  unlinkedMessages={this.props.unlinkedMessages}
                  toggleFullScreen={this.toggleFullScreen}
                  fullScreen={this.state.fullScreen}
                  zoomIn={this.zoomIn}
                  zoomOut={this.zoomOut}
                  resetTransform={this.resetTransform}
                />
                <div id='flowBuilderChart' style={{border: '1px solid #ccc', overflow: 'hidden'}}>
                  <FlowChartWithState
                    initialValue={this.getChartData()}
                    Components={ {
                      NodeInner: this.NodeInnerCustom
                    }}
                  />
                </div>
              </div>
            </ReactFullScreenElement>
          </div>
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
  'resetTarget': PropTypes.bool,
  'pageId': PropTypes.object.isRequired,
  'getItems': PropTypes.func.isRequired,
  'changeMessage': PropTypes.func.isRequired,
  'removeMessage': PropTypes.func.isRequired,
  'currentId': PropTypes.number
}

export default FlowBuilder
