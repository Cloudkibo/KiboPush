// /* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import ReactPlayer from 'react-player'
import Gallery from '../../components/SimplifiedBroadcastUI/PreviewComponents/Gallery'


// import MediaCapturer from 'react-multimedia-capture'

class CommentCapturePreview extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }
  render () {
    return (
      <div className='row'>
        <div className='col-12'>
            <div className='m-widget3'>
              <div className='m-widget3__item'>
                  <div className='m-widget3__header'>
                    <div className='m-widget3__user-img'>
                      <img alt='' className='m-widget3__img' src={this.props.selectedPage.pagePic} />
                    </div>
                    <div className='m-widget3__info'>
                      <span className='m-widget3__username'>
                        {this.props.selectedPage.pageName}
                      </span>
                      <br/>
                      <span className='m-widget3__time'>
                        Just Now
                      </span>
                    </div>
                  </div>
                  <div className='m-widget3__body' style={{height:'300px', overflow: 'auto'}}>
                    <p className='widget3__text'>{this.props.postText}</p>
                    {  this.props.attachments.length > 0 && this.props.postType === 'images' &&
                    this.props.attachments.map((attachment, i) => (
                      <div key={i} className='col-12'>
                        <div className='ui-block'>
                          <img src={attachment.url} alt='' style={{maxWidth: '400px', maxHeight: '200px'}} />
                        </div>
                      </div>
                    ))
                    }
                    { this.props.attachments.length > 0 && this.props.postType === 'video' &&
                    <ReactPlayer
                      url={this.props.attachments[0].url}
                      controls
                      width='100%'
                      height='auto'
                      onPlay={this.onTestURLVideo(this.props.attachments[0].url)}
                    />
                    }
                    { this.props.cards.length > 0 && this.props.postType === 'links' &&
                      <Gallery
                        module='commentcapture'
                        cards={this.props.cards}
                        links={this.props.links}
                        pages={[this.props.selectedPage._id]}
                      />
                    }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CommentCapturePreview
