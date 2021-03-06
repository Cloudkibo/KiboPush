import React from 'react'
import PropTypes from 'prop-types'
import CONFIRMATIONMODAL from '../extras/confirmationModal'

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      title: props.title,
      editTitle: false
    }
    this.onDelete = this.onDelete.bind(this)
    this.afterDelete = this.afterDelete.bind(this)
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
    let error = ''
    if (this.state.title) {
    const titles = this.props.blocks.map((item) => item.title.toLowerCase())
    if (titles.indexOf(this.state.title.toLowerCase()) > -1) {
      this.props.alertMsg.error('A block with this title already exists. Please choose a diffrent title')
    } else {
      this.setState({editTitle: false}, () => {
        this.props.onRename(this.state.title)
      })
    }
   } else {
      error = 'Title can not be empty.'
   }
   if (error) {
    this.props.alertMsg.error(error)
  }
}

  onTitleChange (e) {
    const str = e.target.value
    if ((str.split(' ').join('').length > 0 || str.length === 0) && str.length <= 20) {
      this.setState({title: e.target.value})
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
      <div id='_chatbot_message_area_header' style={{flex: '0 0 auto'}} className='m-portlet__head'>
        <div className='m-portlet__head-caption'>
          <div className='row'>
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
                id='_chatbot_message_area_header_delete'
                style={{marginLeft: '10px'}}
                type='button'
                className='pull-right btn btn-primary'
                onClick={() => this.refs._delete_message_block.click()}
                disabled={!this.props.canDelete}
              >
                Delete
              </button>
            </div>
            <button style={{display: 'none'}} ref='_delete_message_block' data-toggle='modal' data-target='#_cb_ma_delete_mb' />
            <CONFIRMATIONMODAL
              id='_cb_ma_delete_mb'
              title='Delete Step'
              description='Deleting this step will delete all its children (if any) as well. Are you sure you want to delete this step?'
              onConfirm={this.onDelete}
            />
          </div>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  'title': PropTypes.string.isRequired,
  'onDelete': PropTypes.func.isRequired,
  'blocks': PropTypes.array.isRequired,
  'canDelete': PropTypes.bool.isRequired
}

export default Header
