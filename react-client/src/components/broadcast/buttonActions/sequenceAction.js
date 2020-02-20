import React from 'react'
import PropTypes from 'prop-types'

class SequenceAction extends React.Component {
  constructor(props) {
    super(props)
    const payload = JSON.parse(props.button.payload).filter((item) => item.action === props.action)
    this.state = {
      sequenceId: payload.length > 0 ? payload[0].sequenceId : ''
    }
    this.handleSequenceChange = this.handleSequenceChange.bind(this)
  }

  handleSequenceChange (e) {
    this.setState({sequenceId: e.target.value})
    this.props.button.payload = JSON.parse(this.props.button.payload)
    this.props.button.payload.push({
      action: this.props.title === 'Subscribe to Sequence' ? 'subscribe' : 'unsubscribe',
      sequenceId: e.target.value
    })
    const data = {
      id: this.props.button.id,
      type: 'postback',
      title: this.props.button.title,
      payload: JSON.stringify(this.props.button.payload)
    }
    this.props.button.payload = JSON.stringify(this.props.button.payload)
    this.props.handleButton(data, data)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of sequence action side panel called ', nextProps)
    if (nextProps.button) {
      const payload = JSON.parse(nextProps.button.payload).filter((item) => item.action === nextProps.action)
      this.setState({sequenceId: payload.length > 0 ? payload[0].sequenceId : ''})
    }
  }

  render () {
    console.log('props in sequence action side panel', this.props)
    return (
      <div style={{marginBottom: '10px'}} className='card'>
        <div className='card-header'>
          <span>
            {this.props.title}
          </span>
          <span onClick={() => {this.props.removeAction(this.props.index, this.props.title)}} style={{cursor: 'pointer'}} class="pull-right">
            <i className="la la-close"></i>
          </span>
        </div>
        <div className='card-body'>
          <div className='form-group m-form__group'>
            <select className='form-control m-input' value={this.state.sequenceId} onChange={this.handleSequenceChange}>
              <option disabled value=''>Select a Sequence</option>
              {
                this.props.sequences.map((sequence) => (
                  <option key={sequence.sequence._id} value={sequence.sequence._id}>{sequence.sequence.name}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>
    )
  }
}

SequenceAction.propTypes = {
  'button': PropTypes.object.isRequired,
  'index': PropTypes.number.isRequired,
  'removeAction': PropTypes.func.isRequired,
  'handleButton': PropTypes.func.isRequired,
  'updateButton': PropTypes.func.isRequired,
  'buttonIndex': PropTypes.number.isRequired,
  'title': PropTypes.string.isRequired
}

export default SequenceAction
