
import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddButton from './AddButton'
import { Popover, PopoverBody } from 'reactstrap'

import Slider from 'react-slick'

class QuickReplies extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
        quickReplies: []
    }
    this.addQuickReply = this.addQuickReply.bind(this)
  }

  addQuickReply () {
      console.log('addQuickReply')
      let quickReplies = this.state.quickReplies
      quickReplies.push({'title' : 'quick reply ' + (this.state.quickReplies.length+1)})
      this.setState({quickReplies})
  }

  render () {
    let settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1
    };
    return (
        <div>
            <Slider {...settings}>
                <div>  
                    {
                        this.state.quickReplies.map(reply => {
                            return (
                                <button style={{borderColor: 'black', borderWidth: '1px', 'color': 'black', }} className="btn m-btn--pill btn-sm m-btn btn-secondary">
                                    {reply.title}
                                </button>
                            )
                        })
                    }
                </div>
            </Slider>
            <button onClick={this.addQuickReply} style={{marginLeft: '20%', marginTop: '10px', border: 'dashed', borderWidth: '1.5px', 'color': 'black'}} className="btn m-btn--pill btn-sm m-btn hoverbordercomponent">
                + Add Quick Reply
            </button>
        </div>   
    )
  }
}

export default QuickReplies
