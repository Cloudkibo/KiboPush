import React from "react"
import PropTypes from 'prop-types'
import COMPONENTSAREA from './componentsArea'

class StartingStep extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div id={`flowBuilderCard-${this.props.currentId}`} style={{borderRadius: '4px', width: '300px'}} className='card' onClick={() => this.props.changeMessage(this.props.currentId)}>
        <div style={{background: '#34bfa3', color: 'white'}} className='card-header'>
          <h6 style={{textAlign: 'center', marginTop: '10px'}}>
            Starting Step
          </h6>
        </div>
        <div style={{border: '1px solid #34bfa3'}} className='card-body'>
          <COMPONENTSAREA
            targetId='starting-step-add-component'
            showAddComponentModal={this.props.showAddComponentModal}
            items={this.props.getItems(this.props.currentId)}
            changeMessage={this.props.changeMessage}
            handleSidePanel={this.props.handleSidePanel}
            sidePanelStyle={{background: '#34bfa3', color: 'white'}}
            currentId={this.props.currentId}
            updateBroadcastData={this.props.updateBroadcastData}
            page={this.props.page}
            activeComponent={this.props.activeComponent}
          />
        </div>
      </div>
    )
  }
}

StartingStep.propTypes = {
  'currentId': PropTypes.number.isRequired,
  'showAddComponentModal': PropTypes.func.isRequired,
  'getComponent': PropTypes.func.isRequired,
  'linkedMessages': PropTypes.array.isRequired,
  'unlinkedMessages': PropTypes.array.isRequired,
  'getItems': PropTypes.func.isRequired,
  'changeMessage': PropTypes.func.isRequired,
  'handleSidePanel': PropTypes.func.isRequired,
  'updateBroadcastData': PropTypes.func.isRequired,
  'page': PropTypes.object.isRequired,
  'activeComponent': PropTypes.number
}

export default StartingStep
