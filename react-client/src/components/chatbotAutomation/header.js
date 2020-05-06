import React from 'react'
import PropTypes from 'prop-types'
import CONFIRMATIONMODAL from '../extras/confirmationModal'

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      waitingForPublish: false,
      waitingForDisable: false,
      title: props.title,
      editTitle: false
    }
    this.onDelete = this.onDelete.bind(this)
    this.afterDelete = this.afterDelete.bind(this)
    this.onDisable = this.onDisable.bind(this)
    this.afterDisable = this.afterDisable.bind(this)
    this.onPublish = this.onPublish.bind(this)
    this.afterPublish = this.afterPublish.bind(this)
    this.onEditTitle = this.onEditTitle.bind(this)
    this.onCancelEdit = this.onCancelEdit.bind(this)
    this.onRename = this.onRename.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
  }

  onDelete () {
    this.props.onDelete(this.afterDelete)
  }

  afterDelete (res) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Step deleted successfully')
    } else {
      this.props.alertMsg.error(res.description)
    }
  }

  onDisable () {
    this.setState({waitingForDisable: true})
    this.props.onDisable(this.afterDisable)
  }

  afterDisable (res) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Bot disbabled successfully')
    } else {
      this.props.alertMsg.error(res.description)
    }
    this.setState({waitingForDisable: false})
  }

  onPublish () {
    this.setState({waitingForPublish: true})
    this.props.onPublish(this.afterPublish)
  }

  afterPublish (res) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Bot published successfully')
    } else {
      this.props.alertMsg.error(res.description)
    }
    this.setState({waitingForPublish: false})
  }

  onEditTitle () {
    this.setState({editTitle: true})
  }

  onCancelEdit () {
    this.setState({
      editTitle: false,
      title: this.props.title
    })
  }

  onRename () {
    const titles = this.props.blocks.map((item) => item.title.toLowerCase())
    if (titles.indexOf(this.state.title.toLowerCase()) > -1) {
      this.props.alertMsg.error('A block with this title already exists. Please choose a diffrent title')
    } else {
      this.setState({editTitle: false}, () => {
        this.props.onRename(this.state.title)
      })
    }
  }

  onTitleChange (e) {
    this.setState({title: e.target.value})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.title) {
      this.setState({
        title: nextProps.title,
        editTitle: false
      })
    }
  }

  render () {
    return (
      <div id='_chatbot_message_area_header' className='row'>
        <div className='col-md-6'>
          {
            this.state.editTitle
            ? <div className='row'>
              <div className='col-md-8'>
                <input
                  id='_chatbot_message_area_header_title_input'
                  style={{color: '#575962'}}
                  className='form-control m-input'
                  type='text'
                  value={this.state.title}
                  onChange={this.onTitleChange}
                />
              </div>
              <div className='col-md-4'>
                <button id='_chatbot_message_area_header_save_title' style={{border: 'none'}} onClick={this.onRename} className="m-portlet__nav-link btn m-btn m-btn--hover-success m-btn--icon m-btn--icon-only m-btn--pill" title="Save">
                  <i className="la la-check" />
                </button>
                <button id='_chatbot_message_area_header_cancel_title' style={{border: 'none'}} onClick={this.onCancelEdit} className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Cancel">
                  <i className="la la-close" />
                </button>
              </div>
            </div>
            : <h3>
              {this.props.title}
              <i
                id='_chatbot_message_area_header_edit_title'
                style={{fontSize: '1.5rem', marginLeft: '10px', cursor: 'pointer'}}
                className='fa fa-pencil-square-o'
                onClick={this.onEditTitle}
              />
            </h3>
          }
        </div>
        <div className='col-md-6'>
          {
            this.props.isPublished
            ? <button
              id='_chatbot_message_area_header_disable'
              style={{marginLeft: '10px'}}
              type='button'
              className={`pull-right btn btn-danger m-btn m-btn--icon ${this.state.waitingForDisable && 'm-loader m-loader--light m-loader--left'}`}
              onClick={this.onDisable}
            >
              <span>
                {
                  !this.state.waitingForDisable &&
                  <i className='fa flaticon-close' />
                }
                <span>Disable</span>
              </span>
            </button>
            : <button
              id='_chatbot_message_area_header_publish'
              style={{marginLeft: '10px'}}
              type='button'
              className={`pull-right btn btn-success m-btn m-btn--icon ${this.state.waitingForPublish && 'm-loader m-loader--light m-loader--left'}`}
              onClick={this.onPublish}
              disabled={!this.props.canPublish}
            >
              <span>
                {
                  !this.state.waitingForPublish &&
                  <i className='fa flaticon-paper-plane' />
                }
                <span>Publish</span>
              </span>
            </button>
          }
          <button
            id='_chatbot_message_area_header_test'
            style={{marginLeft: '10px'}}
            type='button'
            className='btn btn-primary pull-right m-btn m-btn--icon'
            onClick={this.props.onTest}
            disabled={!this.props.canTest}
          >
            <span>
              <i className='fa flaticon-chat-1' />
              <span>Test</span>
            </span>
          </button>
          {
            this.props.showDelete &&
            <button
              id='_chatbot_message_area_header_delete'
              style={{marginLeft: '10px'}}
              type='button'
              className='pull-right btn btn-primary'
              onClick={() => this.refs._delete_message_block.click()}
            >
              Delete Step
            </button>
          }
        </div>
        <button style={{display: 'none'}} ref='_delete_message_block' data-toggle='modal' data-target='#_cb_ma_delete_mb' />
        <CONFIRMATIONMODAL
          id='_cb_ma_delete_mb'
          title='Delete Step'
          description='Are you sure you want to delete this step?'
          onConfirm={this.onDelete}
        />
      </div>
    )
  }
}

Header.propTypes = {
  'title': PropTypes.string.isRequired,
  'showDelete': PropTypes.bool.isRequired,
  'onDelete': PropTypes.func.isRequired,
  'onTest': PropTypes.func.isRequired,
  'canTest': PropTypes.bool.isRequired,
  'canPublish': PropTypes.bool.isRequired,
  'onPublish': PropTypes.func.isRequired,
  'onDisable': PropTypes.func.isRequired,
  'isPublished': PropTypes.bool.isRequired,
  'blocks': PropTypes.array.isRequired
}

export default Header
