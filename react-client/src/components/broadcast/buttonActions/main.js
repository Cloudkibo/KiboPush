import React from 'react'
import PropTypes from 'prop-types'
import BUTTONITEM from '../sidePanel/buttonItem'
import ADDITIONALACTIONS from './additionalActions'
import OPENWEBSITE from './openWebsite'
import OPENWEBVIEW from './openWebview'

class ButtonsAction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: props.button.title,
      type: props.button.type,
      actions: [],
      buttonAdded: (props.button.newUrl || props.button.payload),
      mainActions: props.mainActions,
      additionalActions: props.additionalActions,
      showAdditionalActions: false
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onActionClick = this.onActionClick.bind(this)
    this.getButtonAction = this.getButtonAction.bind(this)
    this.showAdditionalActions = this.showAdditionalActions.bind(this)
    this.toggleAdditionalActions = this.toggleAdditionalActions.bind(this)
    this.handleButton = this.handleButton.bind(this)
    this.handleButtonDone = this.handleButtonDone.bind(this)
  }

  onTitleChange (e) {
    this.setState({title: e.target.value})
    this.props.button.title = e.target.value
    this.props.updateButton(this.props.button, this.props.index)
  }

  onActionClick (action) {
    let actions = this.state.actions
    switch (action) {
      case 'Open a website':
        this.props.button.url = ''
        actions.push({type: 'open_website'})
        this.setState({actions})
        this.props.button.actions = actions
        this.props.updateButton(this.props.button, this.props.index)
        break
      case 'Open a webview':
        this.props.button.url = ''
        this.props.button.webview_height_ratio = 'FULL'
        actions.push({type: 'open_webview'})
        this.setState({actions})
        this.props.button.actions = actions
        this.props.updateButton(this.props.button, this.props.index)
        break
      default:
    }
  }

  getButtonAction (action) {
    switch (action) {
      case 'open_website':
        return (
          <OPENWEBSITE
            button={this.props.button}
            handleButton={this.handleButton}
          />
        )
      case 'open_webview':
        return (
          <OPENWEBVIEW
            button={this.props.button}
            handleButton={this.handleButton}
          />
        )
      default:
        return null
    }
  }

  showAdditionalActions () {
    this.setState({showAdditionalActions: true})
  }

  toggleAdditionalActions () {
    this.setState({showAdditionalActions: !this.state.showAdditionalActions})
  }

  handleButtonDone (data) {
    let button = this.props.button
    if (data.button) {
      button = data.button
    } else {
      this.setState({buttonAdded: true})
      button = data
    }
    this.props.updateButton(button, this.props.index)
  }

  handleButton (addData, editData) {
    if (this.state.buttonAdded) {
      this.props.editButton(editData, this.handleButtonDone, null, this.props.alertMsg)
    } else {
      this.props.insertButton(addData, this.handleButtonDone, this.props.alertMsg)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of button actions side panel called ', nextProps)
    if (nextProps.button) {
      this.setState({
        title: nextProps.button.title,
        type: nextProps.button.type,
        actions: nextProps.button.actions,
        buttonAdded: (nextProps.button.newUrl || nextProps.button.payload),
        mainActions: nextProps.mainActions,
        additionalActions: nextProps.additionalActions
      })
    }
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
            this.state.actions.length > 0 ?
            this.state.actions.map((action, index) => (
              this.getButtonAction(action.type)
            ))
            : this.state.mainActions.map((action, index) => (
              <div key={`button-item-${index}`} style={{border: 'none', marginTop: '10px'}} className='card'>
                <BUTTONITEM
                  title={action}
                  onButtonClick={this.onActionClick}
                />
              </div>
            ))
          }
          {
            ((this.state.actions.length > 0 &&
            !['open_website', 'open_webview'].includes(this.state.actions[0].type)) ||
            this.state.actions.length === 0) &&
            <ADDITIONALACTIONS
              actions={this.state.additionalActions}
              showPopover={this.state.showAdditionalActions}
              togglePopover={this.toggleAdditionalActions}
              target={`additional-actions-${this.props.button.id}`}
            />
          }
          {
            ((this.state.actions.length > 0 &&
            !['open_website', 'open_webview'].includes(this.state.actions[0].type)) ||
            this.state.actions.length === 0) &&
            <button
              id={`additional-actions-${this.props.button.id}`}
              style={{border: 'none', marginTop: '10px', cursor: 'pointer'}}
              className='m-link'
              onClick={this.showAdditionalActions}
            >
              + Additional Actions
            </button>
          }
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
  'updateButton': PropTypes.func.isRequired,
  'insertButton': PropTypes.func.isRequired,
  'editButton': PropTypes.func.isRequired
}

export default ButtonsAction
