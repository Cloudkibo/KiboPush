/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateWidget } from '../../redux/actions/overlayWidgets.actions'
import JSSNIPPET from './jsSnippet'


class SetUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      setupModal: false
    }
    this.openSetup = this.openSetup.bind(this)
   
  }

  componentDidMount () {
  }

  openSetup () {
    this.setState({
      setupModal: true
    })
    this.refs.setupModal.click()
  }

  render () {
    return (
      <div className='row' style={{minHeight: '450px'}}>

         <a href='#/' style={{ display: 'none' }} ref='setupModal' data-toggle="modal" data-target="#setupModal">setupModal</a>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="setupModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content" style={{width: '500px'}}>
                <div style={{ display: 'block' }} className="modal-header">
                    <h5 className='modal-title' id='exampleModalLabel'>
                      Setup
                    </h5>
                    <button style={{opacity: '0.5' }} type='button' className='close' data-dismiss='modal' aria-label='Close' onClick={() => {
                      this.setState({
                        setupModal: false
                      })
                    }}>
                      <span aria-hidden='true'>
                        &times;
                      </span>
                    </button>
                </div>
                <div style={{ minHeight: '350px', overflowX: 'hidden', overflowY: 'scroll' }} className='m-scrollable modal-body' data-scrollbar-shown='true' data-scrollable='true' data-max-height='200'>
                { this.state.setupModal && 
                  <JSSNIPPET domains={this.props.whitelistDomains} fbPageId={this.props.pages.filter((page) => page._id === this.props.currentWidget.pageId)[0].pageId}/>
                }
                  </div>
              </div>
            </div>
          </div>
        <div style={{textAlign: 'center', width: '100%'}}>
          <button className='btn btn-primary' style={{width: '100%'}} onClick={this.openSetup}>Install JavaScript Snippet</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    currentWidget: (state.overlayWidgetsInfo.currentWidget),
    pages: (state.pagesInfo.pages),
    whitelistDomains: (state.settingsInfo.whitelistDomains)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateWidget: updateWidget
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SetUp)
