import React from 'react'
import PropTypes from 'prop-types'
import { RingLoader } from 'halogenium'
import BUTTONSCONTAINER from './buttonsContainer'

class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buttons: props.card.buttons,
      title: props.card.title,
      subtitle: props.card.subtitle,
      image: props.card.fileName,
      imageSelected: false,
      loading: false
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onSubtitleChange = this.onSubtitleChange.bind(this)
    this.onImageChange = this.onImageChange.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.addButton = this.addButton.bind(this)
    this.updateButton = this.updateButton.bind(this)
    this.removeButton = this.removeButton.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  onTitleChange (e) {
    this.setState({title: e.target.value})
    this.props.updateCard('title', e.target.value, this.props.id - 1)
  }

  onSubtitleChange (e) {
    this.setState({subtitle: e.target.value})
    this.props.updateCard('subtitle', e.target.value, this.props.id - 1)
  }

  handleImageUpload (res, data) {
    if (res.status === 'success') {
      data.fileurl = res.payload
      this.setState({loading: false, image: data.fileName, imageSelected: true})
      this.props.updateCard('image', data, this.props.id - 1)
    } else {
      this.setState({loading: false})
      this.props.showErrorMessage('An unexpected error occured. Please try again later')
    }
  }

  onImageChange (e) {
    if (e.target.files.length > 0) {
      this.setState({loading: true})
      const file = e.target.files[0]
      if (file.size > 25000000) {
        this.props.showErrorMessage('Attachment exceeds the limit of 25MB')
        this.setState({loading: false})
      } else {
        this.props.uploadImage(file, this.props.id - 1, this.handleImageUpload)
      }
    }
  }

  addButton (button) {
    let data = this.state.buttons
    data.push(button)
    this.setState({buttons: data}, () => {
      setTimeout(this.scrollToBottom, 1)
    })
    this.props.updateCard('buttons', data, this.props.id - 1)
  }

  updateButton (button, index) {
    let data = this.state.buttons
    data[index] = button
    this.props.updateCard('buttons', data, this.props.id - 1)
  }

  removeButton (index) {
    let data = this.state.buttons
    data.splice(index, 1)
    this.setState({buttons: data})
    this.props.updateCard('buttons', data, this.props.id - 1)
  }

  scrollToBottom () {
    const cardBottom = document.getElementById(`card-${this.props.id}`)
    if (cardBottom) {
      cardBottom.scrollIntoView({behavior: 'smooth', block: 'end'})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of card side panel called ', nextProps)
    if (nextProps.card) {
      this.setState({
        title: nextProps.card.title,
        subtitle: nextProps.card.subtitle,
        image: nextProps.card.fileName,
        imageSelected: nextProps.card.fileName ? true : false
      })
    }
  }

  render () {
    console.log('props in card side panel', this.props)
    return (
      <div key={this.props.id} style={{marginTop: this.props.id > 1 && '15px'}} className='card'>
        <div style={{cursor: 'pointer'}} className='card-header'>
          <span data-toggle='collapse' data-target={`#side_panel_card_${this.props.id}`} className='m--font-boldest'>{`Card# ${this.props.id}`}</span>
          {
            this.props.showRemove &&
            <span onClick={() => {this.props.removeCard(this.props.id - 1)}} style={{cursor: 'pointer'}} id="m_quick_sidebar_close" class="pull-right">
              <i class="la la-close"></i>
            </span>
          }
        </div>
        <div className='collapse show' id={`side_panel_card_${this.props.id}`}>
          <div className='card-body'>
            <div className="form-group m-form__group row">
              <span className="col-4 col-form-label">
                Title:
							</span>
              <div className="col-8">
                <input
                  className="form-control m-input"
                  type="text"
                  value={this.state.title}
                  onChange={this.onTitleChange}
                  onFocus={() => {this.props.updateActiveCard(this.props.id - 1)}}
                />
              </div>
            </div>
            <div className="form-group m-form__group row">
              <span className="col-4 col-form-label">
                Subtitle:
							</span>
              <div className="col-8">
                <input
                  className="form-control m-input"
                  type="text"
                  value={this.state.subtitle}
                  onChange={this.onSubtitleChange}
                  onFocus={() => {this.props.updateActiveCard(this.props.id - 1)}}
                />
              </div>
            </div>
            <div className="form-group m-form__group row">
              <input
                style={{display: 'none'}}
                type='file'
                ref='select_card_image'
                accept='image/*'
                onChange={this.onImageChange}
              />
              <span className="col-4 col-form-label">
                Image:
							</span>
              <div className="col-8">
                <div
                  onClick={() => {
                    this.refs.select_card_image.click()
                    this.props.updateActiveCard(this.props.id - 1)
                  }}
                  style={{minHeight: 'auto'}}
                  className="m-dropzone dropzone dz-clickable"
                >
                  {
                    this.state.loading
                    ? <div style={{margin: '0px'}} className="m-dropzone__msg dz-message needsclick">
                      <div className='align-center'>
                        <center><RingLoader color='#5867dd' /></center>
                      </div>
                    </div>
                    : this.state.imageSelected
                    ? <div style={{margin: '0px'}} className="m-dropzone__msg dz-message needsclick">
                      <h2 style={{color: '#5867dd'}} className="m-dropzone__msg-title">
                        <i className="fa fa-image" /> {this.state.image.length > 25 ? `${this.state.image.substring(0, 15)}...` : this.state.image}
                      </h2>
                      <span className="m-dropzone__msg-desc">
                        Cick to upload new image of size upto 25MB
                      </span>
                    </div>
                    : <div style={{margin: '0px'}} className="m-dropzone__msg dz-message needsclick">
                      <h3 className="m-dropzone__msg-title">
                        <i style={{fontSize: '25px'}} className='fa fa-image' />
                      </h3>
                      <span className="m-dropzone__msg-desc">
                        Upload image of size upto 25MB
                      </span>
                    </div>
                  }
                </div>
              </div>
            </div>
            <BUTTONSCONTAINER
              buttons={this.state.buttons}
              addButton={this.addButton}
              updateButton={this.updateButton}
              removeButton={this.removeButton}
              limit={3}
              insertButton={this.props.insertButton}
              editButton={this.props.editButton}
              alertMsg={this.props.alertMsg}
            />
            <div id={`card-${this.props.id}`} style={{float: 'left', clear: 'both'}} />
          </div>
        </div>
      </div>
    )
  }
}

Card.propTypes = {
  'card': PropTypes.object.isRequired,
  'id': PropTypes.number.isRequired,
  'updateActiveCard': PropTypes.func.isRequired,
  'insertButton': PropTypes.func.isRequired,
  'editButton': PropTypes.func.isRequired
}

export default Card
