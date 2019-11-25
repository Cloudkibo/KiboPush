import React from "react"
import PropTypes from 'prop-types'
import SIDEBARITEM from './sidebarItem'
import { REACT_FLOW_CHART } from "@mrblenny/react-flow-chart"

class Sidebar extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    this.onDragMessageBlock = this.onDragMessageBlock.bind(this)
    this.onDragActionBlock = this.onDragActionBlock.bind(this)
  }

  componentDidMount () {
    document.addEventListener('drop', function (event) {
      let data = event.dataTransfer.getData(REACT_FLOW_CHART)
      console.log('REACT_FLOW_CHART', data)
    })
  }

  onDragMessageBlock (event) {
    let id = new Date().getTime() + Math.floor(Math.random() * 100)
    let data = {
      id,
      title: 'Message Block',
      messageContent: []
    }
    this.props.unlinkedMessages.push(data)
    let chartData = {
      type: 'component_block',
      ports: {
        port1: {
          id: 'port1',
          type: 'input'
        }
      },
      properties: {
        id
      }
    }
    event.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify(chartData))
  }

  onDragActionBlock (event) {
    let id = new Date().getTime() + Math.floor(Math.random() * 100)
    let chartData = {
      type: 'action_block',
      ports: {
        port1: {
          id: 'port1',
          type: 'input'
        }
      },
      properties: {
        id
      }
    }
    event.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify(chartData))
  }

  render () {
    return (
      <div className='card'>
        <div style={{background: '#716aca', color: 'white'}} className='card-header'>
          <h6 style={{lineHeight: 1.5}}>
            Drag and drop items to add
          </h6>
        </div>
        <div style={{padding: '0px', border: '1px solid #716aca'}} className='card-body'>
          <SIDEBARITEM
            name='Message Block'
            type='component_block'
            onDrag={this.onDragMessageBlock}
          />
          <SIDEBARITEM
            name='Actions Block'
            type='action_block'
            onDrag={this.onDragActionBlock}
          />
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  'unlinkedMessages': PropTypes.array.isRequired
}

export default Sidebar
