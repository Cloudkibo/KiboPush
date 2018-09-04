/* eslint-disable no-useless-constructor */
import React from 'react'
class AutopostingDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
  }
  
  render () {
    console.log("Props Received to Autposting", this.props)
    return (
      <div className='col-xl-12'>
        <div className='m-portlet m-portlet--full-height m-portlet--skin-light m-portlet--fit'>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text substring-dashboard'>
                  Autoposting Details
                </h3>
              </div>
            </div>
            <div className='m-portlet__head-tools' />
          </div>
          <div className='m-portlet__body'>
            <div className='m-widget21'>
              <div className='row'>
                <div className='col-xl-4'>
                  <div className='m-widget21__item'>
                    <span className='m-widget21__icon'>
                      <a className='btn btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                        <i className='fa flaticon-user-ok m--font-light' />
                      </a>
                    </span>
                    <div className='m-widget21__info'>
                      <span className='m-widget21__title'>
                        {(this.props.autopostingStats && this.props.autopostingStats.twitterAutoposting) ? this.props.autopostingStats.twitterAutoposting : 0}
                      </span>
                      <br />
                      <span className='m-widget21__sub'>
                          Twitter Count
                        </span>
                    </div>
                  </div>
                </div>
                <div className='col-xl-4'>
                  <div className='m-widget21__item'>
                    <span className='m-widget21__icon'>
                      <a className='btn btn-accent m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                        <i className='fa fa-thumbs-o-up m--font-light' />
                      </a>
                    </span>
                    <div className='m-widget21__info'>
                      <span className='m-widget21__title'>
                      {(this.props.autopostingStats && this.props.autopostingStats.facebookAutoposting) ? this.props.autopostingStats.facebookAutoposting : 0}
                      </span>
                      <br />
                      <span className='m-widget21__sub'>
                          Facebook Count
                        </span>
                    </div>
                  </div>
                </div>
                <div className='col-xl-4'>
                  <div className='m-widget21__item'>
                    <span className='m-widget21__icon'>
                      <a className='btn btn-warning m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                        <i className='fa flaticon-users m--font-light' />
                      </a>
                    </span>
                    <div className='m-widget21__info'>
                      <span className='m-widget21__title'>
                      {(this.props.autopostingStats && this.props.autopostingStats.wordpressAutoposting) ? this.props.autopostingStats.wordpressAutoposting : 0}
                      </span>
                      <br />
                      <span className='m-widget21__sub'>
                          Wordpress Count
                        </span>
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

export default AutopostingDetails
