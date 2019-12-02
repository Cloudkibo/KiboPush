/**
 * Created by sojharo on 20/07/2017.
 */

import React from "react"
import { FlowChart, INodeInnerDefaultProps, IPortDefaultProps, actions } from "@mrblenny/react-flow-chart"
import PropTypes, { element } from 'prop-types'
import STARTINGSTEP from '../../../components/FlowBuilder/startingStep'
import COMPONENTSBLOCK from '../../../components/FlowBuilder/componentBlock'
import ACTIONBLOCK from '../../../components/FlowBuilder/actionBlock'
import SIDEBAR from '../../../components/FlowBuilder/sidebar'
import Targeting from '../../../containers/convo/Targeting'
import ReactFullScreenElement from "react-fullscreen-element"
import { mapValues, cloneDeep } from 'lodash'
import { UncontrolledTooltip } from 'reactstrap'

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
    this.getElements = this.getElements.bind(this)
    this.getTooltips = this.getTooltips.bind(this)
    this.fixInvalidNodes = this.fixInvalidNodes.bind(this)
    this.updatePortPositions = this.updatePortPositions.bind(this)
    this.getPortContainerPositions = this.getPortContainerPositions.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps nextProps', nextProps)
    if (nextProps.linkedMessages.concat(nextProps.unlinkedMessages).length > Object.keys(this.state.chart.nodes).length) {
      this.setState({
        chart: this.getChartData(),
        prevChart: {}
      })
    }
  }

  getTooltips () {
    let buttons = {}
    let messages = this.props.linkedMessages.concat(this.props.unlinkedMessages)
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i]
      for (let j = 0; j < message.messageContent.length; j++) {
        let component = message.messageContent[j]
        if (component.buttons) {
          for (let k = 0; k < component.buttons.length; k++) {
            let button = component.buttons[k]
            buttons[button.id] = button.title
          }
        }
      }
    }
    console.log('addTooltips buttons', buttons)


    let buttonIds = Object.keys(buttons)
    let tooltips = []
    for (let i = 0; i < buttonIds.length; i++) {
      let port = document.querySelector(`[data-port-id='${buttonIds[i]}']`)
      if (port) {
        console.log('port found', port)
        port.id = `port-${buttonIds[i]}`
        tooltips.push(
          (        
          <UncontrolledTooltip placement='bottom' target={`port-${buttonIds[i]}`}>
            <span>{buttons[buttonIds[i]]}</span>
          </UncontrolledTooltip>)
        )
      }
    }
    console.log('returning tooltips', tooltips)

    return tooltips
  }

  getPortContainerPositions (elements, elementKey, componentKeys) {
   // debugger;
    let card = document.getElementById('flowBuilderCard-'+ elementKey)
    if (card) {
      let buttons = elements[elementKey][componentKeys[0]]
      if (buttons.length > 0) {
        let cardDimensions = card.getBoundingClientRect()
        let buttonElement = document.getElementById('button-'+buttons[0])
        if (buttonElement) {
          let buttonDimensions = buttonElement.getBoundingClientRect()
          console.log(`cardDimensions`, cardDimensions)
          console.log(`buttonDimensions`, buttonDimensions)
          return {
            y: (buttonDimensions.top - cardDimensions.top) + (buttonDimensions.height / 2),
            x: (buttonDimensions.left - cardDimensions.left) + buttonDimensions.width,
          }
        }
      }
    }
  }

  getElements () {
    let messageCardIds = []
    let elements = {}

    let messages = this.props.linkedMessages.concat(this.props.unlinkedMessages)
    for (let i = 0; i < messages.length; i++) {
      messageCardIds.push(messages[i].id)
      elements[messages[i].id] = {}
      let message = messages[i]
      for (let j = 0; j < message.messageContent.length; j++) {
        let component = message.messageContent[j]
        elements[messages[i].id][component.id] = []
        if (component.buttons) {
          for (let k = 0; k < component.buttons.length; k++) {
            let button = component.buttons[k]
            elements[messages[i].id][component.id].push(button.id)
          }
        }
      }
    }

    console.log('elements', elements)

    let elementKeys = Object.keys(elements)
    let portContainerPosition = {}

    for (let i = 0; i < elementKeys.length; i++) {
      let componentKeys = Object.keys(elements[elementKeys[i]])
      if (componentKeys.length > 0) {
        portContainerPosition = this.getPortContainerPositions(elements, elementKeys[i], componentKeys)
      }
      let card = document.getElementById('flowBuilderCard-'+ elementKeys[i])
      let broadcastComponents = []
      if (card) {
        broadcastComponents = card.getElementsByClassName('broadcastContent')
        console.log('broadcastComponents', broadcastComponents)
      }
      for (let j = 0; j < componentKeys.length; j++) {
        let componentHeight = 0
        if (broadcastComponents[j]) {
          componentHeight = broadcastComponents[j].getBoundingClientRect().height
        }
        let buttons = elements[elementKeys[i]][componentKeys[j]]
        for (let k = 0; k < buttons.length; k++) {
          let buttonElement = document.getElementById('button-'+buttons[k])
          if (buttonElement) {
            let port = document.querySelector(`[data-port-id='${buttons[k]}']`)
            if (port) {
              if (j === 0) {
                let portElement = port.parentElement
                portElement.style['justify-content'] = 'initial'
                portElement.style['height'] = 'auto'
                portElement.style.top = `${portContainerPosition.y}px`
                portElement.style.left = `${portContainerPosition.x}px`
              }
              let top = j === 0 ? 0 : 50
              let height = j > 0 ? componentHeight+28 : 0
              console.log('height', height)
              if (k === 0) {
                port.style.margin = `${-12 + top + height}px 0px 0px`
              } else {
                port.style.margin = `${15}px 0px 0px`
              } 
            }
          }
        }
      }
    }

    // for (let i = 0; i < elementKeys.length; i++) {
    //   let card = document.getElementById('flowBuilderCard-'+ elementKeys[i])
    //   if (card) {
    //     let buttons = elements[elementKeys[i]]
    //     if (buttons.length > 0) {
    //       for (let j = 0; j < buttons.length; j++) {
    //         let buttonElement = document.getElementById('button-'+buttons[j])
    //         if (buttonElement) {
    //           let port = document.querySelector(`[data-port-id='${buttons[j]}']`)
    //           if (port) {
    //             if (j == 0) {
    //               port.style.margin = '-12px 0px 0px'
    //               let portElement = port.parentElement
    //               portElement.style['justify-content'] = 'initial'
    //               portElement.style.top = `${portContainerPosition.y}px`
    //               portElement.style.left = `${portContainerPosition.x}px`
    //             } else {
    //               port.style.margin = '15px 0px 0px'
    //             } 
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

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
            type: 'right',
            position: {
              x: 300,
              y: 170 + (i*10)
            }
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
            position: {
              x: 0,
              y: 170
            },
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

  fixInvalidNodes(chart) {
    let nodeKeys = Object.keys(chart.nodes)
    for (let i = 0; i < nodeKeys.length; i++) {
      let validNode = false
      let key = nodeKeys[i]
      for (let j = 0; j < this.props.linkedMessages.length; j++) {
        let messageId = this.props.linkedMessages[j].id
        if (messageId.toString() === key.toString()) {
          validNode = true
          break
        }
      }
      if (!validNode) {
        for (let j = 0; j < this.props.unlinkedMessages.length; j++) {
          let messageId = this.props.unlinkedMessages[j].id
          if (messageId.toString() === key.toString()) {
            validNode = true
            break
          }
        }
      }
      if (validNode) {
        validNode = false
      } else {
        for (let m = 0; m < this.props.unlinkedMessages.length; m++) {
          let validMessage = false
          for (let n = 0; n < nodeKeys.length; n++) {
            if (this.props.unlinkedMessages[m].id.toString() === nodeKeys[n].toString()) {
              validMessage = true
              break
            }
          }
          if (validMessage) {
            validMessage = false
          } else {
            let unmatchedId = this.props.unlinkedMessages[m].id
            let node = chart.nodes[nodeKeys[i]]
            node.id = unmatchedId
            chart.nodes[unmatchedId] = node
            delete chart.nodes[nodeKeys[i]]
          }
        }
      }
    }
  }

  updatePortPositions (chart) {
    let nodes = chart.nodes
    let nodeKeys = Object.keys(nodes)
    for (let i = 0; i < nodeKeys.length; i++) {
      let nodeKey = nodeKeys[i]
      let portKeys = Object.keys(nodes[nodeKey].ports)
      for (let j = 0; j < portKeys.length; j++) {
        let portKey = portKeys[j]
        if (chart.nodes[nodeKey].ports[portKey].type !== 'left') {
          chart.nodes[nodeKey].ports[portKey].position.x = 261 + 12
        }
      }
    }
  }

  updateChart (chartValue) {
    //this.getElements()
    let prevChart = cloneDeep(this.state.chart)
    console.log('previous chart', prevChart)
    let newChart = chartValue(this.state.chart)
    this.updatePortPositions(newChart)
    this.getElements()
    this.fixInvalidNodes(newChart)
    console.log('chart updated', newChart)
    let linksKeys = Object.keys(newChart.links)
    if (linksKeys.length > Object.keys(prevChart.links).length) {
      this.linkAdded = true
    }
    console.log('linkAdded', this.linkAdded)
    console.log(linksKeys)
    if (this.linkAdded) {
      if (
        newChart.links[linksKeys[linksKeys.length - 1]] &&
        newChart.links[linksKeys[linksKeys.length - 1]].to && 
        newChart.links[linksKeys[linksKeys.length - 1]].to.nodeId &&
        newChart.links[linksKeys[linksKeys.length - 1]].from &&
        newChart.links[linksKeys[linksKeys.length - 1]].from.portId &&
        newChart.links[linksKeys[linksKeys.length - 1]].from.nodeId
      ) {
        console.log('updating chart link added', this.props)
        // debugger;
        if (newChart.links[linksKeys[linksKeys.length - 1]].from.portId === 'port0') {
          let temp = cloneDeep(newChart.links[linksKeys[linksKeys.length - 1]].from)
          newChart.links[linksKeys[linksKeys.length - 1]].from = newChart.links[linksKeys[linksKeys.length - 1]].to
          newChart.links[linksKeys[linksKeys.length - 1]].to = temp
        }
        let toComponentId = newChart.links[linksKeys[linksKeys.length - 1]].to.nodeId
        let fromComponentId = newChart.links[linksKeys[linksKeys.length - 1]].from.nodeId
        let fromButtonId = newChart.links[linksKeys[linksKeys.length - 1]].from.portId
        let toIndex = this.props.unlinkedMessages.findIndex((m) => m.id.toString() === toComponentId.toString())
        let fromIndex = this.props.linkedMessages.findIndex((m) => m.id.toString() === fromComponentId.toString())
  
        if (fromIndex > -1 && toIndex > -1) {
          let addPayload = [this.props.unlinkedMessages[toIndex].id]
          this.updateButtonPayload(fromButtonId, this.props.unlinkedMessages[toIndex].id)
          for (let i = 0; i < addPayload.length; i++) {
            let messageIndex = this.props.unlinkedMessages.findIndex(m => m.id === addPayload[i])
            let message = this.props.unlinkedMessages[messageIndex]
            for (let j = 0; j < message.messageContent.length; j++) {
              let messageContent = message.messageContent[j]
              if (messageContent.buttons) {
                for (let k = 0; k < messageContent.buttons.length; k++) {
                  let button = messageContent.buttons[k]
                  let payload = JSON.parse(button.payload)
                  if (payload.blockUniqueId) {
                    addPayload.push(payload.blockUniqueId)
                  }
                }
              }
            }
            this.props.linkedMessages.push(this.props.unlinkedMessages[messageIndex])
            this.props.unlinkedMessages.splice(messageIndex, 1)
          }
        } else if (toIndex > -1) {
          fromIndex = this.props.unlinkedMessages.findIndex((m) => m.id.toString() === fromComponentId.toString())
          this.updateButtonPayload(fromButtonId, this.props.unlinkedMessages[toIndex].id)
        }
        console.log('messages updated', this.props) 
        this.linkAdded = false
      }
    }
    console.log('newChart', newChart)
    this.setState({
      chart: newChart,
      prevChart
    })
  }

  updateButtonPayload (buttonId, blockUniqueId) {
    console.log('updateButtonPayload', this.props)
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
          this.deleteButtonPayload(toComponentId)

          let index = this.props.linkedMessages.findIndex((lm) => lm.id.toString() === toComponentId.toString())
          if (index > -1) {
            let deletePayload = [this.props.linkedMessages[index].id]
            for (let i = 0; i < deletePayload.length; i++) {
              let messageIndex = this.props.linkedMessages.findIndex(m => m.id === deletePayload[i])
              let message = this.props.linkedMessages[messageIndex]
              for (let j = 0; j < message.messageContent.length; j++) {
                let messageContent = message.messageContent[j]
                if (messageContent.buttons) {
                  for (let k = 0; k < messageContent.buttons.length; k++) {
                    // debugger;
                    let button = messageContent.buttons[k]
                    let payload = JSON.parse(button.payload)
                    if (payload && payload.blockUniqueId) {
                      deletePayload.push(payload.blockUniqueId)
                    }
                  }
                }
              }
              this.props.unlinkedMessages.push(this.props.linkedMessages[messageIndex])
              this.props.linkedMessages.splice(messageIndex, 1)
            }
          }
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
            if (buttonPayload && buttonPayload.blockUniqueId.toString() === blockUniqueId.toString()) {
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
            if (buttonPayload && buttonPayload.blockUniqueId.toString() === blockUniqueId.toString()) {
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
            <div>
              {this.getTooltips()}
            </div>
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
