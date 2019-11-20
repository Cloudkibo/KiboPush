import React from "react"
// import PropTypes from 'prop-types'
import ACTIONSAREA from './actionsArea'

class ActionBlock extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{border: '1px solid #ccc', margin: '0px', borderRadius: '4px'}} className="m-portlet m-portlet--creative m-portlet--bordered-semi">
        <div className="m-portlet__head">
          <div className="m-portlet__head-caption">
            <div className="m-portlet__head-title">
              <h2
                style={{
                  width: '200px',
                  marginLeft: '-30px',
                  background: '#ccc',
                  boxShadow: 'none'
                }}
                className="m-portlet__head-label"
              >
                <span style={{textAlign: 'center'}}>
                  <i className="flaticon-interface-9"></i> Action Block
                </span>
              </h2>
            </div>
          </div>
        </div>
        <div style={{marginTop: '-35px'}} className="m-portlet__body">
          <ACTIONSAREA />
        </div>
      </div>
    )
  }
}

ActionBlock.propTypes = {

}

export default ActionBlock
