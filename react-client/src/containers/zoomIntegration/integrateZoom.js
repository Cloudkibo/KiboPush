import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { integrateZoom } from '../../redux/actions/settings.actions'

class IntegrateZoom extends Component {
  constructor (props, context) {
    super(props, context)
    this.state={}
  }

  componentDidMount () {
    this.props.integrateZoom()
  }

  render () {
    return (
      <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div>
          <div className="m-loader" style={{width: "30px", display: "inline-block"}} />
          <span>Loading...</span>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    integrateZoom
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(IntegrateZoom)
