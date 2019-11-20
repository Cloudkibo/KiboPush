/**
 * Created by sojharo on 20/07/2017.
 */

import React from "react"
import { FlowChartWithState, INodeInnerDefaultProps } from "@mrblenny/react-flow-chart"
// import PropTypes from 'prop-types'
import { chartSimple } from './chartSimple'
import STARTINGSTEP from '../../../components/FlowBuilder/startingStep'

const NodeInnerCustom = ({ node, config } = INodeInnerDefaultProps) => {
  if (node.type === 'starting_step') {
    return (
      <STARTINGSTEP />
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
        <FlowChartWithState
          initialValue={chartSimple}
          Components={ {
            NodeInner: NodeInnerCustom
          }}
        />
      </div>
    )
  }
}

FlowBuilder.propTypes = {

}

export default FlowBuilder
