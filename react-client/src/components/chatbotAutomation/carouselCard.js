import React from 'react'

import CarouselButton from './carouselButton'
import { RingLoader } from 'halogenium'

class CarouselCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageLoading: false
    }
    this.updateCard = this.updateCard.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
  }

  updateCard (data, callback) {
    this.props.updateCard(this.props.index, {...this.props.card, ...data}, callback)
  }

  uploadImage() {
      const file = this.fileInput.files[0]
      if (file) {
        if (file && file.type !== 'image/bmp' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
          this.msg.error('Please select an image of type jpg, gif, bmp or png')
          return
        }
        console.log('image file', file)
        this.props.updateLoading(true)
        this.setState({imageLoading: true})

        const fileData = new FormData()
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('pages', JSON.stringify([this.props.chatbot.pageId]))
        fileData.append('componentType', 'image')
        this.props.uploadAttachment(fileData, (res) => {
          console.log('uploaded image', res.payload)
          this.updateCard({image_url: res.payload.url, fileurl: res.payload}, () => {
            this.props.updateLoading(false)
            this.setState({imageLoading: false})
          })
        })
      }
  }

  render () {
    return (
      <div>
        <div className='ui-block' style={{padding: '5px'}}>
          <div className='row'>
            <div className='col-2'>
              <div style={{marginTop: '5px', position: 'relative', textAlign: 'left'}}>
                Title:
              </div>
            </div>
            <div className='col-10'>
              <input 
                placeholder={'Please type here...'} 
                value={this.props.card.title} 
                style={{maxWidth: '100%', 
                borderColor: !this.props.card.title ? 'red' : ''}} 
                onChange={(e) => this.updateCard({title: e.target.value})} 
                className='form-control' 
              />
              <div style={{marginBottom: '30px', color: 'red', textAlign: 'left'}}>{!this.props.card.title ? '*Required' : ''}</div>
            </div>
          </div>

          <div className='row'>
            <div className='col-2'>
              <div style={{marginTop: '5px', position: 'relative', textAlign: 'left'}}>
                Subtitle:
              </div>
            </div>
            <div className='col-10'>
              <input placeholder={'Please type here...'} value={this.props.card.subtitle} style={{maxWidth: '100%', marginBottom: '30px'}} onChange={(e) => this.updateCard({subtitle: e.target.value})} className='form-control' />
            </div>
          </div>
          <div className='row'>
            <div className='col-2'>
              <div style={{marginTop: '5px', position: 'relative', textAlign: 'left'}}>Image:</div>
            </div>
            <div className='col-10'>
              <div onClick={() => this.fileInput.click()} className='ui-block hoverborder' style={{margin: '0', borderRadius: '5px'}}>
                {
                this.state.imageLoading
                ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
                : <div>
                    <input
                    ref={el => { this.fileInput = el }}
                    type='file'
                    name='user[image]'
                    multiple={true}
                    accept='image/*'
                    title=' '
                    onChange={this.uploadImage} style={{display: 'none'}} />
                    {
                    (!this.props.card.fileurl)
                    ? <div className='align-center' style={{paddingBottom: '10px'}}>
                        <img src='https://cdn.cloudkibo.com/public/icons/picture.png' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} alt='Text' />
                        <h6 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline'}}> Upload Image </h6>
                    </div>
                    : <div className='align-center' style={{paddingBottom: '10px'}}>
                        <img src={this.props.card.fileurl.url} style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40, maxWidth: '100%'}} alt='Text' />
                        <h6 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline', overflowWrap: 'break-word'}}>{this.props.card.fileurl.name ? this.props.card.fileurl.name : 'Image'}</h6>
                      </div>
                    }
                </div>
                }
              </div>
            </div>
          </div>
            <CarouselButton
              id={this.props.id}
              button={this.props.card.buttons[0]}
              alertMsg={this.props.alertMsg}
              blocks={this.props.blocks}
              cardIndex={this.props.index}
              updateButtonOption={this.props.updateButtonOption}
              buttonOption={this.props.card.buttonOption}
            />
        </div>
      </div>
    )
  }
}

export default CarouselCard
