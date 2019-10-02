/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
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
        browserHistory.push({
            pathname: `/editMessageCodeMessage`,
            state: { module: this.props.module, selectedMessengerCode: this.props.messengerCode }
        })
    }
    render() {
        return (
            <div className= 'row'>
                    <div className='col-md-6 col-lg-6 col-sm-6'>
                        <div className='form-group m-form__group'>
                            <span>Opt-In Message: </span>
                            <div className='menuDiv m-input-icon m-input-icon--right' style={{ marginTop: '10px' }}>
                                <input onClick={this.editMessage} readonly type='text' className='form-control m-input menuInput' value='Opt-In Message' />
                                <a className='btn btn-circle btn-icon-only btn-default m-input-icon__icon m-input-icon__icon--right' title='Edit Message' onClick={this.editMessage} href='javascript:;'>
                                    <i className='fa fa-edit' />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-lg-6 col-sm-6'>
                        <Preview />
                    </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OptInActions)
