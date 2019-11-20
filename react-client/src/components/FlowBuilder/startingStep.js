import React from "react"
// import PropTypes from 'prop-types'
import COMPONENTSAREA from './componentsArea'

class StartingStep extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{border: '1px solid #34bfa3', margin: '0px', borderRadius: '4px'}} className="m-portlet m-portlet--creative m-portlet--bordered-semi">
        <div className="m-portlet__head">
          <div className="m-portlet__head-caption">
            <div className="m-portlet__head-title">
              <h2 className="m-portlet__head-label m-portlet__head-label--success">
                <span>
                  Starting Step
                </span>
              </h2>
            </div>
          </div>
        </div>
        <div className="m-portlet__body">
          <COMPONENTSAREA />
        </div>
      </div>
    )
  }
}

StartingStep.propTypes = {

}

export default StartingStep
