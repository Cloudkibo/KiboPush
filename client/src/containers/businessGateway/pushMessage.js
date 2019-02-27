import React from 'react'
import { Link } from 'react-router'
import Files from 'react-files'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Select from 'react-select'
import AlertContainer from 'react-alert'
import Papa from 'papaparse'

class PushMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
  }
  render () {
      return (<h1>  broadcast page</h1> )
  }

}
function mapStateToProps (state) {
    console.log('in mapStateToProps', state)
    return {
      pages: state.pagesInfo.pages
    }
  }
export default connect(mapStateToProps)(PushMessage)
