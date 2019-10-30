
import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Popover, PopoverBody } from 'reactstrap'
import Halogen from 'halogen'
import Slider from 'react-slick'
import { uploadImage } from '../../redux/actions/convos.actions'


class QuickReplies extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
        actions: ['send new message', 'subscribe to sequence', 'unsubscribe from sequence', 'assign tag', 'unassign tag'],
        quickReplies: this.props.quickReplies ? this.props.quickReplies : [],
        addingQuickReply: false,
        image_url: '',
        addingAction: false,
        currentTitle: '',
        currentActions: [],
        index: -1
    }
    this.addQuickReply = this.addQuickReply.bind(this)
    this.toggleAddQuickReply = this.toggleAddQuickReply.bind(this)
    this.addAction = this.addAction.bind(this)
    this.closeAddAction = this.closeAddAction.bind(this)
    this.selectAction = this.selectAction.bind(this)
    this.getOptions = this.getOptions.bind(this)
    this.getActionTitle = this.getActionTitle.bind(this)
    this.removeAction = this.removeAction.bind(this)
    this.changeTitle = this.changeTitle.bind(this)
    this._onChange = this._onChange.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.disableSave = this.disableSave.bind(this)
    this.updateSequence = this.updateSequence.bind(this)
    this.updateTag = this.updateTag.bind(this)
    this.updateTemplate = this.updateTemplate.bind(this)
    this.saveQuickReply = this.saveQuickReply.bind(this)
    this.editQuickReply = this.editQuickReply.bind(this)
    this.removeQuickReply = this.removeQuickReply.bind(this)
    this.clickFile = this.clickFile.bind(this)
    console.log('quickReplies constructor')
  }

  clickFile () {
      this.file.click()
  }

  removeQuickReply () {
      let quickReplies = this.state.quickReplies
      if (this.state.index > -1) {
          quickReplies.splice(this.state.index, 1)
      }
      this.setState({addingQuickReply: false, index: -1, quickReplies})
  }

  editQuickReply (index) {
      console.log('editQuickReply index', index)
      console.log('quickReplies', this.state.quickReplies)
      this.setState({
        addingQuickReply: true, 
        currentActions: JSON.parse(JSON.stringify(this.state.quickReplies[index].payload)), 
        currentTitle: this.state.quickReplies[index].title, 
        image_url: this.state.quickReplies[index].image_url,
        index: index
    })
  }

  disableSave () {
      if (!this.state.currentTitle || this.state.addingAction) {
          return true
      }
      for (let i = 0; i < this.state.currentActions.length; i++) {
          if (!this.state.currentActions[i].action) {
              return true
          }
          if (!this.state.currentActions[i].sequenceId && !this.state.currentActions[i].templateId && !this.state.currentActions[i].tagId) {
              return true
          }
      }
      console.log('null')
      return null
  }

  saveQuickReply () {
      let quickReplies = this.state.quickReplies
      let quickReply = {
        content_type: 'text',
        title:  this.state.currentTitle,
        payload: this.state.currentActions
      }
      if (this.state.image_url) {
        quickReply = {
            content_type: 'text',
            title:  this.state.currentTitle,
            payload: this.state.currentActions,
            image_url: this.state.image_url
        }
      }

      if (this.state.index > -1) {
        quickReplies[this.state.index] = quickReply
      } else {
        quickReplies.push(quickReply)
      }

      this.setState({quickReplies, index: -1, addingQuickReply: false}, () => {
        if (this.props.updateQuickReplies) {
            this.props.updateQuickReplies(this.state.quickReplies)
        }
      })
  }

  _onChange () {
      console.log('in _onChange')
      var file = this.file.files[0]
      if (file) {
        console.log('image file', file)
        this.setState({
          loading: true
        })
        this.props.uploadImage(file, undefined, 'image', {}, this.handleImage)
      }
    }
  
    handleImage (fileInfo) {
        console.log('finished uploading file', fileInfo)
        this.setState({image_url: fileInfo.image_url, loading: false})
    }

  changeTitle (e) {
      this.setState({currentTitle: e.target.value})
  }

  closeAddAction () {
      this.setState({addingAction: false})
  }

  removeAction (index) {
      let currentActions = this.state.currentActions
      currentActions.splice(index, 1)
      this.setState({currentActions})
  }

  updateSequence (event, index) {
    let currentActions = this.state.currentActions
    currentActions[index].sequenceId = event.target.value
    this.setState({currentActions})
  } 

  updateTemplate (event, index) {
    let currentActions = this.state.currentActions
    currentActions[index].templateId = event.target.value
    this.setState({currentActions})
  }

  updateTag (event, index) {
    let currentActions = this.state.currentActions
    currentActions[index].tagId = event.target.value
    this.setState({currentActions})
  }

  getOptions (action, index) {
    if (action.includes('sequence')) {
        return (
            <div>
                <select value={this.state.currentActions[index].sequenceId ? this.state.currentActions[index].sequenceId : ''} style={{borderColor: !this.state.currentActions[index].sequenceId  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.updateSequence(event, index)}>
                    <option value={''} disabled>Select a sequence</option>
                    {
                        this.props.sequences.map((sequence, index) => {
                            return (
                                <option key={index} value={sequence._id}>{sequence.name}</option>
                            )
                        })
                    }
                    {/* <option value={'Sequence 1'}>{'Sequence 1'}</option>
                    <option value={'Sequence 2'}>{'Sequence 2'}</option>
                    <option value={'Sequence 3'}>{'Sequence 3'}</option>                                     */}
                </select>
                <div style={{color: 'red', textAlign: 'left'}}>{!this.state.currentActions[index].sequenceId ? '*Required' : ''}</div>
            </div>
        )
    } else if (action.includes('message')) {
        return (
            <div>
                <select value={this.state.currentActions[index].templateId ? this.state.currentActions[index].templateId : ''} style={{borderColor: !this.state.currentActions[index].templateId  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.updateTemplate(event, index)}>
                    <option value={''} disabled>Select a message</option>
                    {
                        this.props.broadcasts.map((broadcast, index) => {
                            return (
                                <option key={index} value={broadcast._id}>{broadcast.title}</option>
                            )
                        })
                    }
                    {/* <option value={'Message 1'}>{'Message 1'}</option>
                    <option value={'Message 2'}>{'Message 2'}</option>
                    <option value={'Message 3'}>{'Message 3'}</option> */}
                </select>
                <div style={{color: 'red', textAlign: 'left'}}>{!this.state.currentActions[index].templateId ? '*Required' : ''}</div>                                    
            </div>
        )
    } else if (action.includes('tag')) {
        return (
            <div>
                <select value={this.state.currentActions[index].tagId ? this.state.currentActions[index].tagId : ''} style={{borderColor: !this.state.currentActions[index].tagId  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.updateTag(event, index)}>
                    <option value={''} disabled>Select a tag</option>
                    {
                        this.props.tags.map((tag, index) => {
                            return (
                                <option key={index} value={tag._id}>{tag.tag}</option>
                            )
                        })
                    }
                    {/* <option value={'Tag 1'}>{'Tag 1'}</option>
                    <option value={'Tag 2'}>{'Tag 2'}</option>
                    <option value={'Tag 3'}>{'Tag 3'}</option>                                     */}
                </select>
                <div style={{color: 'red', textAlign: 'left'}}>{!this.state.currentActions[index].tagId ? '*Required' : ''}</div>                                    
            </div>
        )
    }
  }

  getActionTitle (action) {
      let str = action.replace(/_/g, ' ')
      return str.charAt(0).toUpperCase() + str.slice(1);
  }

  addAction () {
      this.setState({addingAction: true})
  }

  selectAction (e) {
      let currentActions = this.state.currentActions
      currentActions.push({action: e.target.value.replace(/ /g, '_')})
      this.setState({selectedAction: e.target.value, addingAction: false, currentActions})
  }

  toggleAddQuickReply () {
      this.setState({addingQuickReply: !this.state.addingQuickReply, currentTitle: '', addingAction: false, currentActions: [], image_url: ''})
  }

  addQuickReply () {
      this.setState({addingQuickReply: true})
  }

  render () {
    console.log('quickReplies props', this.props)
    console.log('quickReplies state', this.state)
    let settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: this.state.quickReplies.length > 2 ? 3 : this.state.quickReplies.length > 1 ? 2 : 1,
        slidesToScroll: 1,
        arrows: this.state.quickReplies.length > 3 ? true : false,
        initialSlide: this.state.quickReplies.length > 3 ? this.state.quickReplies.length-3 : 0
    };
    return (
        <div>

            <div style={{maxWidth: '80%'}}>
                <Slider ref={(instance) => { this.slider = instance }}  {...settings}>
                    {
                        this.state.quickReplies.map((reply, index) => {
                            return (
                                <div key={index}>
                                    <button onClick={() => this.editQuickReply(index)} style={{maxWidth: '100px', margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                        {reply.title}
                                    </button>
                                </div>
                            )
                        })
                    }
                </Slider>
            </div>

            {
                this.state.quickReplies.length < 10 &&
                <button id='addQuickReply' onClick={this.addQuickReply} style={{marginLeft: '15%', marginTop: '10px', border: 'dashed', borderWidth: '1.5px', 'color': 'black'}} className="btn m-btn--pill btn-sm m-btn hoverbordercomponent">
                    + Add Quick Reply
                </button>
            }

            <Popover placement='auto' isOpen={this.state.addingQuickReply} target='addQuickReply' toggle={this.toggleAddQuickReply}>
                <PopoverBody>
                    <div style={{paddingRight: '10px', maxHeight: '400px', overflowY: 'scroll', overflowX: 'hidden'}}>
                    <div onClick={this.removeQuickReply} style={{marginLeft: '98%', cursor: 'pointer'}}>❌</div>
                        <div style={{marginBottom: '20px', maxHeight: '100px'}} className='row'>
                            <div className='col-4'>
                                <div onClick={this.clickFile} className='ui-block hoverbordercomponent' style={{height: '75px', width: '75px', borderRadius: '50%', display: 'inline-block'}}>
                                    {
                                    this.state.loading
                                    ? <div className='align-center'><center><Halogen.RingLoader color='#FF5E3A' /></center></div>
                                    : <div>
                                        <input
                                        ref={el => { this.file = el }}
                                        type='file'
                                        name='user[image]'
                                        multiple='true'
                                        accept='image/*'
                                        title=' '
                                        onChange={this._onChange} style={{display: 'none'}} />
                                        {
                                            (!this.state.image_url)
                                            ? <div className='align-center' style={{padding: '7px'}}>
                                                <h6 style={{pointerEvents: 'none', zIndex: -1, display: 'inline'}}>Upload Image </h6>
                                            </div>
                                            : <div className='align-center' style={{padding: '7px'}}>
                                                <img src={this.state.image_url} style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} alt='Text' />
                                            </div>
                                        }
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className='col-8' style={{marginTop: '25px'}}>
                                <input style={{borderColor: this.state.currentTitle === '' ? 'red' : ''}} value={this.state.currentTitle} onChange={this.changeTitle} placeholder='Enter title here...' className='form-control' />
                                <div style={{color: 'red', textAlign: 'left'}}>{this.state.currentTitle === '' ? '*Required' : ''}</div>
                            </div>
                        </div>

                        <h4>Actions:</h4>
                        {
                            this.state.currentActions.map((action, index) => {
                                return (
                                    <div style={{marginTop: '10px', border: '1px solid #d3d3d3'}} className="m-portlet">
                                        <div style={{background: 'lightgrey', height: '3rem', padding: '15px'}} className="m-portlet__head m-portlet--head-solid-bg">
                                            <div className="m-portlet__head-caption">
                                                <div className="m-portlet__head-title">
                                                    <span className="m-portlet__head-icon">
                                                        <i style={{color: 'black'}} className="flaticon-map-location"></i>
                                                    </span>
                                                    <h5 style={{fontSize: '1em'}} className="m-portlet__head-text">
                                                        {this.getActionTitle(action.action)}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="m-portlet__head-tools">
                                                <ul className="m-portlet__nav">
                                                    <li className="m-portlet__nav-item">
                                                        <div className="m-portlet__nav-link m-portlet__nav-link--icon">
                                                            <i onClick={(index) => {this.removeAction(index)}} style={{color: 'red', cursor: 'pointer'}} className="la la-close"></i>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="m-portlet__body">
                                            {this.getOptions(action.action, index)}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {
                            (this.state.addingAction) &&
                            <div style={{marginTop: '10px', border: '1px solid #d3d3d3'}} className="m-portlet">
                                <div style={{background: 'lightgrey', height: '3rem', padding: '15px'}} className="m-portlet__head m-portlet--head-solid-bg">
                                    <div className="m-portlet__head-caption">
                                        <div className="m-portlet__head-title">
                                            <span className="m-portlet__head-icon">
                                                <i style={{color: 'black'}} className="flaticon-map-location"></i>
                                            </span>
                                            <h5 style={{fontSize: '1em'}} className="m-portlet__head-text">
                                                Add an action
                                            </h5>
                                        </div>
                                    </div>
                                    {
                                        <div className="m-portlet__head-tools">
                                            <ul className="m-portlet__nav">
                                                <li className="m-portlet__nav-item">
                                                    <div className="m-portlet__nav-link m-portlet__nav-link--icon">
                                                        <i onClick={this.closeAddAction} style={{color: 'red', cursor: 'pointer'}} className="la la-close"></i>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    }
                                </div>
                                <div className="m-portlet__body">
                                    <select style={{borderColor: 'red'}} className='form-control m-input' onChange={this.selectAction}>
                                        <option value={''} selected disabled>{'Select an action'}</option>
                                        {
                                            this.state.actions.map(action => {
                                                return (
                                                    <option value={action}>{action}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div style={{color: 'red', textAlign: 'left'}}>*Required</div>
                                </div>
                            </div>
                        }
                        
                        <div style={{marginBottom: '10px', marginTop: '20px'}}>
                            {
                                (!this.state.addingAction) &&
                                <button onClick={this.addAction} style={{ border: 'dashed', borderWidth: '1.5px', 'color': 'black'}} className="btn m-btn--pill btn-sm m-btn hoverbordercomponent">
                                    + Add Action
                                </button>
                            }

                            <button onClick={this.saveQuickReply} style={{float: 'right'}} disabled={this.disableSave()} className='btn btn-primary'>
                                Save
                            </button>

                        </div>
                    
                    </div>
                </PopoverBody>
            </Popover>

        </div>   
    )
  }
}


function mapStateToProps (state) {
    console.log(state)
    return {
    }
  }
  
  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        uploadImage: uploadImage
    }, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(QuickReplies)
