
import React from 'react'
import Slider from 'react-slick'

class PreviewQuickReplies extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentSlideIndex: this.props.quickReplies && this.props.quickReplies.length > 3 ? this.props.quickReplies.length - 3 : 0,
    }
    this.slideIndexChange = this.slideIndexChange.bind(this)

  }

  slideIndexChange (newIndex) {
      this.setState({currentSlideIndex: newIndex})
  }

  render () {
    let settings = {
        dots: false,
        infinite: false,
        speed: 250,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: this.props.quickReplies.length > 1 ? true : false,
        initialSlide: this.state.currentSlideIndex,
        afterChange: this.slideIndexChange
    };
    return (
        <div className='no-drag'>
          {this.props.quickReplies.length > 0 &&
            <div style={{maxWidth: '80%'}}>
              <Slider ref={(instance) => { this.slider = instance }}  {...settings}>
                  { this.props.quickReplies.map((reply, index) => {
                      return (
                        <div className='btn-toolbar' style={{padding: '10px', visibility: this.state.currentSlideIndex !== index ? 'hidden': 'visible', display: 'flex', flexWrap: 'nowrap'}} key={index}>
                          <button style={{margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                            {reply.image_url && <img src={reply.image_url} style={{marginRight: '5px', pointerEvents: 'none', zIndex: -1, borderRadius: '50%', width: '20px', height: '20px', display: 'inline'}} alt='Text' />
                            }
                            {reply.title.length > 20 ? reply.title.slice(0,20)+'...' : reply.title}
                          </button>

                          {
                              (index+1) < this.props.quickReplies.length &&
                              <button style={{margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                {this.props.quickReplies[index+1].title}
                              </button>
                          }

                          {
                              (index+2) < this.props.quickReplies.length &&
                              <button style={{margin: '5px', borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                {this.props.quickReplies[index+2].title}
                              </button>
                          }
                        </div>
                      )
                  })
                }
              </Slider>
            </div>
          }
        </div>
    )
  }
}
export default PreviewQuickReplies
