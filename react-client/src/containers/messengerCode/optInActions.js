/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
//  import Select from 'react-select'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Preview from './preview'

class OptInActions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.editMessage = this.editMessage.bind(this)
    }
    componentDidMount() {

    }
    editMessage() {
      if (this.props.onEditMessage) {
          this.props.onEditMessage() 
      }
      let initialFiles = this.props.initialFiles
      if (this.props.newFiles) {
          initialFiles = initialFiles.concat(this.props.newFiles)
      }
      this.props.history.push({
          pathname: `/editMessageCodeMessage`,
          state: { newFiles: this.props.newFiles, initialFiles, realInitialFiles: this.props.initialFiles, module: this.props.module, selectedMessengerCode: this.props.messengerCode }
      })
    }
    render() {
      console.log('optInActions props', this.props)
        return (
            <div className= 'row'>
                    <div className='col-md-6 col-lg-6 col-sm-6'>
                        <div className='form-group m-form__group'>
                            <span>Opt-In Message: </span>
                            <div className='menuDiv m-input-icon m-input-icon--right' style={{ marginTop: '10px' }}>
                                <input readOnly type='text' className='form-control m-input menuInput' value='Opt-In Message' />
                                <button className='btn btn-circle btn-icon-only btn-default m-input-icon__icon m-input-icon__icon--right' title='Edit Message' onClick={this.editMessage} href='#/'>
                                    <i className='fa fa-edit' />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-lg-6 col-sm-6'>
                        <Preview history={this.props.history} location={this.props.location} />
                    </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        messengerCode: state.messengerCodeInfo.messengerCode,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OptInActions)
