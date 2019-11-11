/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'
import EditButton from './EditButton'
import { RingLoader } from 'halogenium'
// import { ModalContainer } from 'react-modal-dialog'
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
    this.updateCardDetails = this.updateCardDetails.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.state = {
      imgSrc: '',
      title: '',
      button: [],
      subtitle: '',
      fileurl: '',
      fileName: '',
      type: '',
      size: '',
      image_url: '',
      loading: false
    }
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.updateCardDetails(nextProps)
  }
  setLoading () {
    this.setState({loading: false})
  }
  updateCardDetails (cardProps) {
    if (cardProps.cardDetails && cardProps.cardDetails !== '') {
      this.setState({
        id: cardProps.id,
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
  componentDidMount () {
    this.updateCardDetails(this.props)
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
      this.props.uploadImage(file, {fileurl: '',
        fileName: file.name,
        type: file.type,
        image_url: '',
        size: file.size}, this.updateImageUrl, this.setLoading)
    }
  }

  handleChange (event) {
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
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      title: this.state.title,
      description: this.state.subtitle,
      buttons: this.state.button})
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
      buttons: this.state.button})
  }

  updateImageUrl (data) {
    this.setState({ fileurl: data.fileurl,
      fileName: data.fileName,
      image_url: data.image_url,
      type: data.type,
      size: data.size })

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
  }

  render () {
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
              accept='image/*'
              onChange={this._onChange} style={{position: 'absolute', opacity: 0, maxWidth: 370, minHeight: 170, zIndex: 5, cursor: 'pointer'}} />

            {
          (this.state.imgSrc === '')
          ? <img style={{maxHeight: 40, margin: 'auto'}} src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Text' />
          : <img style={{maxWidth: 300, maxHeight: 300, padding: 25}} src={this.state.imgSrc} />
         }

          </div>
          <div>
            <input onChange={this.handleChange} value={this.state.title} className='form-control' style={{fontSize: '20px', fontWeight: 'bold', paddingTop: '5px', borderStyle: 'none'}} type='text' placeholder='Enter Title...' maxLength='80' />
            <textarea onChange={this.handleSubtitle} value={this.state.subtitle} className='form-control' style={{borderStyle: 'none', width: 100 + '%', height: 100 + '%'}} rows='5' placeholder='Enter subtitle...' maxLength='80' />
          </div>
        </div>
        {(this.state.button) ? this.state.button.map((obj, index) => {
          return <EditButton index={index} button_id={(this.props.button_id !== null ? this.props.button_id + '-' + this.props.id : this.props.id) + '-' + index} data={{id: index, title: obj.title, url: obj.url}} onEdit={this.editButton} onRemove={this.removeButton} />
        }) : ''}
        <div className='ui-block hoverborder' style={{minHeight: 30, maxWidth: 400}}>
          <Button button_id={this.props.button_id !== null ? (this.props.button_id + '-' + this.props.id) : this.props.id} onAdd={this.addButton} />
        </div>
        {/* {
          this.state.loading
          ? <ModalContainer>
            <div style={{position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em'}}
              className='align-center'>
              <center><RingLoader color='#716aca' /></center>
            </div>
          </ModalContainer>
          : <span />
        } */}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({uploadImage: uploadImage}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Card)
