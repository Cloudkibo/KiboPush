import React from 'react'
import ReactPlayer from 'react-player'
import Slider from 'react-slick'
import {setWebViewUrl} from './../../utility/utils'

class ViewMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.onTestURLAudio = this.onTestURLAudio.bind(this)
    this.slideIndexChange = this.slideIndexChange.bind(this)
    this.state = {
      payload: (this.props.payload && this.props.payload.jsonAdMessages && this.props.payload.jsonAdMessages.length !== 0) ? this.props.payload.jsonAdMessages[0].messageContent : this.props.payload,
      currentSlideIndex: 0
    }
  }
/* UNSAFE_componentWillMount() {
  console.log('In will mount Method')
  console.log('this.props.payload.jsonAdMessages', this.props.payload.jsonAdMessages)
  console.log('this.props.payload.jsonAdMessages.length', this.props.payload.jsonAdMessages.length)
} */
  UNSAFE_componentWillReceiveProps(nextProps) {
    let payload = (nextProps.payload && nextProps.payload.jsonAdMessages && nextProps.payload.jsonAdMessages.length !== 0) ? nextProps.payload.jsonAdMessages[0].messageContent : nextProps.payload
    this.setState({payload: payload})
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  slideIndexChange (newIndex) {
    this.setState({currentSlideIndex: newIndex})
  }

  onTestURLAudio (url) {
    var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i
    var truef = AUDIO_EXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  render () {
    console.log('this.props.payload', this.props.payload)
    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }
    return (
      <div style={{position: 'relative', display: 'inline-block', boxSizing: 'content-box', width: 'auto', height: 'auto', padding: '85px 18px', borderRadius: '48px', background: 'white', border: '5px solid #f9fafc'}}>
        <div style={{border: '1px solid #f2f2f2', borderRadius: '2px', display: 'block', height: '100%', position: 'relative', width: '100%', textAlign: 'center', zIndex: 2, overflow: 'hidden'}}>
          <div style={{background: '#f7f7f8', borderBottom: '1px solid #c8c7cc', zIndex: 10, position: 'relative'}}>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h6 style={{color: '#007aff'}}><i className='fa fa-chevron-left' />Back</h6>
            </div>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h7>{this.props.pageName ? this.props.pageName : 'KiboPush'}</h7>
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
                              <img src='https://cdn.cloudkibo.com/public/icons/user.png' alt='' />
                            </div>
                            <div style={{maxWidth: '250px', minWidth: '235px'}} className='m-messenger__message-body'>
                              <div className='m-messenger__message-arrow' />
                                {
                                  this.state.payload && this.state.payload.map((b, index) => (
                                    <div>
                                    <br/>
                                  <div className='m-messenger__message-content' style={{width: '200px'}}>
                                  {
                                    b.componentType === 'video'
                                    ? <div key={index}>
                                      <ReactPlayer
                                        url={b.file? b.file.fileurl.url : b.fileurl.url}
                                        controls
                                        width='100%'
                                        height='140px'
                                        onPlay={this.onTestURLVideo(b.file ? b.file.fileurl.url : b.fileurl.url)}
                                      />
                                    </div>
                                    : b.componentType === 'audio'
                                    ? <div key={index} style={{marginTop: '20px', marginBottom: '60px', marginLeft: '-15px'}}>
                                      <ReactPlayer
                                        url={b.file? b.file.fileurl.url : b.fileurl.url}
                                        controls
                                        onPlay={this.onTestURLAudio(b.file? b.file.fileurl.url : b.fileurl.url)}
                                        width='100%'
                                        height='50px'
                                        style={{width: '100%', height: 'auto'}}
                                      />
                                    </div>
                                    : b.componentType === 'image'
                                    ? <a key={index} href={b.image_url} target='_blank' rel='noopener noreferrer'>
                                      <img
                                        alt=''
                                        src={b.image_url}
                                        style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
                                      />
                                    </a>
                                    : b.componentType === 'file'
                                    ? <a key={index} href={b.file? b.file.fileurl.url : b.fileurl.url} target='_blank' rel='noopener noreferrer'>
                                      <h6 style={{marginTop: '10px'}}><i className='fa fa-file-text-o' /><strong>{b.fileName}</strong></h6>
                                    </a>
                                    : b.componentType === 'card'
                                    ? <div key={index}>
                                      <div style={{maxWidth: '175px', borderRadius: '10px'}} className='ui-block hoverbordersolid'>
                                        <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
                                          <a href={b.iamge_url} target='_blank' rel='noopener noreferrer'>
                                            <img alt='' style={{maxWidth: '160px', borderRadius: '5px'}} src={b.image_url} />
                                          </a>
                                        </div>
                                        <div style={{marginTop: '10px', padding: '5px'}}>
                                          <div style={{textAlign: 'left', fontWeight: 'bold'}}>{b.title}</div>
                                          <div style={{textAlign: 'left', color: 'rgb(140, 140, 140)'}}>{b.description}</div>
                                        </div>
                                      </div>
                                      {
                                        b.buttons && b.buttons.length > 0 &&
                                        b.buttons.map((button, i) => (
                                          <a key={i} href={'//' + button.url ? setWebViewUrl(button.url) : '#'} target='_blank' rel='noopener noreferrer' style={{width: '175px', whiteSpace: 'inherit', marginTop: '5px'}} className='btn btn-secondary btn-sm'>

                                            <span>{button.title}</span>
                                          </a>
                                        ))
                                      }
                                    </div>
                                    : b.componentType === 'gallery'
                                    ? <Slider ref={(c) => { this.slider = c }} {...settings}>
                                      {
                                        b.cards.map((card, i) => (
                                          <div key={i}>
                                            <div id={i} style={{maxWidth: '175px', borderRadius: '10px'}} className='ui-block hoverbordersolid'>
                                              <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
                                                <a href={card.image_url} target='_blank' rel='noopener noreferrer'>
                                                  <img alt='' style={{maxWidth: '160px', borderRadius: '5px'}} src={card.image_url} />
                                                </a>
                                              </div>
                                              <div style={{marginTop: '10px', padding: '5px'}}>
                                                <div style={{textAlign: 'left', fontWeight: 'bold'}}>{card.title}</div>
                                                <div style={{textAlign: 'left', color: 'rgb(140, 140, 140)'}}>{card.subtitle}</div>
                                              </div>
                                            </div>
                                            {
                                              card.buttons && card.buttons.length > 0 &&
                                              card.buttons.map((button, i) => (
                                                <a key={i} href={'//' + button.url ? setWebViewUrl(button.url) : '#'} target='_blank' rel='noopener noreferrer' style={{width: '175px', marginTop: '5px', whiteSpace: 'inherit'}} className='btn btn-secondary btn-sm'>
                                                  <span>{button.title}</span>
                                                </a>
                                              ))
                                            }
                                          </div>
                                        ))
                                      }
                                    </Slider>
                                    : b.componentType === 'text'
                                    ? <div key={index}>
                                      <div className='m-messenger__message-text'>
                                        {b.text}
                                      </div>
                                      {
                                        b.buttons && b.buttons.length > 0 &&
                                        b.buttons.map((button, i) => (
                                          <a key={i} href={'//' + button.url ? setWebViewUrl(button.url) : '#'} target='_blank' rel='noopener noreferrer' style={{borderColor: '#716aca', whiteSpace: 'inherit', width: '175px', marginTop: '5px'}} className='btn btn-outline-brand btn-sm'>
                                            <span>{button.title}</span>
                                          </a>
                                        ))
                                      }
                                    </div>
                                    : b.componentType === 'media'
                                    ? <div key={index}>
                                      <div style={{maxWidth: '175px', borderRadius: '10px'}} className='ui-block hoverbordersolid'>
                                        <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
                                          { b.mediaType === 'image' &&
                                            <a href={b.fileurl.url} target='_blank' rel='noopener noreferrer'>
                                              <img alt='' style={{maxWidth: '160px', borderRadius: '5px'}} src={b.fileurl.url} />
                                            </a>
                                           }
                                          { b.mediaType === 'video' &&
                                            <ReactPlayer
                                              url={b.fileurl.url}
                                              controls
                                              width='100%'
                                              height='140px'
                                              onPlay={this.onTestURLVideo(b.fileurl.url)}
                                            />
                                          }
                                        </div>
                                      </div>
                                      {
                                        b.buttons && b.buttons.length > 0 &&
                                        b.buttons.map((button, i) => (
                                          <a key={i} href={'//' + button.url ? setWebViewUrl(button.url) : '#'} target='_blank' rel='noopener noreferrer' style={{width: '175px', whiteSpace: 'inherit', marginTop: '5px'}} className='btn btn-secondary btn-sm'>
                                            <span>{button.title}</span>
                                          </a>
                                        ))
                                      }
                                    </div>
                                    : b.componentType === 'list' &&
                                    <div key={index} className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
                                      {b.listItems.map((item, i) => (
                                        <a key={i} href={item.default_action && item.default_action !== '' ? '//' + item.default_action.url : null} target='_blank' rel='noopener noreferrer' style={{width: '-webkit-fill-available'}} className='btn btn-sm'>
                                          <div style={{padding: '10px', maxWidth: 400, marginBottom: '-19px', backgroundImage: b.topElementStyle === 'LARGE' && i === 0 ? 'url(' + b.listItems[0].image_url + ')' : '', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: b.componentType === 'LARGE' ? '350px' : ''}} className='ui-block hoverbordersolid'>
                                            <div className='row'>
                                              <div className={b.topElementStyle === 'LARGE' && i === 0 ? 'col-md-12' : 'col-md-4'} style={{marginLeft: '10px'}}>
                                                <div style={{textAlign: 'left', fontWeight: 'bold'}}>{item.title}</div>
                                                <div style={{textAlign: 'left', color: 'rgb(140, 140, 140)'}}>{item.subtitle}</div>
                                              </div>
                                              {b.topElementStyle === 'LARGE' && i === 0
                                                ? null
                                              : item.image_url && item.image_url !== '' &&
                                              <img alt='' style={{maxHeight: '50px', maxWidth: '50px', float: 'right'}} src={item.image_url} />
                                            }
                                            </div>
                                            <br />
                                            {
                                              item.buttons && item.buttons.length > 0 &&
                                              item.buttons.map((button, i) => (
                                                <a key={i} href={'//' + button.url ? setWebViewUrl(button.url) : '#'} target='_blank' rel='noopener noreferrer' style={{width: '80%', marginTop: '5px', whiteSpace: 'inherit'}} className='btn btn-secondary btn-sm'>
                                                  <span>{button.title}</span>
                                                </a>
                                              ))
                                            }
                                          </div>
                                        </a>
                                        ))}
                                        {b.buttons && b.buttons.length > 0 &&
                                        b.buttons.map((button, i) => (
                                          <a key={i} href={'//' + button.url ? setWebViewUrl(button.url) : '#'} target='_blank' rel='noopener noreferrer' style={{width: '70%', marginTop: '15px', whiteSpace: 'inherit'}} className='btn btn-secondary btn-sm'>
                                            <span>{button.title}</span>
                                          </a>
                                        ))
                                        }
                                      </div>
                                  } 
                                    </div>
                                    </div>
                                  ))
                                }
                                {
                                  this.state.payload && this.state.payload.map((b, index) => {
                                    if (b.quickReplies && b.quickReplies.length > 0) {
                                      let settings = {
                                        dots: false,
                                        infinite: false,
                                        speed: 250,
                                        slidesToShow: 1,
                                        slidesToScroll: 1,
                                        arrows: b.quickReplies.length > 1 ? true : false,
                                        initialSlide: this.state.currentSlideIndex,
                                        afterChange: this.slideIndexChange
                                      }
                                      return (
                                        <div style={{maxWidth: '80%', marginLeft: '20px'}}>
                                            <Slider ref={(instance) => { this.slider = instance }}  {...settings}>
                                                {
                                                    b.quickReplies.map((reply, index) => {
                                                        console.log(`quickReplies index ${index}`, b.quickReplies)
                                                        return (
                                                            <div className='btn-toolbar' style={{padding: '10px', visibility: this.state.currentSlideIndex !== index ? 'hidden': 'visible', display: 'flex', flexWrap: 'nowrap'}} key={index}>
                                                                <button style={{margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                                                  {reply.image_url && <img src={reply.image_url} style={{marginRight: '5px', pointerEvents: 'none', zIndex: -1, borderRadius: '50%', width: '20px', height: '20px', display: 'inline'}} alt='Text' />
                                                                  }
                                                                  {reply.title.length > 20 ? reply.title.slice(0,20)+'...' : reply.title}
                                                                </button>

                                                                {
                                                                    (index+1) < b.quickReplies.length &&
                                                                    <button style={{margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                                                      {b.quickReplies[index+1].image_url && <img src={b.quickReplies[index+1].image_url} style={{marginRight: '5px', pointerEvents: 'none', zIndex: -1, borderRadius: '50%', width: '20px', height: '20px', display: 'inline'}} alt='Text' />
                                                                      }
                                                                      {b.quickReplies[index+1].title}
                                                                    </button>
                                                                }

                                                                {
                                                                    (index+2) < b.quickReplies.length &&
                                                                    <button style={{margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                                                      {b.quickReplies[index+2].image_url && <img src={b.quickReplies[index+2].image_url} style={{marginRight: '5px', pointerEvents: 'none', zIndex: -1, borderRadius: '50%', width: '20px', height: '20px', display: 'inline'}} alt='Text' />
                                                                      }
                                                                      {b.quickReplies[index+2].title}
                                                                    </button>
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Slider>
                                        </div>
                                    )
                                    } else {
                                      return null
                                    }
                                  })
                                }
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

export default ViewMessage
