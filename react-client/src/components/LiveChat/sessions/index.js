import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './header'

class Sessions extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <div className='col-xl-4'>
        <div className='m-portlet m-portlet--full-height'>
          <HEADER
              pages={this.props.pages ? this.props.pages : []}
              removeFilters={this.props.removeFilters}
              updateFilterSort={this.props.updateFilterSort}
              updateFilterPage={this.props.updateFilterPage}
              updateFilterSearch={this.props.updateFilterSearch}
              updateFilterPending={this.props.updateFilterPending}
              updateFilterUnread={this.props.updateFilterUnread}
              filterSort={this.props.filterSort}
              filterPage={this.props.filterPage}
              filterSearch={this.props.filterSearch}
              filterPending={this.props.filterPending}
              filterUnread={this.props.filterUnread}
          />
        </div>
      </div>
    )
  }
}

Sessions.propTypes = {
  'sessions': PropTypes.array.isRequired,
  'sessionsCount': PropTypes.number.isRequired,
  'tabValue': PropTypes.string.isRequired
}

export default Sessions
