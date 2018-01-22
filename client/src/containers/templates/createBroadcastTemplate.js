/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { createBroadcast, editBroadcast, loadCategoriesList, addCategory, deleteCategory } from '../../redux/actions/templates.actions'
import { bindActionCreators } from 'redux'
import Image from '../convo/Image'
import Video from '../convo/Video'
import Audio from '../convo/Audio'
import File from '../convo/File'
import Text from '../convo/Text'
import Card from '../convo/Card'
import Gallery from '../convo/Gallery'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'

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
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.newConvo = this.newConvo.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
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
          temp.push({content: (<Text id={temp.length} key={temp.length} buttons={this.props.template.payload[i].buttons} txt={this.props.template.payload[i].text} handleText={this.handleText} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'image') {
          temp.push({content: (<Image id={temp.length} key={temp.length} img={this.props.template.payload[i].image_url} handleImage={this.handleImage} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'card') {
          temp.push({content: (<Card id={temp.length} key={temp.length} buttons={this.props.template.payload[i].buttons} img={this.props.template.payload[i].image_url} title={this.props.template.payload[i].title} subtitle={this.props.template.payload[i].description} handleCard={this.handleCard} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'gallery') {
          temp.push({content: (<Gallery id={temp.length} key={temp.length} cards={this.props.template.payload[i].cards} handleGallery={this.handleGallery} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'audio') {
          temp.push({content: (<Audio id={temp.length} key={temp.length} fileName={this.props.template.payload[i].fileName} handleFile={this.handleFile} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'video') {
          temp.push({content: (<Video id={temp.length} key={temp.length} fileName={this.props.template.payload[i].fileName} handleFile={this.handleFile} onRemove={this.removeComponent} />)})
        } else if (this.props.template.payload[i].componentType === 'file') {
          temp.push({content: (<File id={temp.length} key={temp.length} fileName={this.props.template.payload[i].fileName} handleFile={this.handleFile} onRemove={this.removeComponent} />)})
        }
      }
      var options = this.state.categoryValue
      for (var j = 0; j < this.props.template.category.length; j++) {
        options.push({id: j, text: this.props.template.category[0], selected: true})
      }
      this.setState({broadcast: this.props.template.payload, list: temp})
      this.initializeCategorySelect(options)
    }
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.categories) {
      console.log('categories', nextprops.categories)
      let options = []
      for (var i = 0; i < nextprops.categories.length; i++) {
        options[i] = {id: nextprops.categories[i]._id, text: nextprops.categories[i].name}
      }
      this.initializeCategorySelect(options)
    }
  }

  initializeCategorySelect (categoryOptions) {
    console.log('Category options', categoryOptions)
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
        console.log('selected options', e.target.selectedOptions)
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].label
          selected.push(selectedOption)
        }
        self.setState({ categoryValue: selected })
      }
      console.log('change category', selected)
    })
  }

  showAddCategoryDialog () {
    this.setState({showAddCategoryDialog: true})
  }

  closeAddCategoryDialog () {
    this.setState({showAddCategoryDialog: false})
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
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data.text = obj.text
        if (obj.button.length > 0) {
          data.buttons = obj.button
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
    console.log('handleCard in CreateConvo is called: ')
    console.log(obj)
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data.fileName = obj.fileName
        data.fileurl = obj.fileurl
        data.size = obj.size
        data.type = obj.type
        data.title = obj.title
        data.buttons = obj.buttons
        data.description = obj.description
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
    temp.map((data) => {
      if (data.id === obj.id) {
        data.cards = obj.cards
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
    temp.map((data) => {
      if (data.id === obj.id) {
        data = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
    // console.log("Image Uploaded", obj)
  }

  handleFile (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({broadcast: temp})
    // console.log("Image Uploaded", obj)
  }

  removeComponent (obj) {
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    this.setState({list: temp, broadcast: temp2})
  }

  newConvo () {
    this.setState({broadcast: [], list: []})
  }

  createBroadcastTemplate () {
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
    if (this.state.categoryValue.length > 0) {
      var broadcastTemplate = {
        _id: this.props.template._id,
        title: this.state.convoTitle,
        category: this.state.categoryValue,
        payload: this.state.broadcast
      }

      this.props.editBroadcast(broadcastTemplate, this.msg)
      this.setState({broadcast: [], list: []})
    } else {
      this.msg.error('Please select a category')
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
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>

                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div style={{padding: '25px'}} className='row' />
                  <div>
                    <div className='row' >
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, {content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/text.png' alt='Text' style={{maxHeight: 25}} />
                            <h6>Text</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Image Component Added'); this.setState({list: [...temp, {content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                            <h6>Image</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, {content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/card.png' alt='Card' style={{maxHeight: 25}} />
                            <h6>Card</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({list: [...temp, {content: (<Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                            <h6>Gallery</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Audio Component Added'); this.setState({list: [...temp, {content: (<Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                            <h6>Audio</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Video Component Added'); this.setState({list: [...temp, {content: (<Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/video.png' alt='Video' style={{maxHeight: 25}} />
                            <h6>Video</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({list: [...temp, {content: (<File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/file.png' alt='File' style={{maxHeight: 25}} />
                            <h6>File</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <fieldset>
                      <br />
                      <h5>Category:</h5>
                      <br />
                      <div className='m-form'>
                        <div className='form-group m-form__group'>
                          <div style={{display: 'inline-block'}} className='col-md-10'>
                            <select id='selectCategory' />
                          </div>
                          <div style={{display: 'inline-block'}} className='col-md-2'>
                            <button onClick={this.showAddCategoryDialog} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' style={{marginLeft: '-90px'}}>
                              Add category
                            </button>
                          </div>
                        </div>
                      </div>
                      <br />
                    </fieldset>
                    <br />
                    <div className='row'>
                      <br />
                      <br />
                      <Link to='/templates' style={{float: 'left', marginLeft: 20, lineHeight: 2.5}} className='btn btn-secondary btn-sm'> Back </Link>
                      <button style={{float: 'left', marginLeft: 20}} onClick={this.newConvo} className='btn btn-primary btn-sm'> New </button>
                      {
                        this.props.template
                        ? <button style={{float: 'left', marginLeft: 20}} id='send' onClick={this.editBroadcastTemplate} className='btn m-btn m-btn--gradient-from-primary m-btn--gradient-to-accent' disabled={(this.state.broadcast.length === 0)}> Update </button>
                        : <button style={{float: 'left', marginLeft: 20}} id='send' onClick={this.createBroadcastTemplate} className='btn m-btn m-btn--gradient-from-primary m-btn--gradient-to-accent' disabled={(this.state.broadcast.length === 0)}> Create </button>
                      }
                    </div>
                  </div>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div style={{padding: '25px'}} className='row' />
                  <StickyDiv offsetTop={70} zIndex={1}>
                    <div style={{border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea'}} className='ui-block'>
                      <div style={{padding: '5px'}}>
                        <h3>{this.state.convoTitle} <i onClick={this.showDialog} id='convoTitle' style={{cursor: 'pointer'}} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
                      </div>
                    </div>
                  </StickyDiv>
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
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
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
