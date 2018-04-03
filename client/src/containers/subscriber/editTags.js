import React from 'react'
import { deleteTag, renameTag, loadTags } from '../../redux/actions/tags.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

class EditTags extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      editTag: '',
      tags: [],
      renameValue: ''
    }
    props.loadTags()
    this.editTag = this.editTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.changeTag = this.changeTag.bind(this)
    this.saveTag = this.saveTag.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.resetTag = this.resetTag.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.tags) {
      this.setState({
        tags: nextProps.tags
      })
    }
  }
  resetTag () {
    this.setState({
      renameValue: '',
      editTag: ''
    })
  }
  editTag (id, name) {
    this.setState({
      renameValue: name,
      editTag: id
    })
  }
  deleteTag (id) {
    this.props.deleteTag(id, this.msg)
  }
  changeTag (e, tagId) {
    this.setState({
      renameValue: e.target.value
    })
  }
  saveTag (tagId) {
    var payload = {'tagId': tagId, 'tagName': this.state.renameValue}
    this.props.renameTag(payload, this.msg, this.handleEdit)
  }
  handleEdit () {
    this.resetTag()
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (
      <div className='row'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <h3 style={{marginLeft: '20px', marginBottom: '20px'}}>View Tags</h3>
        { this.props.tags && this.props.tags.length > 0
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
                  style={{height: '53px'}}>
                  <th data-field='title'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                    <span style={{width: '300px'}}>Tags</span>
                  </th>
                  <th data-field='actions'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                    <span style={{width: '200px', marginLeft: '115px'}}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='m-datatable__body'>
                {
                  this.state.tags.map((tag, i) => (
                    <tr data-row={i}
                      className='m-datatable__row m-datatable__row--even'
                      style={{height: '55px'}} key={i}>
                      <td data-field='title'
                        className='m-datatable__cell'>
                        { tag._id === this.state.editTag
                         ? <input id='tagName' className='form-control m-input'
                           type='text'
                           value={this.state.renameValue}
                           placeholder={tag.tag}
                           onChange={(e) => this.changeTag(e, tag._id)}
                           />
                         : <span
                           style={{width: '300px'}}>{tag.tag}</span>
                         }
                      </td>
                      <td data-field='actions'
                        className='m-datatable__cell'>
                        { tag._id !== this.state.editTag
                         ? <span className='pull-right'
                           style={{width: '200px'}}>
                           <button className='btn btn-primary btn-sm'
                             style={{float: 'left', margin: 2}}
                             onClick={() => this.editTag(tag._id, tag.tag)}>
                             Edit
                          </button>
                           <button className='btn btn-primary btn-sm'
                             style={{float: 'left', margin: 2}}
                             onClick={() => this.deleteTag(tag._id)}>
                             Delete
                           </button>
                         </span>
                        : <span className='pull-right'
                          style={{width: '200px'}}>
                          { this.state.renameValue !== '' && <button className='btn btn-primary btn-sm'
                            style={{float: 'left', margin: 2}}
                            onClick={() => this.saveTag(tag._id)}>
                            Save
                           </button>
                          }
                          { this.state.renameValue === '' && <button className='btn btn-primary btn-sm'
                            style={{float: 'left', margin: 2}}
                            disabled>
                            Save
                           </button>
                          }
                          <button className='btn btn-primary btn-sm'
                            style={{float: 'left', margin: 2}}
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
    )
  }
}
function mapStateToProps (state) {
  return {
    tags: (state.tagsInfo.tags)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    deleteTag: deleteTag,
    loadTags: loadTags,
    renameTag: renameTag},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditTags)
