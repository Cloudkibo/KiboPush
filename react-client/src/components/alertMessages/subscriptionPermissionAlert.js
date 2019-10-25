/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { connect } from 'react-redux'

class SubscriptionPermissionAlert extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      pages: []
    }
  }
  componentDidMount() {
    let pages = []
    if (this.props.pages) {
      for (let i = 0; i < this.props.pages.length; i++) {
        if (!this.props.pages[i].gotPageSubscriptionPermission) {
          pages.push(this.props.pages[i])
        }
      }
      this.setState({ pages: pages })
    }
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.pages !== this.props.pages) {
      let pages = []
      if (nextProps.pages) {
        for (let i = 0; i < nextProps.pages.length; i++) {
          if (!nextProps.pages[i].gotPageSubscriptionPermission) {
            pages.push(nextProps.pages[i])
          }
        }
        this.setState({ pages: pages })
      }
    }

  }
  render() {
    if (this.state.pages.length > 0) {
      return (
        <div className='alert alert-danger alert-dismissible fade show' role='alert' style={{ marginBottom: '-0.17rem' }}>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="subscriptionPermission" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Subscription Messaging Policy Change
									</h5>
                  <button style={{ marginTop: '-20px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                  <p> Here is the Page Level Subscription Permission status for your page(s):</p>
                  {this.props.pages.map((page, i) => (
                    <span>
                      <span>
                        <img alt='pic' style={{ height: '30px' }} src={(page.pagePic) ? page.pagePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} />&nbsp;&nbsp;
                        <span>{page.pageName}</span>&nbsp;&nbsp;&nbsp;
                        {page.gotPageSubscriptionPermission
                          ? <span className='m-badge m-badge--wide m-badge--success'>Granted</span>
                          : <span className='m-badge m-badge--wide m-badge--danger'>Not Granted</span>
                        }
                      </span>
                      <br /><br />
                    </span>
                  ))}
                <p>This means that outside of the 24 hour window, you will not be able to send subscription messages to subscribers of those pages that have not been granted this permission. Please click <a href='https://kibopush.com/2019/08/02/facebook-subscription-messaging-policy-change/' target='_blank' onClick={this.closeModal}>Here</a> to know how you can apply for this permission.</p>
                </div>
              </div>
            </div>
          </div>
          <button type='button' className='close' data-dismiss='alert' aria-label='Close' style={{ marginTop: '-0.5rem' }}></button>
          <strong style={{ fontWeight: 'bold' }}>
            Attention!
          </strong>&nbsp;
          As per the New Facebook Policy, you will not be able to send messages to your subscribers! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button data-toggle="modal" data-target="#subscriptionPermission" type='button' className='btn btn-sm btn-secondary'>View More</button>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps(state) {
  return {
    pages: (state.pagesInfo.pages)
  }
}

export default connect(mapStateToProps, null)(SubscriptionPermissionAlert)
