import React from 'react'
import cookie from 'react-cookie'

class AppChooser extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedPlatform: {},
      planInfo: '',
      seenNotifications: [],
      unseenNotifications: []
    }

    this.goToSubProduct = this.goToSubProduct.bind(this)
  }

  goToSubProduct(product) {
    let productUrls = {
      'kiboengage': {
        'staging': 'https://skiboengage.cloudkibo.com/',
        'production': 'https://kiboengage.cloudkibo.com/'
      },
      'kibochat': {
        'staging': 'https://skibochat.cloudkibo.com/',
        'production': 'https://kibochat.cloudkibo.com/'
      },
      'kibodash': {
        'staging': 'https://skibodash.cloudkibo.com/',
        'production': 'https://kibodash.cloudkibo.com/'
      },
      'kibocommerce': {
        'staging': 'https://skibocommerce.cloudkibo.com/',
        'production': 'https://kibocommerce.cloudkibo.com/'
      },
      'KiboLite': {
        'staging': 'https://skibolite.cloudkibo.com/',
        'production': 'https://kibolite.cloudkibo.com/'
      },
      'KiboAPI': {
        'production': 'https://kiboapi.cloudkibo.com/',
        'staging': 'https://kiboapi.cloudkibo.com/'
      }
    }

    const environment = cookie.load('environment')
    return productUrls[product][environment]
  }

  render() {
    return (
      <li style={{ marginRight: '20px', padding: '0' }} className='m-nav__item m-topbar__quick-actions m-topbar__quick-actions--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
        <span style={{ cursor: 'pointer' }} className='m-nav__link m-dropdown__toggle'>
          <span className='m-nav__link-badge m-badge m-badge--dot m-badge--info m--hide' />
          <span className='m-nav__link-icon'>
            <i className='flaticon-app' />
          </span>
        </span>
        <div className='m-dropdown__wrapper'>
          <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
          <div className='m-dropdown__inner'>
            <div className='m-dropdown__body m-dropdown__body--paddingless'>
              <div className='m-dropdown__content'>
                <div className='m-scrollable' data-scrollable='false' data-max-height='380' data-mobile-max-height='200'>
                  <div className='m-nav-grid m-nav-grid--skin-light'>
                    <div className='m-nav-grid__row'>
                      {
                        !window.location.hostname.toLowerCase().includes('kiboengage')
                        ? <a href={this.goToSubProduct('kiboengage')} className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-network' />
                          <span className='m-nav-grid__text'>KiboEngage</span>
                        </a>
                        : <span style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                          <i className='m-nav-grid__icon flaticon-network' />
                          <span className='m-nav-grid__text'>KiboEngage</span>
                        </span>
                      }
                      {
                        !window.location.hostname.toLowerCase().includes('kibochat')
                        ? <a href={this.goToSubProduct('kibochat')} className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-speech-bubble' />
                          <span className='m-nav-grid__text'>KiboChat</span>
                        </a>
                        : <span style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                          <i className='m-nav-grid__icon flaticon-speech-bubble' />
                          <span className='m-nav-grid__text'>KiboChat</span>
                        </span>
                      }
                    </div>
                    <div className='m-nav-grid__row'>
                      {
                        !window.location.hostname.toLowerCase().includes('KiboLite')
                        ? <a href={this.goToSubProduct('KiboLite')} className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-truck' />
                          <span className='m-nav-grid__text'>KiboLite</span>
                        </a>
                        : <span style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                          <i className='m-nav-grid__icon flaticon-truck' />
                          <span className='m-nav-grid__text'>KiboLite</span>
                        </span>
                      }
                      {
                        !window.location.hostname.toLowerCase().includes('kiboapi')
                        ? <a href={this.goToSubProduct('KiboAPI')} className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-share' />
                          <span className='m-nav-grid__text'>KiboAPI</span>
                        </a>
                        : <span style={{ backgroundColor: 'aliceblue' }} className='m-nav-grid__item' disabled>
                          <i className='m-nav-grid__icon flaticon-share' />
                          <span className='m-nav-grid__text'>KiboAPI</span>
                        </span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }
}

export default AppChooser
