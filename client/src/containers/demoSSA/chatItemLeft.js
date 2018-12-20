/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPlayer from 'react-player'

class ChatItemLeft extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{minWidth: '200px', maxWidth: '200px'}} className='m-messenger__message m-messenger__message--in'>
        <div className='m-messenger__message-pic'>
          <img src='http://cdn.cloudkibo.com/public/img/avatar71-sm.jpg' alt='' />
        </div>
        {
          this.props.type === 'text'
          ? <div className='m-messenger__message-body'>
            <div className='m-messenger__message-arrow' />
            <div className='m-messenger__message-content'>
              <div className='m-messenger__message-username'>
                Bot replied:
              </div>
              <div style={{width: '200px'}} className='m-messenger__message-text'>
                Thanks for messaging us. We will get back to you soon.
              </div>
              <a href='https://www.ssa.gov/' target='_blank' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                Visit Website
              </a>
              <a href='https://www.ssa.gov/' target='_blank' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                Visit Website
              </a>
            </div>
          </div>
          : this.props.type === 'image'
          ? <div className='m-messenger__message-body'>
            <div className='m-messenger__message-arrow' />
            <div className='m-messenger__message-content'>
              <div className='m-messenger__message-username'>
                Bot replied:
              </div>
              <a href='https://www.alaskapublic.org/wp-content/uploads/2017/12/Social-Security-logo-600x344.jpg' target='_blank'>
                <img
                  src='https://www.alaskapublic.org/wp-content/uploads/2017/12/Social-Security-logo-600x344.jpg'
                  style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
                />
              </a>
            </div>
          </div>
          : this.props.type === 'quick-reply'
          ? <div className='m-messenger__message-body'>
            <div className='m-messenger__message-arrow' />
            <div className='m-messenger__message-content'>
              <div className='m-messenger__message-username'>
                Bot replied:
              </div>
              <div style={{width: '200px'}} className='m-messenger__message-text'>
                Did I answer your query correctly?
              </div>
              <div>
                <button style={{borderColor: '#36a3f7', margin: '3px'}} type='button' className='btn m-btn--pill btn-outline-info btn-sm'>
                  Yes
                </button>
                <button style={{borderColor: '#36a3f7', margin: '3px'}} type='button' className='btn m-btn--pill btn-outline-info btn-sm'>
                  No
                </button>
                <button style={{borderColor: '#36a3f7', margin: '3px'}} type='button' className='btn m-btn--pill btn-outline-info btn-sm'>
                  Partially
                </button>
              </div>
            </div>
          </div>
          : this.props.type === 'card'
          ? <div className='m-messenger__message-body'>
            <div className='m-messenger__message-arrow' />
            <div className='m-messenger__message-content'>
              <div className='m-messenger__message-username'>
                Bot replied:
              </div>
              <div>
                <div style={{maxWidth: 200, borderRadius: '10px'}} className='ui-block hoverbordersolid'>
                  <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
                    <a href='https://www.alaskapublic.org/wp-content/uploads/2017/12/Social-Security-logo-600x344.jpg' target='_blank'>
                      <img style={{maxWidth: 180, borderRadius: '5px'}} src='https://www.alaskapublic.org/wp-content/uploads/2017/12/Social-Security-logo-600x344.jpg' />
                    </a>
                  </div>
                  <div style={{marginTop: '10px', padding: '5px'}}>
                    <div style={{textAlign: 'left', fontWeight: 'bold'}}>Social Security</div>
                    <div style={{textAlign: 'left', color: '#ccc'}}>Social Security Administration</div>
                  </div>
                  <a href='https://www.ssa.gov/' target='_blank' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                    Visit Website
                  </a>
                  <a href='https://www.ssa.gov/' target='_blank' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>
          : this.props.type === 'media' &&
          <div className='m-messenger__message-body'>
            <div className='m-messenger__message-arrow' />
            <div className='m-messenger__message-content'>
              <div className='m-messenger__message-username'>
                Bot replied:
              </div>
              <ReactPlayer
                url='https://www.youtube.com/watch?v=wZTn1Y6HjaQ'
                controls
                width='200px'
                height='auto'
                onPlay
              />
              <a href='https://www.ssa.gov/' target='_blank' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                Visit Website
              </a>
              <a href='https://www.ssa.gov/' target='_blank' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                Visit Website
              </a>
            </div>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatItemLeft)
