import React from 'react'
import { Link } from 'react-router'

class ListItem extends React.Component {
  render () {
    let icon, color, image
    if (this.props.type === 'facebook') {
      icon = 'fa fa-facebook'
      color = '#365899'
      image = 'https://cdn.cloudkibo.com/public/assets/app/media/img//logos/fb-art.png'
    } else if (this.props.type === 'youtube') {
      icon = 'fa fa-youtube'
      color = '#cc181e'
      image = 'https://cdn.cloudkibo.com/public/assets/app/media/img//logos/youtube.png'
    } else if (this.props.type === 'twitter') {
      icon = 'fa fa-twitter'
      color = '#00aced'
      image = this.props.item.payload.profile_image_url
    } else if (this.props.type === 'wordpress') {
      icon = 'fa fa-wordpress'
      color = '#365899'
      image = 'https://cdn.cloudkibo.com/public/assets/app/media/img//logos/wordpress.png'
    } else if (this.props.type === 'rss') {
      icon = 'fa fa-rss'
      color = '#365899'
      image = 'https://cdn.cloudkibo.com/public/img/rss.png'
    }
    const item = {
      title: this.props.title,
      icon: icon,
      iconColor: color,
      item: this.props.item
    }
    return (
      <div>
        <div className='m-widget5__item'>
          <div className='m-widget5__pic'>
            <img className='m-widget7__img' src={image} alt='' />
          </div>
          <div className='m-widget5__content'>
            <h4 className='m-widget5__title'>
              {this.props.title}
            </h4>
            <span className='m-widget5__desc'>
              {this.props.type}
            </span>
            <div className='m-widget5__info'>
              <span className='m-widget5__info-label'>
                Subscription URL:&nbsp;
              </span>
              <a href={this.props.item.subscriptionUrl} target='_blank' className='m-widget5__info-date m--font-info'>
                {this.props.item.subscriptionUrl}
              </a>
              <br />
              <span className='m-widget5__info-date m--font-info'>
                <Link onClick={() => this.props.updateDeleteID(this.props.item._id)} className='btn btn-outline-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'>
                  <i className='la la-remove' />&nbsp;&nbsp;
                </Link>
              </span>
              <span className='m-widget5__info-date m--font-info'>
                &nbsp;&nbsp;
              </span>
              {!this.props.marginState &&
              <span className='m-widget5__info-date m--font-info'>
                <Link onClick={() => this.props.openSettings(item)} className='btn btn-outline-brand m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'>
                  <i className='la la-gear' />
                </Link>
              </span>
              }
              <span className='m-widget5__info-date m--font-info'>
                &nbsp;&nbsp;
              </span>
              {!this.props.marginState &&
              <span className='m-widget5__info-date m--font-info'>
                <Link onClick={() => this.props.gotoMessages(this.props.item)} className='btn btn-outline-brand m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'>
                  <i className='la la-envelope' />
                </Link>
              </span>
              }
              <span className='m-widget5__info-date m--font-info'>
                &nbsp;&nbsp;
              </span>
              {this.props.type === 'wordpress' &&
              <span className='m-widget5__info-date m--font-info'>
                <Link style={{color: '#36a3f7'}} onClick={() => this.props.openGuidelines()} className='btn btn-outline-brand m-btn m-btn--icon btn-sm m-btn--pill m-btn--air'>
                  View Integration Guideliness
                </Link>
              </span>
              }
            </div>
          </div>
          <div className='m-widget5__stats1'>
            <span className='m-widget5__number'>
              Status
            </span>
            <br />
            <span className='m-widget5__sales'>
              {this.props.item.isActive ? 'Active' : 'Disabled'}
            </span>
          </div>
          {this.props.marginState
          ? <div className='m-widget5__stats2'>
            <span className='m-widget5__number' style={{marginRight: '20px'}}>
              Filter
            </span>
            <br />
            <span className='m-widget5__votes' style={{marginRight: '16px'}}>
              {this.props.item.isSegmented ? 'Filtered' : 'No Filter'}
            </span>
          </div>
          : <div className='m-widget5__stats2'>
            <span className='m-widget5__number'>
              Filter
            </span>
            <br />
            <span className='m-widget5__votes'>
              {this.props.item.isSegmented ? 'Filtered' : 'No Filter'}
            </span>
          </div>
        }
        </div>
      </div>
    )
  }
}

export default ListItem
