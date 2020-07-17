import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { integrateZoom } from '../../redux/actions/settings.actions'

class IntegrateZoom extends Component {
  constructor (props, context) {
    super(props, context)
    this.state={}
    this.redirectToAuthorizeZoom = this.redirectToAuthorizeZoom.bind(this)
  }

  componentDidMount () {
    this.props.integrateZoom(this.redirectToAuthorizeZoom)
  }

  redirectToAuthorizeZoom (url) {
    window.location.replace(url)
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
