import React from 'react'
import PropTypes from 'prop-types'

class SessionsAreaHead extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      filter: false,
      searchValue: ''
    }
    this.handleSearch = this.handleSearch.bind(this)
  }

  handleSearch (e) {
    let data = {
      first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter: true,
      filter_criteria: {
        search_value: e.target.value,
        sort_value: -1
      }
    }
    this.setState({searchValue: e.target.value.toLowerCase(), filter: true})
    this.props.fetchSessions(data)
    this.props.updateState(data)
  }

  render () {
    return (
      <div className='m-portlet__head'>
        <div style={{paddingTop: '20px'}} className='row'>
          <div className='col-md-10'>
            <div className='m-input-icon m-input-icon--left'>
              <input type='text' onChange={this.handleSearch} className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' />
              <span className='m-input-icon__icon m-input-icon__icon--left'>
                <span><i className='la la-search' /></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SessionsAreaHead.propTypes = {
  'sessions': PropTypes.array.isRequired,
  'fetchSessions': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired
}

export default SessionsAreaHead
