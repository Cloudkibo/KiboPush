import React from 'react'
import PropTypes from 'prop-types'
import RECORDS from './records'

class Preview extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{justifyContent: 'center'}} className='row'>
        <RECORDS
          id='_show_invalid_records'
          title='Invalid Records'
          data={this.props.invalidRecords}
          dataCount={this.props.invalidCount}
          removeAll={true}
          showCountBadge={true}
          badgeClass='danger'
          updateContact={this.props.updateContact}
          deleteContact={this.props.deleteContact}
          onRemoveAll={this.props.deleteAllInvalidContacts}
          alertMsg={this.props.alertMsg}
        />
        <RECORDS
          id='_show_valid_records'
          title='Valid Records'
          data={this.props.validRecords}
          dataCount={this.props.validCount}
          removeAll={false}
          showCountBadge={true}
          badgeClass='success'
          updateContact={this.props.updateContact}
          deleteContact={this.props.deleteContact}
          alertMsg={this.props.alertMsg}
        />
      </div>
    )
  }
}

Preview.propTypes = {
  'validRecords': PropTypes.array.isRequired,
  'invalidRecords': PropTypes.array.isRequired,
  'updateContact': PropTypes.func.isRequired,
  'validCount': PropTypes.number.isRequired,
  'invalidCount': PropTypes.number.isRequired,
  'deleteContact': PropTypes.func.isRequired,
  'deleteAllInvalidContacts': PropTypes.func.isRequired
}

export default Preview
