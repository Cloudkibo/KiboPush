import React from 'react'
import PropTypes from 'prop-types'

class RecordItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      edit: false,
      name: props.data.name,
      number: props.data.number,
      oldNumber: '',
      loading: false
    }
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onNumberChange = this.onNumberChange.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.handleOnSave = this.handleOnSave.bind(this)
  }

  onEdit () {
    this.setState({
      edit: true,
      oldNumber: this.state.number
    }, () => {
      this.refs._phoneNumber.focus()
    })
  }

  onSave () {
    // eslint-disable-next-line
    const regexp = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
    if (regexp.test(this.state.number)) {
      this.setState({loading: true})
      this.props.updateContact(
        {
          name: this.state.name,
          number: this.state.number,
          oldNumber: this.state.oldNumber,
          wasInvalid: (this.props.data.status === 'Invalid')
        },
        this.handleOnSave
      )
    } else {
      this.props.alertMsg.error('Please enter a valid number of format E.164')
    }
  }

  onCancel () {
    this.setState({edit: false, name: this.props.data.name, number: this.props.data.number})
  }

  onDelete () {
    this.props.deleteContact(this.props.data)
  }

  onNameChange (e) {
    this.setState({name: e.target.value})
  }

  onNumberChange (e) {
    this.setState({number: e.target.value})
  }

  handleOnSave (res) {
    if (res.status === 'success') {
      this.setState({edit: false, loading: false})
      this.props.alertMsg.success('Record updated successfully!')
    } else {
      this.setState({loading: false})
      this.props.alertMsg.error(res.description)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.data) {
      this.setState({name: nextProps.data.name, number: nextProps.data.number})
    }
  }

  render () {
    return (
      <tr data-row={this.props.index} className="m-datatable__row m-datatable__row--even" style={{height: '88px'}}>
        <td data-field="Name" style={{width: '150px'}} className="m-datatable__cell m-datatable__cell--center">
          <span>
            <input
              style={{
                border: !this.state.edit && 'none',
                color: '#575962',
                textAlign: 'center',
                background: !this.state.edit && 'none',
                boxShadow: !this.state.edit && 'none'
              }}
              className='form-control m-input'
              type='text'
              value={this.state.name}
              onChange={this.onNameChange}
              readOnly={!this.state.edit}
            />
          </span>
        </td>
        <td data-field="PhoneNumber" style={{width: '150px'}} className="m-datatable__cell m-datatable__cell--center">
          <span>
            <input
              style={{
                border: !this.state.edit && 'none',
                color: '#575962',
                textAlign: 'center',
                background: !this.state.edit && 'none',
                boxShadow:  !this.state.edit && 'none'
              }}
              className='form-control m-input'
              type='text'
              ref='_phoneNumber'
              value={this.state.number}
              onChange={this.onNumberChange}
              readOnly={!this.state.edit}
            />
          </span>
        </td>
        <td data-field="Status" style={{width: '100px'}} className="m-datatable__cell m-datatable__cell--center">
          <span>
            <input
              style={{
                border: 'none',
                color: '#575962',
                textAlign: 'center',
                background: 'none',
                boxShadow: 'none'
              }}
              className='form-control m-input'
              type='text'
              value={this.props.data.status}
              readOnly
            />
          </span>
        </td>
        <td data-field="Actions" style={{width: '150px'}} className="m-datatable__cell m-datatable__cell--center">
          {
            this.state.edit
            ? <span>
              <button style={{border: 'none'}} onClick={this.onSave} className="m-portlet__nav-link btn m-btn m-btn--hover-success m-btn--icon m-btn--icon-only m-btn--pill" title="Save">
                {
                  this.state.loading
                  ? <div className="m-loader" style={{width: "30px"}} />
                  : <i className="la la-check" />
                }
              </button>
              <button style={{border: 'none'}} onClick={this.onCancel} className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Cancel">
                <i className="la la-close" />
              </button>
            </span>
            : <span>
              <button style={{border: 'none'}} onClick={this.onEdit} className="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit">
                <i className="la la-edit" />
              </button>
              <button style={{border: 'none'}} onClick={this.onDelete} className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">
                <i className="la la-trash" />
              </button>
            </span>
          }
        </td>
      </tr>
    )
  }
}

RecordItem.propTypes = {
  'data': PropTypes.object.isRequired,
  'index': PropTypes.number.isRequired,
  'updateContact': PropTypes.func.isRequired
}

export default RecordItem
