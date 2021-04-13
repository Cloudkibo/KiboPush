/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import CONFIRMATIONMODAL from '../../components/extras/confirmationModal'
import { fetchBigCommerceStore, fetchShopifyStore, installShopify } from '../../redux/actions/commerce.actions'

class CommerceIntegration extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      openVideo: false,
      shopifyDomain: '',
      commerceIntegration: {
        name: 'Commerce Integration',
        icon: 'fa fa-cart-plus',
        description: 'Commerce Integration allows you to create Ecommerce Chatbots which can handle the entire customer purchase journey through messages.',
        color: '#4A8CFF'
      }
    }
    props.fetchBigCommerceStore()
    props.fetchShopifyStore()
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
    this.getStoreType = this.getStoreType.bind(this)
    this.updateShopifyDomain = this.updateShopifyDomain.bind(this)
    this.submit = this.submit.bind(this)
  }

  openVideoTutorial() {
    this.setState({
      openVideo: true
    })
    this.refs.videoTutorial.click()
  }

  getStoreType() {
    if (this.props.store && this.props.store.storeType === 'shopify') {
      return "Shopify"
    } else if (this.props.store && this.props.store.storeType === 'bigcommerce') {
      return "BigCommerce"
    } else {
      return "E-Commerce"
    }
  }

  updateShopifyDomain(e) {
    this.setState({ shopifyDomain: e.target.value })
  }

  submit() {
    this.props.installShopify({ shop: this.state.shopifyDomain })
    // window.location.replace('/api/shopify?shop=' + this.state.shopifyDomain)
  }

  render() {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <button ref='toggleDisconnect' data-toggle='modal' data-target='#_confirm_disconnect' style={{ display: 'none' }} />
        {
          this.props.store && this.props.store.storeType === 'shopify' &&
          <a target='_blank' rel='noopener noreferrer' href="https://partners.shopify.com/1033294/apps/2954997/test" ref='disconnect' style={{ display: 'none' }}> </a>
        }
        {
          this.props.store && this.props.store.storeType === 'bigcommerce' &&
          <a target='_blank' rel='noopener noreferrer' href="https://store-970gsssotw.mybigcommerce.com/manage/marketplace/apps/25642" ref='disconnect' style={{ display: 'none' }}> </a>
        }
        <CONFIRMATIONMODAL
          id='_confirm_disconnect'
          title={`Disconnect ${this.getStoreType()} Integration`}
          description={`Are you sure you want to disconnect this ${this.getStoreType()} integration? By Clicking on "Yes", you will be redirected to the ${this.getStoreType()} page from where you can uninstall our app.`}
          onConfirm={() => {
            if (this.props.superUser) {
              this.msg.error('You are not allowed to perform this action')
            } else {
              this.refs.disconnect.click()
            }
          }}
        />
        <button style={{ display: 'none' }} ref='videoTutorial' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoTutorial">videoTutorial</button>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoTutorial" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Video Tutorial
                </h5>
                <button
                  style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({
                      openVideo: false
                    })
                  }}
                >
                  <span aria-hidden="true">
                    &times;
                  </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                {
                  this.state.openVideo &&
                  <YouTube
                    videoId='qATErwH93f0'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0
                      }
                    }}
                  />
                }
              </div>
            </div>
          </div>
        </div>
        <div style={{height: '82vh'}} className='m-portlet m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Commerce Integration
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
              <div style={{ textAlign: 'center' }} className='alert m-alert m-alert--default' role='alert'>
                Need help in understanding Commerce Integration? Here is the <a href={this.props.user.platform === 'whatsApp' ? 'https://kibopush.com/whatsapp-commerce-chatbot/' : this.props.user.platform === 'sms' ? 'https://kibopush.com/sms-commerce-chatbot/' : 'https://kibopush.com/messenger-commerce-chatbot/'} target='_blank' rel='noopener noreferrer'>documentation</a>.
                {/* Or check out this  <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a> to understand this feature. */}
              </div>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div>
                    <div style={{ padding: '5px', paddingLeft: '20px' }} className='alert m-alert--default'>
                      <div className='tab-content'>
                        <div className='tab-pane active' id='m_widget4_tab1_content'>
                          <div className='m-widget4'>

                            <div className='m-widget4__item'>
                              <div className='m-widget4__img m-widget4__img--logo'>
                                <span className='btn btn-success m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill' style={{ width: '50px', height: '50px', cursor: 'initial', backgroundColor: 'white', borderColor: this.state.commerceIntegration.color }}>
                                  <i className={this.state.commerceIntegration.icon} style={{ color: this.state.commerceIntegration.color, fontSize: 'x-large' }}></i>
                                </span>
                              </div>
                              <span style={{ paddingLeft: '25px' }} className='m-widget4__ext'>
                                {this.state.commerceIntegration.description}
                              </span>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    <div>

                      {
                        this.props.store &&
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }} className='m-widget4'>
                          <div style={{ borderBottom: '1px dashed', paddingBottom: '25px' }} className='m-widget4__item'>
                            <div className='m-widget4__img'>
                              <span className='btn m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill' style={{ marginTop: '10px', width: '100px', cursor: 'initial', backgroundColor: 'white' }}>
                                {
                                  this.props.store.storeType === 'shopify' &&
                                  <img alt='' style={{ width: '100%' }} src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/1280px-Shopify_logo_2018.svg.png' />
                                }
                                {
                                  this.props.store.storeType === 'bigcommerce' &&
                                  <img alt='' style={{ width: '100%' }} src='https://s3.amazonaws.com/www1.bigcommerce.com/assets/mediakit/downloads/BigCommerce-logo-dark.png' />
                                }

                              </span>
                            </div>
                            <div className='m-widget4__info' style={{ paddingLeft: '50px' }}>
                              <span className='m-widget4__title'>
                                {this.props.store.name}
                              </span>
                            </div>
                            <span className='m-widget4__ext' style={{ paddingLeft: '50px' }}>
                              <button data-toggle='modal' data-target='#_confirm_disconnect' className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger' style={{ borderColor: '#f4516c', color: '#f4516c', marginRight: '10px' }}>
                                Disconnect
                              </button>
                            </span>
                            <hr style={{ borderTop: '1px dashed #36a3f7' }} />
                          </div>
                        </div>
                      }
                    </div>


                    {
                      !this.props.store &&
                        <div>
                          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="connect" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div style={{ display: 'block' }} className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLabel">
                                    Connect Shopify
                                  </h5>
                                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">
                                      &times;
                                    </span>
                                  </button>
                                </div>
                                <div style={{ color: 'black' }} className="modal-body">
                                  <div className='m-form'>
                                    <span>Enter your shopify domain name such as my-store.myshopify.com:</span>
                                    <div className='form-group m-form__group'>
                                      <div id='question' className='form-group m-form__group'>
                                        <label className='control-label'>Shopify Domain</label>
                                        <input className='form-control' value={this.state.shopifyDomain} onChange={(e) => this.updateShopifyDomain(e)} />
                                      </div>
                                    </div>
                                    <div className='m-portlet__foot m-portlet__foot--fit' style={{ 'overflow': 'auto' }}>
                                      <div className='m-form__actions' style={{ 'float': 'right' }}>
                                        <button className='btn btn-primary' data-dismiss="modal" aria-label="Close"
                                          onClick={this.submit}> Submit
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                          <button
                            onClick={() => {
                              if (this.props.superUser) {
                                this.msg.error('You are not allowed to perform this action')
                              } else {
                                // window.location.replace('https://partners.shopify.com/1033294/apps/2954997/test')
                              }
                            }}
                            style={{ border: '1px dashed #36a3f7', cursor: 'pointer' }}
                            type="button"
                            className="btn m-btn--pill btn-outline-info m-btn m-btn--custom"
                            data-toggle="modal" data-target="#connect"
                          >
                            {'+ Connect Shopify'}
                          </button>
                        </div>

                          {
                            this.props.user.currentPlan.unique_ID !== 'plan_E' && this.props.user.platform !== 'sms' &&
                              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
                                <button
                                  onClick={() => {
                                    if (this.props.superUser) {
                                      this.msg.error('You are not allowed to perform this action')
                                    } else {
                                      window.location.replace('https://store-970gsssotw.mybigcommerce.com/manage/marketplace/apps/25642')
                                    }
                                  }}
                                  style={{ border: '1px dashed #36a3f7', cursor: 'pointer' }}
                                  type="button"
                                  className="btn m-btn--pill btn-outline-info m-btn m-btn--custom"
                                >
                                  {'+ Connect BigCommerce'}
                                </button>
                              </div>
                          }
                      </div>
                    }
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
function mapStateToProps(state) {
  return {
    user: (state.basicInfo.user),
    store: (state.commerceInfo.store),
    superUser: (state.basicInfo.superUser)
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchBigCommerceStore,
    fetchShopifyStore,
    installShopify
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CommerceIntegration)
