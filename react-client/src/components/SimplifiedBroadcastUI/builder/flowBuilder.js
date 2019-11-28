/**
 * Created by sojharo on 20/07/2017.
 */

import React from "react"
import { FlowChart, INodeInnerDefaultProps, IPortDefaultProps, actions } from "@mrblenny/react-flow-chart"
import PropTypes from 'prop-types'
import STARTINGSTEP from '../../../components/FlowBuilder/startingStep'
import COMPONENTSBLOCK from '../../../components/FlowBuilder/componentBlock'
import ACTIONBLOCK from '../../../components/FlowBuilder/actionBlock'
import SIDEBAR from '../../../components/FlowBuilder/sidebar'
import Targeting from '../../../containers/convo/Targeting'
import ReactFullScreenElement from "react-fullscreen-element"
import { mapValues, cloneDeep } from 'lodash'

class FlowBuilder extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.getChartData = this.getChartData.bind(this)
    this.state = {
      fullScreen: false,
      scale: 1,
      maxScale: 2,
      minScale: 0.5,
      chart: this.getChartData(),
      prevChart: {},
      selected: {}
    }

    this.getNodeInner = this.getNodeInner.bind(this)
    this.getPortOuter = this.getPortOuter.bind(this)
    this.getPortInner = this.getPortInner.bind(this)
    this.toggleFullScreen = this.toggleFullScreen.bind(this)
    this.zoomIn = this.zoomIn.bind(this)
    this.zoomOut = this.zoomOut.bind(this)
    this.resetTransform = this.resetTransform.bind(this)
    this.getPortsNLinks = this.getPortsNLinks.bind(this)

    this.NodeInnerCustom = this.getNodeInner()
    this.PortOuter = this.getPortOuter()
    this.PortInner = this.getPortInner()
    this.updateChart = this.updateChart.bind(this)
    this.linkAdded = false
    this.deleteButtonPayload = this.deleteButtonPayload.bind(this)
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

  // links: {
  //   link1: {
  //     id: 'link1',
  //     from: {
  //       nodeId: 'node1',
  //       portId: 'port2',
  //     },
  //     to: {
  //       nodeId: 'node2',
  //       portId: 'port1',
  //     },
  //     properties: {
  //       label: 'example link label',
  //     },
  //   },

  getPortsNLinks (message) {
    let components = message.messageContent
    console.log('getPortsNLinks', components)
    let ports = {}
    let links = {}
    for (let i = 0; i < components.length; i++) {
      if (components[i].buttons) {
        for (let j = 0; j < components[i].buttons.length; j++) {
          let payload = JSON.parse(components[i].buttons[j].payload)
          console.log('parsed payload', payload)
          ports[`${components[i].buttons[j].id}`] = {
            id: `${components[i].buttons[j].id}`,
            type: 'input'
          }
          if (payload && payload.action === 'send_message_block') {
            console.log('adding link')
            let linkId = Math.floor(Math.random() * 100)
            links[`${linkId}`] = {
              id: `${linkId}`,
              from: {
                nodeId: `${message.id}`,
                portId: `${components[i].buttons[j].id}`
              },
              to: {
                nodeId: `${payload.blockUniqueId}`,
                portId: 'port0'
              }
            }
          }
        }
      }
    }
    return {ports, links}
  }

  getChartData = () => {
    console.log('getting chart data')
    const messages = this.props.linkedMessages.concat(this.props.unlinkedMessages)
    let {ports, links} = this.getPortsNLinks(messages[0])
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
      ports: ports,
      properties: {
        id: messages[0].id
      }
    }

    console.log('messages', messages)
    for (let i = 1; i < messages.length; i++) {
      let portsNLinks = this.getPortsNLinks(messages[i])
      links = Object.assign(links, portsNLinks.links)
      positionX = positionX + 400
      chartSimple['nodes'][`${messages[i].id}`] = {
        id: `${messages[i].id}`,
        type: "component_block",
        position: {
          x: positionX,
          y: positionY
        },
        ports: Object.assign({
          port0: {
            id: 'port0',
            type: 'left',
            properties: {
              custom: 'property',
            }
          }
        }, portsNLinks.ports),
        properties: {
          id: messages[i].id
        }
      }
    }
    chartSimple['links'] = links
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

  updateChart (chartValue) {
    let prevChart = cloneDeep(this.state.chart)
    console.log('previous chart', prevChart)
    let newChart = chartValue(this.state.chart)
    console.log('chart updated', newChart)
    this.setState({
      chart: newChart,
      prevChart
    })

    let linksKeys = Object.keys(newChart.links)
    if (linksKeys.length > Object.keys(prevChart.links).length) {
      this.linkAdded = true
    }
    console.log('linkedAdded', this.linkAdded)
    console.log(linksKeys)
    if (
      this.linkAdded && 
      newChart.links[linksKeys[linksKeys.length - 1]] &&
      newChart.links[linksKeys[linksKeys.length - 1]].to && 
      newChart.links[linksKeys[linksKeys.length - 1]].to.nodeId
    ) {
      console.log('updating chart link added', this.props)
      let componentId = newChart.links[linksKeys[linksKeys.length - 1]].to.nodeId
      let fromComponentId = newChart.links[linksKeys[linksKeys.length - 1]].from.portId
      let index = this.props.unlinkedMessages.findIndex((lm) => lm.id.toString() === componentId.toString())

      // this.props.unlinkedMessages[index].id --> blockUniqueId
      this.props.linkedMessages.push(this.props.unlinkedMessages[index])
      this.updateButtonPayload(fromComponentId, this.props.linkedMessages[this.props.linkedMessages.length-1].id)
      this.props.unlinkedMessages.splice(index, 1)
      console.log('messages updated', this.props) 
      this.linkAdded = false
    }
  }

  updateButtonPayload (buttonId, blockUniqueId) {
    console.log('updateButtonPayload', this.props)
    debugger;
    let messages = this.props.linkedMessages
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i]
      for (let j = 0; j < message.messageContent.length; j++) {
        let component = message.messageContent[j]
        if (component.buttons) {
          for (let k = 0; k < component.buttons.length; k++) {
            let button = component.buttons[k]
            if (button.id.toString() === buttonId.toString()) {
              this.props.linkedMessages[i].messageContent[j].buttons[k].payload = JSON.stringify({
                action: 'send_message_block',
                blockUniqueId: blockUniqueId
              })
              return
            }
          }
        }
      }
    }

    messages = this.props.unlinkedMessages
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i]
      for (let j = 0; j < message.messageContent.length; j++) {
        let component = message.messageContent[j]
        if (component.buttons) {
          for (let k = 0; k < component.buttons.length; k++) {
            let button = component.buttons[k]
            if (button.id.toString() === buttonId.toString()) {
              this.props.unlinkedMessages[i].messageContent[j].buttons[k].payload = JSON.stringify({
                action: 'send_message_block',
                blockUniqueId: blockUniqueId
              })
              return
            }
          }
        }
      }
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 46 || e.keyCode === 8) {
        console.log('key pressed in flow builder', this.state)
        if (this.state.prevChart.selected.type === 'link') {
          console.log('deleting link', this.props)
          let linkId = this.state.prevChart.selected.id
          let toComponentId = this.state.prevChart.links[linkId].to.nodeId
          // let fromComponenetId = this.state.prevChart.links[linkId].from.nodeId

          // // update button payload
          // debugger;
          

          let index = this.props.linkedMessages.findIndex((lm) => lm.id.toString() === toComponentId.toString())
          //this.props.linkedMessages[index].linkedButton.payload = null
          this.deleteButtonPayload(toComponentId)
          this.props.unlinkedMessages.push(this.props.linkedMessages[index])
          this.props.linkedMessages.splice(index, 1)
          console.log('messages updated', this.props) 
        }
      }
    })
  }

  deleteButtonPayload (blockUniqueId) {
    console.log('deleteButtonPayload', this.props)
    let messages = this.props.linkedMessages
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i]
      for (let j = 0; j < message.messageContent.length; j++) {
        let component = message.messageContent[j]
        if (component.buttons) {
          for (let k = 0; k < component.buttons.length; k++) {
            let buttonPayload = JSON.parse(component.buttons[k].payload)
            if (buttonPayload.blockUniqueId.toString() === blockUniqueId.toString()) {
              this.props.linkedMessages[i].messageContent[j].buttons[k].payload = null
              return
            }
          }
        }
      }
    }

    messages = this.props.unlinkedMessages
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i]
      for (let j = 0; j < message.messageContent.length; j++) {
        let component = message.messageContent[j]
        if (component.buttons) {
          for (let k = 0; k < component.buttons.length; k++) {
            let buttonPayload = JSON.parse(component.buttons[k].payload)
            if (buttonPayload.blockUniqueId.toString() === blockUniqueId.toString()) {
              this.props.unlinkedMessages[i].messageContent[j].buttons[k].payload = null
              return
            }
          }
        }
      }
    }
  }

  render () {
    console.log('rendering flow builder', this.props)
    const stateActions = mapValues(actions, (func) => (...args) => this.updateChart(func(...args)))
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
                  <FlowChart
                    chart={this.state.chart}
                    Components={ {
                      NodeInner: this.NodeInnerCustom
                    }}
                    callbacks={stateActions}
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
