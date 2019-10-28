import React from 'react'
import {loadCategoriesList, addCategory, deleteCategory, editCategory} from '../../redux/actions/templates.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'

class Category extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadCategoriesList()
    this.state = {
      isShowingModalDelete: false,
      deleteid: '',
      editid: '',
      editName: '',
      isShowingModalCreate: false,
      isShowingModalEdit: false
    }
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogCreate = this.showDialogCreate.bind(this)
    this.closeDialogCreate = this.closeDialogCreate.bind(this)
    this.showDialogEdit = this.showDialogEdit.bind(this)
    this.closeDialogEdit = this.closeDialogEdit.bind(this)
    this.exists = this.exists.bind(this)
    this.saveCategory = this.saveCategory.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.editCategory = this.editCategory.bind(this)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Categories`;
  }

  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }
  showDialogCreate (id) {
    this.setState({isShowingModalCreate: true})
    //  this.setState({deleteid: id})
  }

  closeDialogCreate () {
    this.setState({isShowingModalCreate: false})
  }
  showDialogEdit (category) {
    this.setState({isShowingModalEdit: true})
    this.setState({editid: category._id, editName: category.name})
  }

  closeDialogEdit () {
    this.setState({isShowingModalEdit: false})
  }
  exists (newCategory) {
    for (let i = 0; i < this.props.categories.length; i++) {
      if (this.props.categories[i].name.toLowerCase() === newCategory.toLowerCase()) {
        return true
      }
    }
    return false
  }
  saveCategory () {
    if (this.refs.newCategory.value) {
      if (this.exists(this.refs.newCategory.value) === false) {
        let payload = {name: this.refs.newCategory.value}
        this.props.addCategory(payload, this.msg)
        this.props.loadCategoriesList()
      } else {
        this.msg.error('Category already exists')
      }
    } else {
      this.msg.error('Please enter a category')
    }
  }
  updateCategory (e) {
    this.setState({editName: e.target.value})
  }
  editCategory () {
    if (this.exists(this.state.editName) === false) {
      this.props.editCategory({_id: this.state.editid, name: this.state.editName}, this.msg)
    } else {
      this.msg.error('Category already exists')
    }
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper' style={{height: 'fit-content'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Categories
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialogCreate}>
                      <span>
                        <i className='la la-plus' />
                        <span>
                          Add New
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-xl-8 order-2 order-xl-1' />
                    <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                      {/*
                        this.state.isShowingModalCreate &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialogCreate}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialogCreate}>
                            <h3>Add Category</h3>
                            <input className='form-control'
                              placeholder='Enter category' ref='newCategory' />
                            <br />
                            <button style={{float: 'right'}}
                              className='btn btn-primary btn-sm'
                              onClick={() => {
                                this.closeDialogCreate()
                                this.saveCategory()
                              }}>Save
                            </button>
                          </ModalDialog>
                        </ModalContainer>
                      */}
                      {/*
                        this.state.isShowingModalEdit &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialogEdit}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialogEdit}>
                            <h3>Edit Category</h3>
                            <input className='form-control'
                              value={this.state.editName} onChange={(e) => this.updateCategory(e)} />
                            <br />
                            <button style={{float: 'right'}}
                              className='btn btn-primary btn-sm'
                              onClick={() => {
                                this.closeDialogEdit()
                                this.editCategory()
                              }}>Save
                            </button>
                          </ModalDialog>
                        </ModalContainer>
                      */}
                      {/*
                        this.state.isShowingModalDelete &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialogDelete}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialogDelete}>
                            <h3>Delete Category</h3>
                            <p>Are you sure you want to delete this category?</p>
                            <button style={{float: 'right'}}
                              className='btn btn-primary btn-sm'
                              onClick={() => {
                                this.props.deleteCategory(this.state.deleteid, this.msg)
                                this.closeDialogDelete()
                              }}>Delete
                            </button>
                          </ModalDialog>
                        </ModalContainer>
                      */}
                    </div>
                  </div>
                  { this.props.categories && this.props.categories.length > 0
                  ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                    <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                      <table className='m-datatable__table'
                        id='m-datatable--27866229129' style={{
                          display: 'block',
                          height: 'auto',
                          overflowX: 'auto'
                        }}>
                        <thead className='m-datatable__head'>
                          <tr className='m-datatable__row'
                            style={{height: '53px'}}>
                            <th data-field='title'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '150px'}}>Category Name</span>
                            </th>
                            <th data-field='seemore'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '170px'}} />
                            </th>
                          </tr>
                        </thead>
                        <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                          {
                            this.props.categories.map((category, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='title'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>{category.name}</span></td>
                                { this.props.user.isSuperUser
                                    ? <td data-field='seemore'
                                      className='m-datatable__cell'>
                                      <span className='pull-right'
                                        style={{width: '170px'}}>
                                        <button className='btn btn-primary btn-sm'
                                          style={{float: 'left', margin: 2}}
                                          onClick={() => this.showDialogEdit(category)}>
                                        Edit
                                    </button>
                                        <button className='btn btn-primary btn-sm'
                                          style={{float: 'left', margin: 2}}
                                          onClick={() => this.showDialogDelete(category._id)}>
                                        Delete
                                    </button>
                                      </span></td>
                            : <td data-field='seemore'
                              className='m-datatable__cell'>
                              { !category.createdBySuperUser &&
                                <span className='pull-right'
                                  style={{width: '170px'}}>
                                  <button className='btn btn-primary btn-sm'
                                    style={{float: 'left', margin: 2}}
                                    onClick={() => this.showDialogEdit(category)}>
                                   Edit
                                 </button>
                                  <button className='btn btn-primary btn-sm'
                                    style={{float: 'left', margin: 2}}
                                    onClick={() => this.showDialogDelete(category._id)}>
                                Delete
                                </button>
                                </span>
                             }
                            </td>
                            }
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                : <div className='table-responsive'>
                  <p> No data to display </p>
                </div>
              }
                  <div style={{'overflow': 'auto'}}>
                    <Link to='/templates' className='btn btn-primary btn-sm' style={{ float: 'right', margin: '20px' }}>Back
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    categories: state.templatesInfo.categories
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadCategoriesList: loadCategoriesList,
      addCategory: addCategory,
      deleteCategory: deleteCategory,
      editCategory: editCategory
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Category)
