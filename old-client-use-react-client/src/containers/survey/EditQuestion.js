/* eslint-disable no-undef */
/** @jsx React.DOM */

var React = require('react')

var typeLabels = {
  yes_no: 'Yes / No',
  multiple_choice: 'Multiple Choice',
  essay: 'Essay'
}

var EditQuestion = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    onRemove: React.PropTypes.func.isRequired
  },

  getTypeLabel: function () {
    return typeLabels[this.props.type]
  },

  render: function () {
    /* var className = 'edit-question well well-active' +
      (this.props.className || '') */

    return (
      <div className='edit-question well well-active'>
        <div className='type'>
          Question
          <a className='remove' onClick={this.handleRemove}>
            <span className='glyphicon glyphicon-remove' />
          </a>
        </div>
        <div className='form-group'>
          <input className='form-control' placeholder='Enter form title here' />
        </div>

      </div>
    )
  },

  handleRemove: function () {
    if (confirm(
        'Are you sure you want to delete this ' + this.getTypeLabel())) {
      this.props.onRemove(this.props.key)
    }
  }
})

module.exports = EditQuestion
