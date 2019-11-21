/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { editBot, botDetails } from '../../redux/actions/smart_replies.actions'


class Intents extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      botName: '',
      page: '',
      isActive: '',
      payload: [],
      renameBot: '',
      disableRenameButton: true,
    }
    this.renameBot = this.renameBot.bind(this)
    this.updateBotName = this.updateBotName.bind(this)
    this.handleEditResponse = this.handleEditResponse.bind(this)
    this.gotoUnansweredQueries = this.gotoUnansweredQueries.bind(this)
    this.gotoWaitingReply = this.gotoWaitingReply.bind(this)
  }

  gotoWaitingReply () {
    this.props.history.push({
      pathname: `/WaitingReplyList`,
      state: this.state.id
    })
  }

  gotoUnansweredQueries() {
    this.props.history.push({
      pathname: '/UnansweredQueries',
      state: this.state.id
    })
  }

  renameBot(e) {
    this.setState({ renameBot: e.target.value })
    if (this.state.renameBot === '') {
      this.setState({ disableRenameButton: true })
    } else {
      this.setState({ disableRenameButton: false })
    }
  }
  updateBotName() {
    this.props.editBot({ botId: this.state.id, botName: this.state.renameBot }, this.msg, this.handleEditResponse)
  }

  handleEditResponse(status) {
    if (status === 'success') {
      this.setState({ botName: this.state.renameBot })
      this.refs.rename.click()
      this.setState({ renameBot: '' })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.showBotDetails) {
      console.log('This is supposed to be the botDetails', nextProps.showBotDetails)
      var botName = nextProps.showBotDetails.botName
      if (botName) {
        botName = botName.split('-').join(' ')
      }
      this.setState({ id: nextProps.showBotDetails._id, botName: botName, page: nextProps.showBotDetails.pageId, isActive: nextProps.showBotDetails.isActive, payload: nextProps.showBotDetails.payload })
    }
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }
    document.title = `${title} | Create Bot`;
    if (this.props.location.state) {
      this.props.botDetails(this.props.location.state)
    }
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='renameIntent' data-toggle="modal" data-target="#renameIntent">lossData</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="renameIntent" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Rename Intent
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <input
                  style={{ maxWidth: '380px', float: 'left', margin: 2 }}
                  type='text'
                  className='form-control' />
                <button
                  style={{ float: 'left', margin: 2 }}
                  className='btn btn-primary'
                  type='button'>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='rename' data-toggle="modal" data-target="#rename">lossData</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="rename" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Rename
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <input
                  style={{ maxWidth: '380px', float: 'left', margin: 2 }}
                  onChange={this.renameBot}
                  value={this.state.renameBot}
                  placeholder={this.state.botName}
                  type='text'
                  className='form-control' />
                <button
                  style={{ float: 'left', margin: 2 }}
                  onClick={this.updateBotName}
                  className='btn btn-primary'
                  type='button'>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div id='identity' className='m-portlet m-portlet--mobile' style={{ height: '100%' }}>
                <div className='m-portlet__body'>
                  <h3 className='m-subheader__title' style={{ display: 'inline' }}>{this.state.botName}</h3>
                  <i id="convoTitle" className="fa fa-pencil-square-o" aria-hidden="true"
                    style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}
                    data-toggle='modal' data-target='#rename'></i>
                  <span style={{ float: "right" }}>
                    <a href='#/'
                      style={{ margin: '0px 16px 0px 0px' }}
                      onClick={this.gotoUnansweredQueries} >Unanswered Queries</a>
                    <a href='#/'
                      style={{ margin: '0px 16px 0px 0px' }}
                      onClick={this.gotoWaitingReply}>Waiting Subscribers</a>
                    <button
                      type="button"
                      class="btn btn-brand m-btn m-btn--custom">
                      <i className="fa fa-plus"></i> New Intent
										</button>
                  </span>
                </div>
                <hr />
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div class="input-group m-input-group m-input-group--pill col-md-12 col-lg-12 col-xl-12">
                      <span class="input-group-addon" id="basic-addon1"
                        style={{ background: 'white', borderColor: '#ccc' }}>
                        <i class="fa fa-search"></i>
                      </span>
                      <input style={{ borderLeft: 'none' }} type="text" className="form-control m-input" placeholder="Email" aria-describedby="basic-addon1" />
                    </div>
                    <div class="input-group m-input-group m-input-group--pill col-md-12 col-lg-12 col-xl-12" style={{padding: '20px 44px 0px 44px'}}>
                      <div className='panel-group accordion' id='accordion1'>
                        <div className='panel panel-default'>
                          <div className='panel-heading guidelines-heading'>
                            <h4 className='panel-title'>
                              <a 
                                className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' 
                                data-toggle='collapse'
                                data-parent='#accordion1' 
                                href='#collapse_1' 
                                aria-expanded='false'>
                                  Intent Name A
                                  <i id="convoTitle" className="fa fa-pencil-square-o" aria-hidden="true"
                                    style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}
                                    data-toggle='modal' data-target='#renameIntent'></i>
                              </a>
                            </h4>
                          </div>
                          <div id='collapse_1' className='panel-collapse collapse show' aria-expanded='true' style={{ height: '87px' }}>
                            <div className='panel-body'>
                              <p>Enter several variations of same  question to train the bot.</p>
                              <div class="col-md-8 col-lg-8 col-xl-8" style={{borderRight: '1px solid #ddd'}} >
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{ 'overflow': 'auto' }}>

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
    pages: (state.pagesInfo.pages),
    showBotDetails: (state.botsInfo.botDetails)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      botDetails: botDetails,
      editBot: editBot
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Intents)
