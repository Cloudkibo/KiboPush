import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import swal from 'sweetalert2'

class ErrorMessage extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.state = {
      }
      this.show = this.show.bind(this)

    }
    show () {
        swal({
          type: 'error',
          title: 'Oops...',
          text: `Something went wrong!`,
          confirmButtonColor: '#337ab7'
        }).then((value) => {
          this.props.history.push({
            pathname: `/dashboard`
          })
        })
      }
    render () {
        return (
            <div style={{height: 100 + 'vh', margin: '25px 300px', width: '100%'}}>
            <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{boxShadow: '0px 0px 30px 0px #ccc'}}>
            {this.show()}
            </div>
            </div>
        )}


}
export default ErrorMessage
