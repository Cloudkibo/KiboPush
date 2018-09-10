/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'
import EditButton from './EditButton'
import Halogen from 'halogen'
import { uploadImage } from '../../redux/actions/convos.actions'
import AlertContainer from 'react-alert'

class Card extends React.Component {
  constructor (props, context) {
    super(props, context)
    this._onChange = this._onChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.addButton = this.addButton.bind(this)
    this.handleSubtitle = this.handleSubtitle.bind(this)
    this.editButton = this.editButton.bind(this)
    this.removeButton = this.removeButton.bind(this)
    this.updateImageUrl = this.updateImageUrl.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.updateCardDetails = this.updateCardDetails.bind(this)
    this.state = {
      imgSrc: props.img ? props.img : '',
      title: props.title ? props.title : '',
      button: props.buttons ? props.buttons : [],
      subtitle: props.subtitle ? props.subtitle : '',
      fileurl: '',
      fileName: '',
      type: '',
      size: '',
      image_url: '',
      loading: false,
      styling: {minHeight: 30, maxWidth: 400}
    }
  }

  componentDidMount () {
    this.updateCardDetails(this.props)
  }
  componentWillReceiveProps (nextProps) {
    this.updateCardDetails(nextProps)
  }
  updateCardDetails (cardProps) {
    if (cardProps.cardDetails && cardProps.cardDetails !== '') {
      this.setState({
        //  id: cardProps.id,
        componentType: 'card',
        title: cardProps.cardDetails.title,
        imgSrc: cardProps.cardDetails.image_url,
        button: cardProps.cardDetails.buttons,
        fileurl: cardProps.cardDetails.fileurl,
        fileName: cardProps.cardDetails.fileName,
        image_url: cardProps.cardDetails.image_url,
        type: cardProps.cardDetails.type,
        size: cardProps.cardDetails.size
      })
      if (cardProps.cardDetails.subtitle) {
        this.setState({ subtitle: cardProps.cardDetails.subtitle })
      } else if (cardProps.cardDetails.description) {
        this.setState({ subtitle: cardProps.cardDetails.description })
      }
    }
  }
  _onChange () {
  // Assuming only image
    var file = this.refs.file.files[0]
    if (file) {
      if (file.type && file.type !== 'image/bmp' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        if (this.props.handleCard) {
          this.props.handleCard({error: 'invalid image'})
        }
        return
      }
      var reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = function (e) {
        // this.props.handleCard({id: this.props.id, title: this.state.title, subtitle: this.state.subtitle, imgSrc: [reader.result]})
        this.setState({
          imgSrc: [reader.result]
        })
      }.bind(this)
      this.setState({loading: true})
      if (this.props.setLoading) {
        this.props.setLoading(true)
      }
      this.props.uploadImage(file, this.props.pages[0]._id, 'image', {fileurl: '',
        fileName: file.name,
        type: file.type,
        image_url: '',
        size: file.size}, this.updateImageUrl, this.setLoading)
    }
  }

  handleChange (event) {
    console.log('+onChange')
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: event.target.value,
      description: this.state.subtitle,
      buttons: this.state.button})
    this.setState({
      title: event.target.value
    })
  }

  handleSubtitle (event) {
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: event.target.value,
      buttons: this.state.button})
    this.setState({
      subtitle: event.target.value
    })
  }

  addButton (obj) {
    var temp = this.state.button
    temp.push(obj)
    this.setState({button: temp}, () => {
      this.props.handleCard({id: this.props.id,
        componentType: 'card',
        fileurl: this.state.fileurl,
        image_url: this.state.image_url,
        fileName: this.state.fileName,
        type: this.state.type,
        size: this.state.size,
        title: this.state.title,
        description: this.state.subtitle,
        buttons: temp})
    })
  }

  editButton (obj) {
    var temp = this.state.button.map((elm, index) => {
      if (index === obj.id) {
        elm = obj.button
      }
      return elm
    })
    this.setState({button: temp}, () => {
      this.props.handleCard({id: this.props.id,
        componentType: 'card',
        fileurl: this.state.fileurl,
        image_url: this.state.image_url,
        fileName: this.state.fileName,
        type: this.state.type,
        size: this.state.size,
        title: this.state.title,
        description: this.state.subtitle,
        buttons: this.state.button})
    })
  }
  removeButton (obj) {
    var temp = this.state.button.filter((elm, index) => { return index !== obj.id })
    this.setState({button: temp})
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: temp})
  }

  setLoading () {
    this.setState({loading: false})
    if (this.props.setLoading) {
      this.props.setLoading(false)
    }
  }
  updateImageUrl (data) {
    this.setState({ fileurl: data.fileurl,
      fileName: data.fileName,
      image_url: data.image_url,
      type: data.type,
      size: data.size })

    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: data.fileurl,
      image_url: data.image_url,
      fileName: data.fileName,
      type: data.type,
      size: data.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.button})
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
      <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        { this.props.singleCard && !this.state.loading &&
          <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', margin: -15 + 'px'}}>
            <span style={{cursor: 'pointer'}} className='fa-stack'>
              <i className='fa fa-times fa-stack-2x' />
            </span>
          </div>
        }
        <div style={{minHeight: 350, maxWidth: 400, marginBottom: '-0.5px'}} className='ui-block hoverbordersolid'>
          {
          this.state.loading
          ? <div className='align-center' style={{minHeight: 170, padding: '50px'}}><center><Halogen.RingLoader color='#FF5E3A' /></center></div>
          : <div style={{display: 'flex', minHeight: 170, backgroundColor: '#F2F3F8'}} className='cardimageblock' onClick={() => {
            this.refs.file.click()
          }}>
            <input
              ref='file'
              type='file'
              name='user[image]'
              multiple='true'
              accept='image/*'
              title=' '
              onChange={this._onChange} style={{position: 'absolute', cursor: 'pointer', display: 'none'}} />
            {
            (this.state.imgSrc === '')
            ? <img style={{maxHeight: 40, margin: 'auto'}} src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Text' />
            : <img style={{maxWidth: 300, maxHeight: 300, padding: 25}} src={this.state.imgSrc} />
           }
          </div>
          }
          <div>
            <input onChange={this.handleChange} value={this.state.title} className='form-control' style={{fontSize: '20px', fontWeight: 'bold', paddingTop: '5px', borderStyle: 'none'}} type='text' placeholder='Enter Title...' maxLength='80' />
            <textarea onChange={this.handleSubtitle} value={this.state.subtitle} className='form-control' style={{borderStyle: 'none', width: 100 + '%', height: 100 + '%'}} rows='5' placeholder='Enter subtitle...' maxLength='80' />
          </div>
        </div>
        {(this.state.button) ? this.state.button.map((obj, index) => {
          return <EditButton button_id={(this.props.button_id !== null ? this.props.button_id + '-' + this.props.id : this.props.id) + '-' + index} data={{id: index, button: obj}} onEdit={this.editButton} onRemove={this.removeButton} />
        }) : ''}
        <Button button_id={this.props.button_id !== null ? (this.props.button_id + '-' + this.props.id) : this.props.id} onAdd={this.addButton} styling={this.state.styling} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({uploadImage: uploadImage}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Card)
