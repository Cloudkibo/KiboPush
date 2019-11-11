/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class Card extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.openCardUrl = this.openCardUrl.bind(this)
  }

  openCardUrl () {
    if (this.props.card.default_action) {
      window.open(this.props.card.default_action.url, '_blank')
    }
  }

  render () {
    return (
      <div className='m-messenger__message-body'>
        <div className='m-messenger__message-arrow' />
        <div className='m-messenger__message-content'>
          <div>
            <div onClick={this.openCardUrl} style={{maxWidth: 200, borderRadius: '10px'}} className='ui-block hoverbordersolid'>
              <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
                <a href={this.props.card.image_url} target='_blank' rel='noopener noreferrer'>
                  <img alt='' style={{maxWidth: 180, borderRadius: '5px'}} src={this.props.card.image_url} />
                </a>
              </div>
              <div style={{marginTop: '10px', padding: '5px'}}>
                <div style={{textAlign: 'left', fontWeight: 'bold'}}>{this.props.card.title}</div>
                <div style={{textAlign: 'left', color: '#ccc'}}>{this.props.card.subtitle}</div>
              </div>
              {
                this.props.card.buttons && this.props.card.buttons.length > 0 &&
                this.props.card.buttons.map(b => (
                  <a href={b.url} target='_blank' rel='noopener noreferrer' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                    {b.title}
                  </a>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Card
