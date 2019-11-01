import React from 'react'
import { deleteTag, renameTag, loadTags } from '../../redux/actions/tags.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
class EditTags extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      editTag: '',
      tags: this.props.currentTags,
      renameValue: '',
      showDeleteConfirmation: false,
      deleteTag: ''
    }
    this.editTag = this.editTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.changeTag = this.changeTag.bind(this)
    this.saveTag = this.saveTag.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.resetTag = this.resetTag.bind(this)
    this.openDeleteConfirmation = this.openDeleteConfirmation.bind(this)
    this.closeDeleteConfirmation = this.closeDeleteConfirmation.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.tags) {
      this.setState({
        tags: nextProps.tags
      })
    }
  }
  openDeleteConfirmation(tag) {
    this.setState({
      deleteTag: tag,
      showDeleteConfirmation: true
    })
  }
  closeDeleteConfirmation() {
    this.setState({
      deleteTag: '',
      showDeleteConfirmation: false
    })
  }
  resetTag() {
    this.setState({
      renameValue: '',
      editTag: ''
    })
  }
  editTag(id, name) {
    this.setState({
      renameValue: name,
      editTag: id
    })
  }
  deleteTag(tag) {
    this.props.deleteTag(tag, this.msg, this.props.loadsubscriberData)
  }
  changeTag(e, tagId) {
    this.setState({
      renameValue: e.target.value
    })
  }
  saveTag(tag) {
    var payload = { 'tag': tag, 'newTag': this.state.renameValue }
    this.props.renameTag(payload, this.props.msg, this.handleEdit, this.props.loadsubscriberData)

  }
  handleEdit() {
    this.resetTag()
  }
  render() {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)', zIndex: '999' }} className="modal fade" id="editTag" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  View Tags
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                  </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div className='row'>
                  {this.props.tags && this.props.tags.length > 0
                    ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                      <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table'
                          id='m-datatable--27866229129' style={{
                            display: 'block',
                            height: 'auto',
                            minWidth: '600px'
                          }}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{ height: '53px' }}>
                              <th data-field='title'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '300px' }}>Tags</span>
                              </th>
                              <th data-field='actions'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '200px', marginLeft: '115px' }}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.state.tags.map((tag, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{ height: '55px' }} key={i}>
                                  <td data-field='title'
                                    className='m-datatable__cell'>
                                    {tag._id === this.state.editTag
                                      ? <input id='tagName' className='form-control m-input'
                                        type='text'
                                        value={this.state.renameValue}
                                        placeholder={tag.tag}
                                        onChange={(e) => this.changeTag(e, tag._id)}
                                      />
                                      : <span
                                        style={{ width: '300px' }}>{tag.tag}</span>
                                    }
                                  </td>
                                  <td data-field='actions'
                                    className='m-datatable__cell'>
                                    {tag._id !== this.state.editTag
                                      ? <span className='pull-right'
                                        style={{ width: '200px' }}>
                                        <button className='btn btn-primary btn-sm'
                                          style={{ float: 'left', margin: 2 }}
                                          onClick={() => this.editTag(tag._id, tag.tag)}>
                                          Edit
                                    </button>
                                        <button className='btn btn-primary btn-sm'
                                          style={{ float: 'left', margin: 2 }}
                                          data-toggle="modal" data-target="#deleteTag">
                                          Delete
                                    </button>
                                      </span>
                                      : <span className='pull-right'
                                        style={{ width: '200px' }}>
                                        {this.state.renameValue !== '' && <button className='btn btn-primary btn-sm'
                                          style={{ float: 'left', margin: 2 }}
                                          onClick={() => this.saveTag(tag.tag)}>
                                          Save
                                    </button>
                                        }
                                        {this.state.renameValue === '' && <button className='btn btn-primary btn-sm'
                                          style={{ float: 'left', margin: 2 }}
                                          disabled>
                                          Save
                                    </button>
                                        }
                                        <button className='btn btn-primary btn-sm'
                                          style={{ float: 'left', margin: 2 }}
                                          onClick={() => this.resetTag()}>
                                          Cancel
                                    </button>
                                      </span>
                                    }
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                    : <div className='col-12 table-responsive'>
                      <p> No data to display </p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="deleteTag" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div style={{ width: '400px' }} className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Tag
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                  </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to delete? The tag will be removed and unassigned from all the subscribers.</p>
                <button style={{ float: 'right', marginLeft: '10px' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                      this.deleteTag(this.state.deleteTag)
                  }}
                  data-dismiss="modal" aria-label="Close"
                >Yes
                </button>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  data-dismiss="modal" aria-label="Close"
                >Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    tags: (state.tagsInfo.tags)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteTag: deleteTag,
    loadTags: loadTags,
    renameTag: renameTag
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditTags)
