import React from 'react'
import PropTypes from 'prop-types'
import BUTTONITEM from '../sidePanel/buttonItem'
import ADDITIONALACTIONS from './additionalActions'

class ButtonsAction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: props.button.title,
      type: props.button.type,
      payload: [],
      mainActions: props.mainActions,
      additionalActions: props.additionalActions,
      showAdditionalActions: false
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.showAdditionalActions = this.showAdditionalActions.bind(this)
    this.toggleAdditionalActions = this.toggleAdditionalActions.bind(this)
  }

  onTitleChange (e) {
    this.setState({title: e.target.value})
    this.props.button.title = e.target.value
    this.props.updateButton(this.props.button, this.props.index)
  }

  showAdditionalActions () {
    this.setState({showAdditionalActions: true})
  }

  toggleAdditionalActions () {
    this.setState({showAdditionalActions: !this.state.showAdditionalActions})
  }

  render () {
    console.log('props in buttons action side panel', this.props)
    return (
      <div key={`button-action-${this.props.index}`} style={{marginTop: '10px'}} className='card'>
        <div style={{cursor: 'pointer', padding: '5px 5px 0px 0px'}}>
          <i onClick={() => {this.props.removeButton(this.props.index)}} className="la la-close pull-right" />
        </div>
        <div className='card-body'>
          <div className="form-group m-form__group row">
            <span className="col-2 col-form-label">
              Title:
            </span>
            <div className="col-10">
              <input
                className="form-control m-input"
                type="text"
                value={this.state.title}
                onChange={this.onTitleChange}
              />
            </div>
          </div>
          <div className="form-group m-form__group row">
            <span className="col-4 col-form-label">
              Actions:
            </span>
          </div>
          {
            this.state.mainActions.map((action, index) => (
              <div key={`button-item-${index}`} style={{border: 'none', marginTop: '10px'}} className='card'>
                <BUTTONITEM
                  title={action}
                  onButtonClick={() => {}}
                />
              </div>
            ))
          }
          <ADDITIONALACTIONS
            actions={this.state.additionalActions}
            showPopover={this.state.showAdditionalActions}
            togglePopover={this.toggleAdditionalActions}
            target={`additional-actions-${this.props.button.id}`}
          />
          <button
            id={`additional-actions-${this.props.button.id}`}
            style={{border: 'none', marginTop: '10px', cursor: 'pointer'}}
            className='m-link'
            onClick={this.showAdditionalActions}
          >
            + Additional Actions
          </button>
        </div>
      </div>
    )
  }
}

ButtonsAction.propTypes = {
  'button': PropTypes.object.isRequired,
  'index': PropTypes.number.isRequired,
  'mainActions': PropTypes.array.isRequired,
  'additionalActions': PropTypes.array.isRequired,
  'removeButton': PropTypes.func.isRequired,
  'updateButton': PropTypes.func.isRequired
}

export default ButtonsAction
