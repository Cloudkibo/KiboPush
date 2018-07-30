/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { createBroadcast, editBroadcast, loadCategoriesList, addCategory, deleteCategory } from '../../redux/actions/templates.actions'
import { bindActionCreators } from 'redux'
import Image from '../convo/Image'
import List from '../convo/List'
import Video from '../convo/Video'
import Audio from '../convo/Audio'
import File from '../convo/File'
import Text from '../convo/Text'
import Card from '../convo/Card'
import Gallery from '../convo/Gallery'
import Media from '../convo/Media'
import { validateFields } from '../convo/utility'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'
import {onClickText, onImageClick, onAudioClick, onVideoClick} from '../menu/utility'

class CreateBroadcastTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadCategoriesList()
    this.state = {
      list: [],
      broadcast: [],
      isShowingModal: false,
      convoTitle: props.template ? props.template.title : 'Broadcast Title',
      showAddCategoryDialog: false,
      categoryValue: []
    }
    this.initializeCategorySelect = this.initializeCategorySelect.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleList = this.handleList.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.handleMedia = this.handleMedia.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.newConvo = this.newConvo.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
    this.showResetAlertDialog = this.showResetAlertDialog.bind(this)
    this.closeResetAlertDialog = this.closeResetAlertDialog.bind(this)
    this.showAddCategoryDialog = this.showAddCategoryDialog.bind(this)
    this.closeAddCategoryDialog = this.closeAddCategoryDialog.bind(this)
    this.saveCategory = this.saveCategory.bind(this)
    this.createBroadcastTemplate = this.createBroadcastTemplate.bind(this)
    this.editBroadcastTemplate = this.editBroadcastTemplate.bind(this)
  }

  componentDidMount () {
    document.title = 'KiboPush | Create Broadcast Template'
    if (this.props.template) {
      var temp = this.state.list
      for (var i = 0; i < this.props.template.payload.length; i++) {
        if (this.props.template.payload[i].componentType === 'text') {
          temp.push({content: (<Text id={this.props.template.payload[i].id} key={this.props.template.payload[i].id} buttons={this.props.template.payload[i].buttons} txt={this.props.template.payload[i].text} handleText={this.handleText} onRemove={this.removeComponent} removeState />)})
        } else if (this.props.template.payload[i].componentType === 'image') {
          temp.push({content: (<Image id={this.props.template.payload[i].id} key={this.props.template.payload[i].id} image={this.props.template.payload[i].image_url} handleImage={this.handleImage} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'card') {
          temp.push({content: (<Card id={this.props.template.payload[i].id} key={this.props.template.payload[i].id} buttons={this.props.template.payload[i].buttons} img={this.props.template.payload[i].image_url} title={this.props.template.payload[i].title} subtitle={this.props.template.payload[i].description} handleCard={this.handleCard} onRemove={this.removeComponent} singleCard />)})
        } else if (this.props.template.payload[i].componentType === 'gallery') {
          temp.push({content: (<Gallery id={this.props.template.payload[i].id} key={this.props.template.payload[i].id} cards={this.props.template.payload[i].cards} handleGallery={this.handleGallery} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'audio') {
          temp.push({content: (<Audio id={this.props.template.payload[i].id} key={this.props.template.payload[i].id} file={this.props.template.payload[i]} handleFile={this.handleFile} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'video') {
          temp.push({content: (<Video id={this.props.template.payload[i].id} key={this.props.template.payload[i].id} file={this.props.template.payload[i]} handleFile={this.handleFile} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'file') {
          temp.push({content: (<File id={this.props.template.payload[i].id} key={this.props.template.payload[i].id} file={this.props.template.payload[i]} handleFile={this.handleFile} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'list') {
          temp.push({content: (<List id={this.props.template.payload[i].id} key={this.props.template.payload[i].id} list={this.props.template.payload[i]} cards={this.props.template.payload[i].listItems} handleList={this.handleList} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'media') {
          temp.push({content: (<Media id={this.props.template.payload[i].id} key={this.props.template.payload[i].id} handleMedia={this.handleMedia} onRemove={this.removeComponent} media={this.props.template.payload[i]} />)})
        }
      }
      var options = this.state.categoryValue
      for (var j = 0; j < this.props.template.category.length; j++) {
        options.push({id: j, text: this.props.template.category[j], selected: true})
      }
      this.setState({broadcast: this.props.template.payload, list: temp, categoryValue: this.props.template.category})
      this.initializeCategorySelect(options)
    }
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.categories) {
      let options = []
      for (var i = 0; i < nextprops.categories.length; i++) {
        options[i] = {id: nextprops.categories[i]._id, text: nextprops.categories[i].name}
      }
      this.initializeCategorySelect(options)
    }
  }

  initializeCategorySelect (categoryOptions) {
    var self = this
    /* eslint-disable */
    $('#selectCategory').select2({
      /* eslint-enable */
      data: categoryOptions,
      placeholder: 'Select Category',
      allowClear: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectCategory').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].label
          selected.push(selectedOption)
        }
        self.setState({ categoryValue: selected })
      }
    })
  }

  showAddCategoryDialog () {
    this.setState({showAddCategoryDialog: true})
  }

  closeAddCategoryDialog () {
    this.setState({showAddCategoryDialog: false})
  }

  showResetAlertDialog () {
    if (this.state.broadcast.length > 0 || this.state.list.length > 0) {
      this.setState({isShowingModalResetAlert: true})
    }
  }

  closeResetAlertDialog () {
    this.setState({isShowingModalResetAlert: false})
  }
  saveCategory () {
    if (this.refs.newCategory.value) {
      if (!this.exists(this.refs.newCategory.value)) {
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

  exists (newCategory) {
    for (let i = 0; i < this.props.categories.length; i++) {
      if (this.props.categories[i].name.toLowerCase().includes(newCategory.toLowerCase())) {
        return true
      }
    }
    return false
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  renameTitle () {
    if (this.titleConvo.value === '') {
      return
    }
    this.setState({convoTitle: this.titleConvo.value})
    this.closeDialog()
  }

  handleText (obj) {
    console.log('handleText')
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].text = obj.text
        if (obj.button.length > 0) {
          temp[i].buttons = obj.button
        }
        isPresent = true
      }
    })

    if (!isPresent) {
      if (obj.button.length > 0) {
        temp.push({id: obj.id, text: obj.text, componentType: 'text', buttons: obj.button})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text'})
      }
    }

    this.setState({broadcast: temp})
  }

  handleCard (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].fileurl = obj.fileurl
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].title = obj.title
        temp[i].buttons = obj.buttons
        temp[i].description = obj.description
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
  }
  handleMedia (obj) {
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
        return
      }
      if (obj.error === 'file size error') {
        this.msg.error('File size cannot exceed 25MB')
        return
      }
      if (obj.error === 'invalid file') {
        this.msg.error('File is not valid')
        return
      }
    }
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].mediaType = obj.mediaType
        temp[i].fileurl = obj.fileurl
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].buttons = obj.buttons
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
  }
  handleGallery (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    obj.cards.forEach((d) => {
      delete d.id
    })
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].cards = obj.cards
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
  }

  handleImage (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
  }

  handleFile (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
  }
  handleList (obj) {
    console.log('in create convo handleList', obj)
    console.log('in create convo handleList', this.state.broadcast)
    var temp = this.state.broadcast
    var isPresent = false
    obj.listItems.forEach((d) => {
      delete d.id
    })
    temp.map((data) => {
      if (data.id === obj.id) {
        data.listItems = obj.listItems
        data.topElementStyle = obj.topElementStyle
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    console.log('temp', temp)
    this.setState({broadcast: temp})
  }

  removeComponent (obj) {
    console.log('in Remove component')
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    this.setState({list: temp, broadcast: temp2})
  }

  newConvo () {
    this.setState({broadcast: [], list: []})
  }

  createBroadcastTemplate () {
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    if (this.state.categoryValue.length > 0) {
      var broadcastTemplate = {
        title: this.state.convoTitle,
        category: this.state.categoryValue,
        payload: this.state.broadcast
      }
      this.props.createBroadcast(broadcastTemplate, this.msg)
      this.setState({broadcast: [], list: []})
    } else {
      this.msg.error('Please select a category')
    }
  }

  editBroadcastTemplate () {
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    if (this.state.categoryValue.length > 0) {
      var broadcastTemplate = {
        _id: this.props.template._id,
        title: this.state.convoTitle,
        category: this.state.categoryValue,
        payload: this.state.broadcast
      }
      this.props.editBroadcast(broadcastTemplate, this.msg)
    } else {
      this.msg.error('Please select a category')
    }
  }

  // onClickText (timeStamp){
  //   console.log('in on click text' + timeStamp)
    
  //   let temp = this.state.list
  //   console.log('temp' +  JSON.stringify(temp))
  //   this.msg.info('New Text Component Added')
  //   this.setState({ list: [...temp, { content: (<Text id={timeStamp} key={timeStamp} handleText={this.handleText} onRemove={this.removeComponent} />) }] })
  //   this.handleText({id: timeStamp, text: '', button: []})
  // }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    let timeStamp = new Date().getTime()
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding how to create template broadcasts? Here is the <a href='http://kibopush.com/broadcasts/' target='_blank'>documentation</a>.
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {this.props.template
                        ? 'Edit Broadcast Template'
                        : 'Create Broadcast Template'
                        }
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-12'>
                      <div className='row'>
                        <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                          <div className='row' >
                            <div className='col-3'>
                              <div className='ui-block hoverbordercomponent' id='text' onClick={() => { onClickText(timeStamp, this) }} >
                                <div className='align-center'>
                                  <img src='icons/text.png' alt='Text' style={{maxHeight: 25}} />
                                  <h6>Text</h6>
                                </div>
                              </div>
                            </div>
                            <div className='col-3'>
                              <div className='ui-block hoverbordercomponent' onClick={() => { onImageClick(timeStamp, this) }}>
                                <div className='align-center'>
                                  <img src='icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                                  <h6>Image</h6>
                                </div>
                              </div>
                            </div>
                            <div className='col-3'>
                              <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, {content: (<Card id={timeStamp} key={timeStamp} handleCard={this.handleCard} onRemove={this.removeComponent} singleCard />)}]}); this.handleCard({id: timeStamp, componentType: 'card', title: '', description: '', fileurl: '', buttons: []}) }}>
                                <div className='align-center'>
                                  <img src='icons/card.png' alt='Card' style={{maxHeight: 25}} />
                                  <h6>Card</h6>
                                </div>
                              </div>
                            </div>
                            <div className='col-3'>
                              <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({list: [...temp, {content: (<Gallery id={timeStamp} key={timeStamp} handleGallery={this.handleGallery} onRemove={this.removeComponent} />)}]}); this.handleGallery({id: timeStamp, componentType: 'gallery', cards: []}) }}>
                                <div className='align-center'>
                                  <img src='icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                                  <h6>Gallery</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-3'>
                              <div className='ui-block hoverbordercomponent' onClick={() => { onAudioClick(timeStamp, this) }}>
                                <div className='align-center'>
                                  <img src='icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                                  <h6>Audio</h6>
                                </div>
                              </div>
                            </div>
                            <div className='col-3'>
                              <div className='ui-block hoverbordercomponent' onClick={() => { onVideoClick(timeStamp, this) }}>
                                <div className='align-center'>
                                  <img src='icons/video.png' alt='Video' style={{maxHeight: 25}} />
                                  <h6>Video</h6>
                                </div>
                              </div>
                            </div>
                            <div className='col-3'>
                              <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({list: [...temp, {content: (<File id={timeStamp} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}); this.handleFile({id: timeStamp, componentType: 'file', fileurl: ''}) }}>
                                <div className='align-center'>
                                  <img src='icons/file.png' alt='File' style={{maxHeight: 25}} />
                                  <h6>File</h6>
                                </div>
                              </div>
                            </div>
                            <div className='col-3'>
                              <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New List Component Added'); this.setState({list: [...temp, {content: (<List id={timeStamp} key={timeStamp} handleList={this.handleList} onRemove={this.removeComponent} />)}]}); this.handleList({id: timeStamp, componentType: 'list', listItems: [], topElementStyle: 'compact'}) }}>
                                <div className='align-center'>
                                  <img src='icons/list.png' alt='List' style={{maxHeight: 25}} />
                                  <h6>List</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-3'>
                              <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Media Component Added'); this.setState({list: [...temp, {content: (<Media id={timeStamp} key={timeStamp} handleMedia={this.handleMedia} onRemove={this.removeComponent} />)}]}); this.handleMedia({id: timeStamp, componentType: 'media', fileurl: '', buttons: []}) }}>
                                <div className='align-center'>
                                  <img src='icons/media.png' alt='Media' style={{maxHeight: 25}} />
                                  <h6>Media</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-12' style={{paddingTop: '20px'}}>
                              <label>Category</label>
                            </div>
                            <div className='col-md-10'>
                              <select id='selectCategory' />
                            </div>
                            <div className='col-md-2'>
                              <button onClick={this.showAddCategoryDialog} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' style={{marginLeft: '-90px'}}>
                                Add category
                              </button>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-12' style={{paddingTop: '50px'}}>
                              <button onClick={this.showResetAlertDialog} style={{marginRight: '10px'}} className='btn btn-primary'>Reset</button>
                              {
                                this.props.template
                                ? <button style={{marginRight: '10px'}} id='send' onClick={this.editBroadcastTemplate} className='btn btn-primary' disabled={(this.state.broadcast.length === 0)}> Update </button>
                                : <button style={{marginRight: '10px'}} id='send' onClick={this.createBroadcastTemplate} className='btn btn-primary' disabled={(this.state.broadcast.length === 0)}> Create </button>
                              }
                              <Link to='/templates' className='btn btn-secondary'>Back</Link>
                            </div>
                          </div>
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                          <StickyDiv offsetTop={70} zIndex={1}>
                            <div style={{border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea'}} className='ui-block'>
                              <div style={{padding: '5px'}}>
                                <h3>{this.state.convoTitle} <i onClick={this.showDialog} id='convoTitle' style={{cursor: 'pointer'}} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
                              </div>
                            </div>
                          </StickyDiv>
                          {
                            this.state.isShowingModalResetAlert &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeResetAlertDialog}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeResetAlertDialog}>
                                <p>Are you sure you want to reset the message ?</p>
                                <button style={{float: 'right', marginLeft: '10px'}}
                                  className='btn btn-primary btn-sm'
                                  onClick={() => {
                                    this.newConvo()
                                    this.closeResetAlertDialog()
                                  }}>Yes
                                </button>
                                <button style={{float: 'right'}}
                                  className='btn btn-primary btn-sm'
                                  onClick={() => {
                                    this.closeResetAlertDialog()
                                  }}>Cancel
                                </button>
                              </ModalDialog>
                            </ModalContainer>
                          }
                          {
                            this.state.isShowingModal &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialog}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialog}>
                                <h3>Rename:</h3>
                                <input style={{maxWidth: '300px', float: 'left', margin: 2}} ref={(c) => { this.titleConvo = c }} placeholder={this.state.convoTitle} type='text' className='form-control' />
                                <button style={{float: 'left', margin: 2}} onClick={this.renameTitle} className='btn btn-primary btn-sm' type='button'>Save</button>
                              </ModalDialog>
                            </ModalContainer>
                          }

                          {
                            this.state.showAddCategoryDialog &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeAddCategoryDialog}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeAddCategoryDialog}>
                                <h3>Add Category</h3>
                                <input className='form-control'
                                  placeholder='Enter category' ref='newCategory' />
                                <br />
                                <button style={{float: 'right'}}
                                  className='btn btn-primary btn-sm'
                                  onClick={() => {
                                    this.closeAddCategoryDialog()
                                    this.saveCategory()
                                  }}>Save
                                </button>
                              </ModalDialog>
                            </ModalContainer>
                          }

                          <div className='ui-block' style={{height: 90 + 'vh', overflowY: 'scroll', marginTop: '-15px', paddingLeft: 75, paddingRight: 75, paddingTop: 30, borderRadius: '0px', border: '1px solid #ccc'}}>
                            {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}

                            <DragSortableList items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' />

                          </div>
                        </div>
                      </div>
                    </div>
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
    categories: (state.templatesInfo.categories)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      createBroadcast: createBroadcast,
      loadCategoriesList: loadCategoriesList,
      addCategory: addCategory,
      deleteCategory: deleteCategory,
      editBroadcast: editBroadcast
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBroadcastTemplate)
