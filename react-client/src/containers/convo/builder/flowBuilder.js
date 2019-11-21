/**
 * Created by sojharo on 20/07/2017.
 */

import React from "react"
import { FlowChartWithState, INodeInnerDefaultProps } from "@mrblenny/react-flow-chart"
// import PropTypes from 'prop-types'
import { chartSimple } from './chartSimple'
import STARTINGSTEP from '../../../components/FlowBuilder/startingStep'
import COMPONENTSBLOCK from '../../../components/FlowBuilder/componentBlock'
import ACTIONBLOCK from '../../../components/FlowBuilder/actionBlock'
import SIDEBAR from '../../../components/FlowBuilder/sidebar'

const NodeInnerCustom = ({ node, config } = INodeInnerDefaultProps) => {
  if (node.type === 'starting_step') {
    return (
      <STARTINGSTEP />
    )
  } else if (node.type === 'component_block') {
    return (
      <COMPONENTSBLOCK />
    )
  } else if (node.type === 'action_block') {
    return (
      <ACTIONBLOCK />
    )
  } else {
    return (
      <div>
        <button>Don't Hit Me</button>
      </div>
    )
  }
}

class FlowBuilder extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className='m-content'>
        <div className='row'>
          <div className='col-9'>
            <FlowChartWithState
              initialValue={chartSimple}
              Components={ {
                NodeInner: NodeInnerCustom
              }}
            />
          </div>
          <div className='col-3'>
            <SIDEBAR />
          </div>
        </div>
      </div>
    )
  }
}

FlowBuilder.propTypes = {

}

export default FlowBuilder
