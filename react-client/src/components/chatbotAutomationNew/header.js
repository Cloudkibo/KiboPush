import React from 'react'
import PropTypes from 'prop-types'
import CONFIRMATIONMODAL from '../extras/confirmationModal'
import MODAL from '../extras/modal'

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      waitingForPublish: false,
      waitingForDisable: false,
      title: props.title,
      editTitle: false,
      childTitle: ''
    }
    this.onDelete = this.onDelete.bind(this)
    this.afterDelete = this.afterDelete.bind(this)
    this.onEditTitle = this.onEditTitle.bind(this)
    this.onCancelEdit = this.onCancelEdit.bind(this)
    this.onRename = this.onRename.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.getAddChildModalContent = this.getAddChildModalContent.bind(this)
    this.onAddChild = this.onAddChild.bind(this)
    this.onChildTitleChange = this.onChildTitleChange.bind(this)
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

  getAddChildModalContent () {
    return (
      <div className='row'>
        <div className='col-md-9'>
          <div className="form-group m-form__group">
            <input
              ref={(input) => {this._cb_ma_add_child_input = input}}
              type='text'
              className="form-control m-input"
              placeholder="Enter title..."
              value={this.state.childTitle}
              onChange={this.onChildTitleChange}
            />
          </div>
        </div>
        <div className='col-md-3'>
          <button
            type='button'
            className='btn btn-primary'
            disabled={!this.state.childTitle}
            onClick={this.onAddChild}
          >
            Add
          </button>
        </div>
      </div>
    )
  }

  onAddChild () {
    this.props.onAddChild(this.state.childTitle)
    this.refs._add_child.click()
  }

  onChildTitleChange (e) {
    if (e.target.value.length <= 20) {
      this.setState({childTitle: e.target.value})
    }
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
          <button
            style={{marginLeft: '10px'}}
            type='button'
            className='pull-right btn btn-primary'
            onClick={() => {
              this.refs._add_child.click()
              setTimeout(() => {this._cb_ma_add_child_input.focus()}, 500)
            }}
          >
            Add Child
          </button>
          <button
            id='_chatbot_message_area_header_delete'
            style={{marginLeft: '10px'}}
            type='button'
            className='pull-right btn btn-primary'
            onClick={() => this.refs._delete_message_block.click()}
          >
            Delete
          </button>
        </div>
        <button style={{display: 'none'}} ref='_delete_message_block' data-toggle='modal' data-target='#_cb_ma_delete_mb' />
        <CONFIRMATIONMODAL
          id='_cb_ma_delete_mb'
          title='Delete Step'
          description='Are you sure you want to delete this step?'
          onConfirm={this.onDelete}
        />
        <button style={{display: 'none'}} ref='_add_child' data-toggle='modal' data-target='#_cb_ma_add_child' />
        <MODAL
          id='_cb_ma_add_child'
          title='Add Child'
          content={this.getAddChildModalContent()}
        />
      </div>
    )
  }
}

Header.propTypes = {
  'title': PropTypes.string.isRequired,
  'onDelete': PropTypes.func.isRequired,
  'onRename': PropTypes.func.isRequired,
  'blocks': PropTypes.array.isRequired,
  'onAddChild': PropTypes.func.isRequired
}

export default Header
