/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { editBot, botDetails } from '../../redux/actions/smart_replies.actions'
import {loadBotIntents} from '../../redux/actions/smart_replies_intents.actions'


class Intents extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // bots state
      id: '',
      botName: '',
      page: '',
      isActive: '',
      renameBot: '',
      // intents state
      intents: '',
      questions: [''],
      answer: [],
      //other state
      disableRenameButton: true,
    }
    this.renameBot = this.renameBot.bind(this)
    this.updateBotName = this.updateBotName.bind(this)
    this.handleEditResponse = this.handleEditResponse.bind(this)
    this.gotoUnansweredQueries = this.gotoUnansweredQueries.bind(this)
    this.gotoWaitingReply = this.gotoWaitingReply.bind(this)
    this.addQuestion = this.addQuestion.bind(this)
    this.removeQuestion = this.removeQuestion.bind(this)
    this.changeQuestion = this.changeQuestion.bind(this)
  }

  changeQuestion(event, index) {
    let questions = this.state.questions
    for (let i = 0; i < questions.length; i++) {
      if (index === i) {
        questions[i] = event.target.value
      }
    }
    this.setState({ questions: questions })
  }

  removeQuestion(index) {
    let tempQuestions = this.state.questions
    for (let i = 0; i < tempQuestions.length; i++) {
      if (i === index) {
        tempQuestions.splice(i, 1)
      }
    }
    this.setState({
      questions: tempQuestions
    })
  }

  addQuestion() {
    let questions = this.state.questions
    questions.push('')
    this.setState({
      questions: questions
    })
  }

  gotoWaitingReply() {
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
      this.setState({ id: nextProps.showBotDetails._id, botName: botName, page: nextProps.showBotDetails.pageId, isActive: nextProps.showBotDetails.isActive })
    }
    if(nextProps.botIntents && nextProps.botIntents.length > 0) {
      this.setState({intents: nextProps.botIntents.intents})
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
      this.props.loadBotIntents(this.props.location.state)
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
                    <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                      <span>
                        <i className='la la-plus' />
                        <span>
                          New Intent
                        </span>
                      </span>
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
                      <input style={{ borderLeft: 'none' }} type="text" className="form-control m-input" placeholder="Search..." aria-describedby="basic-addon1" />
                    </div>
                    <div class="input-group m-input-group m-input-group--pill col-md-12 col-lg-12 col-xl-12" style={{ padding: '20px 44px 0px 44px' }}>
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
                          <div id='collapse_1' className='panel-collapse collapse show' aria-expanded='true'>
                            <div className='panel-body'>
                              <p>Enter several variations of same  question to train the bot.</p>
                              <div className='row'>
                                <div class="col-md-8 col-lg-8 col-xl-8" style={{ borderRight: '1px solid #ddd' }}>
                                  {
                                    this.state.questions.map((question, i) => (
                                      <div data-row={i}>
                                        <div className="input-group" >
                                          <input type="text"
                                            className="form-control form-control-danger"
                                            value={question}
                                            placeholder="Enter New Question Here..."
                                            onChange={(e) => this.changeQuestion(e, i)} />
                                          <span className="input-group-btn">
                                            <button disabled={this.state.questions.length < 2} onClick={() => this.removeQuestion(i)} className="btn btn-danger m-btn m-btn--icon">
                                              <i className="la la-close"></i>
                                            </button>
                                          </span>
                                        </div>
                                        <br />
                                      </div>
                                    ))
                                  }
                                  <br />
                                  <button onClick={this.addQuestion} className="btn btn btn-primary m-btn m-btn--icon">
                                    <span>
                                      <i className="la la-plus"></i>
                                      <span>
                                        Add
									                    </span>
                                    </span>
                                  </button>
                                </div>
                                <div class="col-md-4 col-lg-4 col-xl-4" style={{textAlign: 'center'}}>
                                  <button 
                                    className="btn btn btn-primary m-btn m-btn--icon"
                                    style={{position: 'relative', top: '50%'}}>
                                    <span>
                                      <i className="la la-plus"></i>
                                      <span>
                                        Set Answer
									                  </span>
                                    </span>
                                  </button>
                                </div>
                                <div class="col-md-12 col-lg-12 col-xl-12" 
                                  style={{textAlign: 'right', margin: '20px 0px 10px -10px'}}>
                                  <button
                                    className="btn btn btn-secondary" style={{marginRight: '10px'}}>
                                      Delete
                                  </button>
                                  <button
                                    className="btn btn btn-primary">
                                      Save
                                  </button>
                                </div>
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
    showBotDetails: (state.botsInfo.botDetails),
    botIntents: (state.botIntentsInfo.botIntents)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      botDetails: botDetails,
      editBot: editBot,
      loadBotIntents: loadBotIntents
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Intents)
