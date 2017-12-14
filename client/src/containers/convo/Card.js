/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'
import EditButton from './EditButton'
import { uploadImage } from '../../redux/actions/convos.actions'

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
    this.state = {
      imgSrc: '',
      title: '',
      button: [],
      subtitle: '',
      fileurl: '',
      fileName: '',
      type: '',
      size: ''
    }
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }

  _onChange () {
  // Assuming only image
    var file = this.refs.file.files[0]
    var reader = new FileReader()
    var url = reader.readAsDataURL(file)

    reader.onloadend = function (e) {
      // this.props.handleCard({id: this.props.id, title: this.state.title, subtitle: this.state.subtitle, imgSrc: [reader.result]})
      this.setState({
        imgSrc: [reader.result]
      })
    }.bind(this)
    console.log(url) // Would see a path?
    console.log('Card Image in OnChange', file)
    this.props.uploadImage(file, {fileurl: '',
      fileName: file.name,
      type: file.type,
      size: file.size}, this.updateImageUrl)
  }

  handleChange (event) {
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
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
    this.setState({button: temp})
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.button})
  }

  editButton (obj) {
    var temp = this.state.button.map((elm, index) => {
      if (index === obj.id) {
        elm.title = obj.title
        elm.url = obj.url
      }
      return elm
    })
    this.setState({button: temp})
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.button})
  }
  removeButton (obj) {
    console.log(obj)
    var temp = this.state.button.filter((elm, index) => { return index !== obj.id })
    console.log('Filter', temp)
    this.setState({button: temp})
    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.button})
  }

  updateImageUrl (data) {
    console.log('Update Card Image Url')
    console.log(data)
    this.setState({ fileurl: data.fileurl,
      fileName: data.fileName,
      type: data.type,
      size: data.size })

    this.props.handleCard({id: this.props.id,
      componentType: 'card',
      fileurl: this.state.fileurl,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: event.target.value,
      buttons: this.state.button})
  }

  render () {
    console.log('State: ', this.props.id)
    return (
      <div>
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{position: 'absolute', right: '-10px', top: '-5px', zIndex: 6, marginTop: '-5px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div style={{minHeight: 350, maxWidth: 400, marginBottom: '-0.5px'}} className='ui-block hoverbordersolid'>
          <div style={{display: 'flex', minHeight: 170, backgroundColor: '#F2F3F8'}} className='cardimageblock'>
            <input
              ref='file'
              type='file'
              name='user[image]'
              multiple='true'
              onChange={this._onChange} style={{position: 'absolute', opacity: 0, maxWidth: 370, minHeight: 170, zIndex: 5, cursor: 'pointer'}} />

            {
          (this.state.imgSrc === '')
          ? <img style={{maxHeight: 40, margin: 'auto'}} src='icons/picture.png' alt='Text' />
          : <img style={{maxWidth: 300, maxHeight: 300, padding: 25}} src={this.state.imgSrc} />
         }

          </div>
          <div>
            <input onChange={this.handleChange} className='form-control' style={{fontSize: '20px', fontWeight: 'bold', paddingTop: '5px', borderStyle: 'none'}} type='text' placeholder='Enter Title...' />
            <textarea onChange={this.handleSubtitle} className='form-control' style={{borderStyle: 'none', width: 100 + '%', height: 100 + '%'}} rows='5' placeholder='Enter subtitle...' />
          </div>
        </div>
        {(this.state.button) ? this.state.button.map((obj, index) => {
          return <EditButton data={{id: index, title: obj.title, url: obj.url}} onEdit={this.editButton} onRemove={this.removeButton} />
        }) : ''}
        <div className='ui-block hoverborder' style={{minHeight: 30, maxWidth: 400}}>
          <Button onAdd={this.addButton} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({uploadImage: uploadImage}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Card)
