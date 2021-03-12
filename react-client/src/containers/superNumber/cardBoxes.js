/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import CardBox from '../../components/Dashboard/CardBox'
import { Link } from 'react-router-dom'
import { UncontrolledTooltip } from 'reactstrap'
import PropTypes from 'prop-types'

/* eslint-disable */
class CardBoxes extends React.Component {
  render () {
    return (
      <div className='col-xl-12'>
        <div className='row m-row--full-height'>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='contacts'>
            <span>Number of WhatsApp Subscribers</span>
          </UncontrolledTooltip>
          <div className='col-sm-4 col-md-4 col-lg-4'>
            <Link>
              <CardBox
                style='danger'
                value={this.props.contacts}
                label='Contacts'
                id='contacts'
              />
            </Link>
          </div>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='automated'>
            <span>Number of automated messages sent</span>
          </UncontrolledTooltip>
          <div className='col-sm-4 col-md-4 col-lg-4'>
            <Link>
              <CardBox
                style='accent'
                value={this.props.automatedMessages}
                label='Automated Messages'
                id='automated'
              />
            </Link>
          </div>
          <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='manual'>
            <span>Number of manual messages sent</span>
          </UncontrolledTooltip>
          <div className='col-sm-4 col-md-4 col-lg-4'>
            <Link>
              <CardBox
                style='success'
                value={this.props.manualMessages}
                label='Manual Messages'
                id='manual'
              />
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

CardBoxes.propTypes = {
  'automatedMessages': PropTypes.number.isRequired,
  'manualMessages': PropTypes.number.isRequired,
  'contacts': PropTypes.number.isRequired

}

/* eslint-enable */
export default CardBoxes
