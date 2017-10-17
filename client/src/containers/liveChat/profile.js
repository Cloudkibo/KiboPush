/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
//  import ChatBox from './chatbox'

class Profile extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {

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
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
  }

  render () {
    return (
      <div className='ui-block'>
        <div className='friend-item'>
          <div className='friend-header-thumb'>
            <img src='img/friend3.jpg' alt='friend' />
          </div>
          <div className='friend-item-content'>

            <div className='more'>
              <ul className='more-dropdown'>
                <li>
                  <a href='#'>Report Profile</a>
                </li>
                <li>
                  <a href='#'>Block Profile</a>
                </li>
                <li>
                  <a href='#'>Turn Off Notifications</a>
                </li>
              </ul>
            </div>
            <div className='friend-avatar'>
              <div className='author-thumb'>
                <img src='img/avatar3.jpg' alt='author' />
              </div>
              <div className='author-content'>
                <a href='#' className='h5 author-name'>Nicholas Grissom</a>
                <div className='country'>Los Angeles, CA</div>
              </div>
            </div>

            <div className='swiper-container swiper-swiper-unique-id-2 initialized swiper-container-horizontal' id='swiper-unique-id-2'>
              <div className='swiper-wrapper' ><div className='swiper-slide swiper-slide-duplicate swiper-slide-prev swiper-slide-duplicate-next' data-swiper-slide-index='1' >
                <p className='friend-about' data-swiper-parallax='-500' >
                      Hi!, I’m Marina and I’m a Community Manager for “Gametube”. Gamer and full-time mother.
                    </p>
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
    chat: (state.liveChat.chat)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
