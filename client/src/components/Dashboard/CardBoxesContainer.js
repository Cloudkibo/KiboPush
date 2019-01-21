/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import CardBox from './CardBox'
import { Link } from 'react-router'

/* card box style must be any of these
  band
  success
  danger
  accent
 */

class CardBoxesContainer extends React.Component {
  render () {
    const url = window.location.hostname
    return (
      <div className='col-xl-12'>
        <div className='row m-row--full-height'>
          <div className='col-sm-3 col-md-3 col-lg-3' title='Total pages on Facebook'>
            <Link to='/addPages' >
              <CardBox
                style='brand'
                value={this.props.data.totalPages ? this.props.data.totalPages : 0}
                label='Total Pages'
              />
            </Link>
          </div>
          <div className='col-sm-3 col-md-3 col-lg-3' title='Total pages connected to KiboPush'>
            <Link to='/addPages' >
              <CardBox
                style='success'
                value={this.props.data.pages ? this.props.data.pages : 0}
                label='Connected Pages'
              />
            </Link>
          </div>
          <div className='col-sm-3 col-md-3 col-lg-3' title='Total Subscribers'>
            <CardBox
              style='danger'
              value={this.props.data.subscribers ? this.props.data.subscribers : 0}
              label='Subscribers'
            />
          </div>
          <div className='col-sm-3 col-md-3 col-lg-3' title={url.includes('kibochat.cloudkibo.com') ? 'New Messages' : 'No.of Sequences Created'}>
            <CardBox
              style='accent'
              value={url.includes('kibochat.cloudkibo.com') ? (this.props.data.unreadCount ? this.props.data.unreadCount : 0) : (this.props.data.sequences ? this.props.data.sequences : 0)}
              label={url.includes('kibochat.cloudkibo.com') ? 'New Messages' : 'Sequences'}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default CardBoxesContainer
