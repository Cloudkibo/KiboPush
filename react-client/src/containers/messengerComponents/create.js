import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import YouTube from 'react-youtube'
import { getMessengerComponents } from '../../redux/actions/messengerComponents.actions'
import AlertContainer from 'react-alert'

class Create extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Create Messenger Component`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextProps in messengerComponents', nextProps)
  }

  render() {
    let alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <h3 className='m-portlet__head-text'>
                          Create Messenger Component
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      <ul className='m-portlet__nav'>
                        <li className='m-portlet__nav-item'>
                          <button className='btn btn-secondary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                            onClick={() => {
                              this.props.history.push({
                                pathname: `/createMessengerComponent`
                              })
                            }}>
                            Cancel
                          </button>
                        </li>
                        <li className='m-portlet__nav-item'>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                            onClick={() => {
                              this.props.history.push({
                                pathname: `/createMessengerComponent`
                              })
                            }}>
                            Save
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    messengerComponents: (state.messengerComponentsInfo.messengerComponents)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMessengerComponents
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Create)
