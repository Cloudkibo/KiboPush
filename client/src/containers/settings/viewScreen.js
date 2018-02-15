import React from 'react'
import ReactPlayer from 'react-player'
import Slider from 'react-slick'
import RightArrow from '../../containers/convo/RightArrow'
import LeftArrow from '../../containers/convo/LeftArrow'

class ViewScreen extends React.Component {
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
    addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://unpkg.com/react-select/dist/react-select.js')
    document.body.appendChild(addScript)
  }

  render () {
    console.log('View Message Component', this.props.payload)
    var settings = {
      arrows: true,
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <RightArrow />,
      prevArrow: <LeftArrow />
    }
    return (
      <div style={{position: 'relative', display: 'inline-block', boxSizing: 'content-box', width: '317px', height: '635px', padding: '85px 18px', borderRadius: '48px', background: 'white', border: '5px solid #f9fafc'}}>
        <div style={{border: '1px solid #f2f2f2', borderRadius: '2px', display: 'block', height: '100%', position: 'relative', width: '100%', textAlign: 'center', zIndex: 2, overflow: 'hidden'}}>
          <div style={{background: '#f7f7f8', borderBottom: '1px solid #c8c7cc', zIndex: 10, position: 'relative'}}>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h6 style={{color: '#007aff'}}><i className='fa fa-chevron-left' />Back</h6>
            </div>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h7>KiboPush</h7>
              <p style={{color: '#ccc'}}>Typically replies instantly</p>
            </div>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h6 style={{color: '#007aff'}}>Manage</h6>
            </div>
          </div>
          <div className='m-portlet m-portlet--mobile'>
            <div style={{padding: '0px'}} className='m-portlet__body'>
              <div className='tab-content'>
                <div className='tab-pane active m-scrollable' role='tabpanel'>
                  <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                    <div style={{height: '570px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                      <div style={{position: 'relative', padding: '10px', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                        <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                          <div className='m-messenger__message m-messenger__message--in'>
                            <div className='m-messenger__message-pic'>
                              <img src='icons/user.png' alt='' />
                            </div>
                            <div style={{maxWidth: '235px'}} className='m-messenger__message-body'>
                              <div className='m-messenger__message-arrow' />
                              <div className='m-messenger__message-content'>
                                <div className='m-messenger__message-text'>
                                  Hello
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default ViewScreen
