import React from "react"
import PropTypes from 'prop-types'
import SIDEBARITEM from './sidebarItem'
import { REACT_FLOW_CHART } from "@mrblenny/react-flow-chart"
import { UncontrolledTooltip } from 'reactstrap'

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
    console.log('onDragMessageBlock event', event)
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
        port0: {
          id: 'port0',
          type: 'left',
          properties: {
            custom: 'property'
          }
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
      <div id='flowBuilderHeader' style={{maxWidth: '100vw'}}>

        <UncontrolledTooltip placement='bottom' target='add-block'>
          <span>Drag and drop to add</span>
        </UncontrolledTooltip>

        <UncontrolledTooltip placement='bottom' target='zoom-in'>
          <span>Zoom In</span>
        </UncontrolledTooltip>

        <UncontrolledTooltip placement='bottom' target='zoom-out'>
          <span>Zoom Out</span>
        </UncontrolledTooltip>

        <UncontrolledTooltip placement='bottom' target='reset'>
          <span>Reset</span>
        </UncontrolledTooltip>

        <UncontrolledTooltip placement='bottom' target='expand'>
          <span>{this.props.fullScreen ? 'Compress' : 'Expand'}</span>
        </UncontrolledTooltip>

        <div style={{marginBottom: '0px', border: '1px solid #ccc'}} class="m-portlet m-portlet--tabs col-md-12">
          <div style={{padding: '0px', height: '4rem'}} class="m-portlet__head">
            <div class="m-portlet__head-caption m--font-boldest">
              <SIDEBARITEM
                name='Add New Message Block'
                onDrag={this.onDragMessageBlock}
              />
              <div className='pull-right'>
                <i
                  style={{margin: '7px', fontSize: '1.5rem', cursor: 'pointer'}}
                  className='fa fa-search-plus'
                  id='zoom-in'
                  onClick={() => this.props.zoomIn(0.1)}
                />
                <i
                  style={{margin: '7px', fontSize: '1.5rem', cursor: 'pointer'}}
                  className='fa fa-search-minus'
                  id='zoom-out'
                  onClick={() => this.props.zoomOut(0.1)}
                />
                <i
                  style={{margin: '7px', fontSize: '1.5rem', cursor: 'pointer'}}
                  className='fa fa-undo'
                  id='reset'
                  onClick={this.props.resetTransform}
                />
                <i
                  style={{margin: '7px', fontSize: '1.5rem', cursor: 'pointer'}}
                  className={this.props.fullScreen ? 'fa fa-compress' : 'fa fa-expand'}
                  id='expand'
                  onClick={this.props.toggleFullScreen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  'unlinkedMessages': PropTypes.array.isRequired,
  'toggleFullScreen': PropTypes.func.isRequired,
  'fullScreen': PropTypes.bool.isRequired,
  'zoomIn': PropTypes.func.isRequired,
  'zoomOut': PropTypes.func.isRequired,
  'resetTarget': PropTypes.func.isRequired
}

export default Sidebar
