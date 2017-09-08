import React from 'react'

class AddChannel extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      facebookColor: '#ff5e3a',
      twitterColor: '',
      youtubeColor: ''
    }
    this.onSelectItem = this.onSelectItem.bind(this)
  }

  onSelectItem (value) {
    switch (value) {
      case 'facebook':
        this.setState({
          facebookColor: '#ff5e3a',
          twitterColor: '',
          youtubeColor: ''
        })
        break
      case 'twitter':
        this.setState({
          facebookColor: '',
          twitterColor: '#ff5e3a',
          youtubeColor: ''
        })
        break
      case 'youtube':
        this.setState({
          facebookColor: '',
          twitterColor: '',
          youtubeColor: '#ff5e3a'
        })
        break
    }
  }

  render () {
    let facebookColor = this.state.facebookColor
    let twitterColor = this.state.twitterColor
    let youtubeColor = this.state.youtubeColor
    return (
      <div>
        <h3>Add Source Channel</h3>
        <div style={{width: '100%', textAlign: 'center'}}>
          <div style={{display: 'inline-block', padding: '5px'}}>
            <button onClick={() => this.onSelectItem('facebook')} style={{backgroundColor: facebookColor}} className='btn btn-default'>
              <i className='fa fa-facebook fa-2x' aria-hidden='true' />
              <br />Facebook
            </button>
          </div>
          <div style={{display: 'inline-block', padding: '5px'}}>
            <button onClick={() => this.onSelectItem('twitter')} style={{backgroundColor: twitterColor}} className='btn btn-default'>
              <i className='fa fa-twitter fa-2x' aria-hidden='true' />
              <br />Twitter
            </button>
          </div>
          <div style={{display: 'inline-block', padding: '5px'}}>
            <button onClick={() => this.onSelectItem('youtube')} style={{backgroundColor: youtubeColor}} className='btn btn-default'>
              <i className='fa fa-youtube fa-2x' aria-hidden='true' />
              <br />YouTube
            </button>
          </div>
        </div>
        { facebookColor !== '' &&
        <div>
          <div>
            <label> Facebook Page Url </label>
            <input type='text' className='form-control' />
          </div>
          <button style={{float: 'right', margin: '10px'}}
            className='btn btn-primary btn-sm'>Add Facebook Account
          </button>
        </div>
        }
        { twitterColor !== '' &&
        <div>
          <div>
            <label> Twitter Account Url </label>
            <input type='text' className='form-control' />
          </div>
          <button style={{float: 'right', margin: '10px'}}
            className='btn btn-primary btn-sm'>Add Twitter Account
          </button>
        </div>
        }
        { youtubeColor !== '' &&
        <div>
          <div>
            <label> YouTube Channel Url </label>
            <input type='text' className='form-control' />
          </div>
          <button style={{float: 'right', margin: '10px'}}
            className='btn btn-primary btn-sm'>Add YouTube Account
          </button>
        </div>
        }
      </div>
    )
  }
}

export default AddChannel
