import React from 'react'

class RssFeed extends React.Component {
  render () {
    return (
      <div>
        <div className='m-widget5__item'>
          <div className='m-widget5__content'>
            <span style={{display:'flex'}}> 
              <h3 className='m-widget5__title'>
                {this.props.feed.title}
              </h3>
              { this.props.feed.defaultFeed && 
                <span style={{fontSize:'0.85rem'}}>
                  &nbsp;(Default)   
                </span>
              }
              </span>
            <div className='m-widget5__info'>
              <a href={this.props.feed.defaultFeed} target='_blank' rel='noopener noreferrer' className='m-widget5__info-date m--font-info'>
                {this.props.feed.feedUrl}
              </a>
              <br />
              <span className='m-widget5__info-date m--font-info'>
                <button data-toggle="modal" data-target="#deleteFeed" onClick={() => this.props.deleteFeed(this.props.feed)} className='btn btn-outline-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'>
                  <i className='la la-remove' />&nbsp;&nbsp;
                </button>
              </span>
              <span className='m-widget5__info-date m--font-info'>
                &nbsp;&nbsp;
              </span>
              <span className='m-widget5__info-date m--font-info'>
                <button onClick={() => this.props.openSettings(this.props.feed)} className='btn btn-outline-brand m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'>
                  <i className='la la-gear' />
                </button>
              </span>
              <span className='m-widget5__info-date m--font-info'>
                &nbsp;&nbsp;
              </span>
              <span className='m-widget5__info-date m--font-info'>
                <button onClick={() => this.props.gotoMessages(this.props.feed)} className='btn btn-outline-brand m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'>
                  <i className='la la-envelope' />
                </button>
              </span>
              <span className='m-widget5__info-date m--font-info'>
                &nbsp;&nbsp;
              </span>
            </div>
          </div>
          <div className='m-widget5__stats1' style={{textAlign: 'center', width: '200px'}}>
            <span className='m-widget5__title'>
              <label>Page</label>  
            </span>
            <br />
            <span className='widget5__info'>
              {this.props.page ? this.props.page.pageName: ''}
            </span>
          </div>
          <div className='m-widget5__stats1' style={{textAlign: 'center', width: '200px'}}>
            <span className='m-widget5__title'>
              <label>Subscriptions</label>  
            </span>
            <br />
            <span className='widget5__info'>
              {this.props.feed.subscriptions}
            </span>
          </div>
          <div className='m-widget5__stats2'>
          {this.props.feed.isActive
          ? 
          <button type='button' onClick={() => this.props.setStatus(this.props.feed)} className='btn m-btn--pill btn-success btn-sm m-btn m-btn--custom'>Enabled</button>
          : <button type='button' onClick={() => this.props.setStatus(this.props.feed)} className='btn m-btn--pill btn-danger btn-sm m-btn m-btn--custom'>Disabled</button>
          }
          </div>
        </div>
      </div>
    )
  }
}

export default RssFeed
