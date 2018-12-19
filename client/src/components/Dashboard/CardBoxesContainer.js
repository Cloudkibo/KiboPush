/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import CardBox from './CardBox'

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
          <div className='col-sm-3 col-md-3 col-lg-3'>
            <CardBox
              style='brand'
              value={this.props.data.totalPages ? this.props.data.totalPages : 0}
              label='Total Pages'
            />
          </div>
          <div className='col-sm-3 col-md-3 col-lg-3'>
            <CardBox
              style='success'
              value={this.props.data.pages ? this.props.data.pages : 0}
              label='Connected Pages'
            />
          </div>
          <div className='col-sm-3 col-md-3 col-lg-3'>
            <CardBox
              style='danger'
              value={this.props.data.subscribers ? this.props.data.subscribers : 0}
              label='Subscribers'
            />
          </div>
          <div className='col-sm-3 col-md-3 col-lg-3'>
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
