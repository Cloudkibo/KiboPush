import React from 'react'
import PropTypes from 'prop-types'
import BUTTONITEM from '../sidePanel/buttonItem'
import ADDITIONALACTIONS from './additionalActions'
import OPENWEBSITE from './openWebsite'
import OPENWEBVIEW from './openWebview'
import SEQUENCEACTION from './sequenceAction'

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
    this.removeAction = this.removeAction.bind(this)
    this.updateAdditionalActions = this.updateAdditionalActions.bind(this)
  }

  updateAdditionalActions (actionToRemove, actionToAdd) {
    let actions = this.state.additionalActions
    let removeIndex = actions.indexOf(actionToRemove)
    let addIndex = actions.indexOf(actionToAdd)
    actions.splice(removeIndex, 1)
    if (addIndex === -1 && actionToRemove !== actionToAdd) {
      actions.push(actionToAdd)
    }
    this.setState({additionalActions: actions})
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
      case 'Subscribe to Sequence':
        actions.push({type: 'subscribe'})
        this.setState({actions})
        this.props.button.actions = actions
        this.props.button.payload = this.props.button.payload || JSON.stringify([])
        this.props.updateButton(this.props.button, this.props.index)
        break
      case 'Unsubscribe from Sequence':
        actions.push({type: 'unsubscribe'})
        this.setState({actions})
        this.props.button.actions = actions
        this.props.button.payload = this.props.button.payload || JSON.stringify([])
        this.props.updateButton(this.props.button, this.props.index)
        break
      default:
    }
  }

  getButtonAction (action, index) {
    switch (action) {
      case 'open_website':
        return (
          <OPENWEBSITE
            button={this.props.button}
            handleButton={this.handleButton}
            updateButton={this.props.updateButton}
            index={index}
            buttonIndex={this.props.index}
            removeAction={this.removeAction}
          />
        )
      case 'open_webview':
        return (
          <OPENWEBVIEW
            button={this.props.button}
            handleButton={this.handleButton}
            updateButton={this.props.updateButton}
            index={index}
            buttonIndex={this.props.index}
            removeAction={this.removeAction}
            page={this.props.page}
            whitelistedDomains={this.props.whitelistedDomains}
          />
        )
      case 'subscribe':
        return (
          <SEQUENCEACTION
            title='Subscribe to Sequence'
            button={this.props.button}
            action='subscribe'
            handleButton={this.handleButton}
            updateButton={this.props.updateButton}
            index={index}
            buttonIndex={this.props.index}
            removeAction={this.removeAction}
            sequences={this.props.sequences}
          />
        )
      case 'unsubscribe':
        return (
          <SEQUENCEACTION
            title='Unsubscribe from Sequence'
            button={this.props.button}
            action='unsubscribe'
            handleButton={this.handleButton}
            updateButton={this.props.updateButton}
            index={index}
            buttonIndex={this.props.index}
            removeAction={this.removeAction}
            sequences={this.props.sequences}
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

  handleButtonDone (data, callback) {
    let button
    if (data.button) {
      button = data.button
    } else {
      this.setState({buttonAdded: true})
      button = data
    }
    button.actions = this.props.button.actions
    button.id = this.props.button.id
    button.errorMsg = 'Link is valid'
    button.valid = true
    button.loading = false
    if (callback) callback(button)
    this.props.updateButton(button, this.props.index)
  }

  handleButton (addData, editData, callback) {
    if (this.state.buttonAdded) {
      this.props.editButton(editData, (data) => this.handleButtonDone(data, callback), null, this.props.alertMsg)
    } else {
      this.props.insertButton(addData, (data) => this.handleButtonDone(data, callback), this.props.alertMsg)
    }
  }

  removeAction (index, name) {
    let actions = this.state.actions
    let additionalActions = this.state.additionalActions
    let action = actions.splice(index, 1)[0]
    if (!['open_website', 'open_webview'].includes(action)) {
      additionalActions.push(name)
    }
    this.setState({actions, additionalActions})
    this.props.button.actions = actions
    let payload = JSON.parse(this.props.button.payload)
    payload = payload.filter((item) => item.action !== action.type)
    this.props.button.payload = JSON.stringify(payload)
    this.props.updateButton(this.props.button, this.props.index)
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
              this.getButtonAction(action.type, index)
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
              onActionClick={this.onActionClick}
              updateAdditionalActions={this.updateAdditionalActions}
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
  'editButton': PropTypes.func.isRequired,
  'page': PropTypes.object.isRequired,
  'whitelistedDomains': PropTypes.array.isRequired,
  'sequences': PropTypes.array
}

export default ButtonsAction
