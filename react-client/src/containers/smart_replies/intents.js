/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { editBot } from '../../redux/actions/smart_replies.actions'
import { loadBotIntents, createIntent, updateIntent, trainBot } from '../../redux/actions/smart_replies_intents.actions'


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
      gcpProjectId: '',
      // intents state
      newIntentName: '',
      intents: [],
      currentIntent: null,
      //other state
      disableRenameButton: true,
      errorIndex: 0,
      errorMessage: ''
    }

    this.renameBot = this.renameBot.bind(this)
    this.updateBotName = this.updateBotName.bind(this)
    this.handleEditResponse = this.handleEditResponse.bind(this)
    this.gotoUnansweredQueries = this.gotoUnansweredQueries.bind(this)
    this.gotoWaitingReply = this.gotoWaitingReply.bind(this)
    this.addQuestion = this.addQuestion.bind(this)
    this.removeQuestion = this.removeQuestion.bind(this)
    this.changeQuestion = this.changeQuestion.bind(this)
    this.createNewIntent = this.createNewIntent.bind(this)
    this.handleCreateIntent = this.handleCreateIntent.bind(this)
    this.newIntentName = this.newIntentName.bind(this)
    this.updateIntent = this.updateIntent.bind(this)
    this.clickIntent = this.clickIntent.bind(this)
  }

  clickIntent(intent, index) {
    for (let a = 0; a < this.state.intents.length; a++) {
      if(index !== a) {
        document.getElementById(`collapse_${a}`).classList.remove("show")
      }
    }

    let temp = JSON.parse(JSON.stringify(intent))
    this.setState({ currentIntent: temp })

    // warning modal when unsaved changes
    // if (this.state.currentIntent) {
    //   let tempIntent = this.props.botIntents.filter((intent) => intent._id === this.state.currentIntent._id)[0]
    //   if (JSON.stringify(tempIntent.questions) !== JSON.stringify(this.state.currentIntent.questions)) {
    //     console.log('true')
    //   }
    // }

  }

  updateIntent() {
    
    console.log(this.state.currentIntent)
    let data = {
      intentId: this.state.currentIntent._id,
      name: this.state.currentIntent.name,
      questions: this.state.currentIntent.questions,
      answer: [{ componentType: "text", text: "Test broadcast"}],
      gcpPojectId: this.state.gcpProjectId,
      dialogflowIntentId: this.state.currentIntent.dialogflowIntentId
    }
    this.props.trainBot(data, this.state.id, this.msg)
    // for (let i = 0; i < questions.length; i++) {
    //   if (questions[i] === '') {
    //     this.setState({ errorIndex: intent._id+i, errorMessage: 'Each question must have some text' })
    //   }
    // }
  }

  changeQuestion(event, index) {
    let intent = this.state.currentIntent
    intent.questions[index] = event.target.value
    this.setState({ currentIntent: intent })
  }

  removeQuestion(index) {
    let intent = this.state.currentIntent
    intent.questions.splice(index, 1)
    this.setState({
      currentIntent: intent
    })
  }

  addQuestion() {
    let intent = this.state.currentIntent
    intent.questions = intent.questions.concat([''])
    this.setState({
      currentIntent: intent
    })
  }

  newIntentName(e) {
    this.setState({ newIntentName: e.target.value })
  }

  createNewIntent() {
    let data = {
      name: this.state.newIntentName,
      botId: this.state.id
    }
    this.props.createIntent(data, this.msg, this.handleCreateIntent)
  }
  handleCreateIntent(response) {
    if (response.status === 'success') {
      this.refs.createIntent.click()
      this.setState({ newIntentName: '' })
    }
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
    if (nextProps.botIntents && nextProps.botIntents.length > 0) {
      let temp = JSON.parse(JSON.stringify(nextProps.botIntents))
      this.setState({ intents: temp })
    }
  }

  componentDidMount() {
    this.props.loadBotIntents(this.props.location.state.bot._id)
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }
    document.title = `${title} | Create Bot`;
    if (this.props.location.state && this.props.location.state.bot) {
      let botDetails = this.props.location.state.bot
      let botName = botDetails.botName
      if (botName) {
        botName = botName.split('-').join(' ')
      }
      this.setState({
        id: botDetails._id,
        botName: botName,
        page: botDetails.pageId,
        isActive: botDetails.isActive,
        gcpProjectId: botDetails.gcpPojectId
      })
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
        <a href='#/' style={{ display: 'none' }} ref='createIntent' data-toggle="modal" data-target="#createIntent">createIntent</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="createIntent" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create New Intent
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <input
                  style={{ maxWidth: '367px', float: 'left', margin: 2 }}
                  type='text'
                  className='form-control'
                  onChange={this.newIntentName} />
                <button
                  style={{ float: 'left', margin: 2 }}
                  className='btn btn-primary'
                  type='button'
                  onClick={this.createNewIntent}>
                  Create
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
                      className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                      data-target='#createIntent' data-toggle='modal' >
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
                  {
                    this.state.intents && this.state.intents.length > 0
                      ? <div className='row'>
                        <div className="input-group m-input-group m-input-group--pill col-md-12 col-lg-12 col-xl-12">
                          <span className="input-group-addon" id="basic-addon1"
                            style={{ background: 'white', borderColor: '#ccc' }}>
                            <i className="fa fa-search"></i>
                          </span>
                          <input style={{ borderLeft: 'none' }} type="text" className="form-control m-input" placeholder="Search..." aria-describedby="basic-addon1" />
                        </div>

                        <div className="input-group m-input-group m-input-group--pill col-md-12 col-lg-12 col-xl-12" style={{ padding: '20px 44px 0px 44px' }}>
                          {this.state.intents && this.state.intents.map((intent, i) =>
                            <div key={i} className='accordion' id={`accordion${i}`}>
                              <div className='card'>
                                <div className='card-header' id={`heading${i}`}>
                                  <h4 className='mb-0'>
                                    <a
                                      className='btn btn-link'
                                      data-toggle='collapse'
                                      data-target={`#collapse_${i}`}
                                      aria-expanded="true"
                                      aria-controls={`#collapse_${i}`}
                                      onClick={() => this.clickIntent(intent, i)}>
                                      {intent.name}
                                      <i id="convoTitle" className="fa fa-pencil-square-o" aria-hidden="true"
                                        style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}
                                        data-toggle='modal' data-target='#renameIntent'></i>
                                    </a>
                                  </h4>
                                </div>
                                <div id={`collapse_${i}`} className='collapse' aria-labelledby={`heading${i}`} data-parent="#accordion">
                                  <div className='card-body'>
                                    <p>Enter several variations of same  question to train the bot.</p>
                                    {this.state.currentIntent &&
                                      <div className='row'>
                                        <div className="col-md-8 col-lg-8 col-xl-8" style={{ borderRight: '1px solid #ddd' }}>
                                          {this.state.currentIntent.questions.length > 0 &&
                                            this.state.currentIntent.questions.map((question, b) => (
                                              <div data-row={b} key={b}>
                                                <div className="input-group" >
                                                  {this.state.errorIndex === intent._id + b &&
                                                    <div id='email-error' style={{ color: 'red', fontWeight: 'bold' }}><strong>{this.state.errorMessage}</strong></div>
                                                  }
                                                  <input type="text"
                                                    className="form-control form-control-danger"
                                                    value={question}
                                                    placeholder="Enter New Question Here..."
                                                    onChange={(e) => this.changeQuestion(e, b)} />
                                                  <span className="input-group-btn">
                                                    <button onClick={() => this.removeQuestion(b)} className="btn btn-danger m-btn m-btn--icon">
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
                                        <div className="col-md-4 col-lg-4 col-xl-4" style={{ textAlign: 'center' }}>
                                          <button
                                            className="btn btn btn-primary m-btn m-btn--icon"
                                            style={{ position: 'relative', top: '50%' }}>
                                            <span>
                                              <i className="la la-plus"></i>
                                              <span>
                                                Set Answer
									                            </span>
                                            </span>
                                          </button>
                                        </div>
                                        <div className="col-md-12 col-lg-12 col-xl-12"
                                          style={{ textAlign: 'right', margin: '20px 0px 10px -10px' }}>
                                          <button
                                            className="btn btn btn-secondary" style={{ marginRight: '10px' }}>
                                            Delete
                                          </button>
                                          <button
                                            className="btn btn btn-primary" onClick={this.updateIntent}>
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                              <br />
                            </div>
                          )}
                        </div>
                      </div>
                      : <div className='row'>
                        <div className="col-md-12 col-lg-12 col-xl-12">
                          <span>
                            No Data To Display
                          </span>
                        </div>
                      </div>
                  }
                </div>
                {/* <div className='m-portlet__foot m-portlet__foot--fit' style={{ 'overflow': 'auto' }}>

                </div> */}
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
      editBot: editBot,
      loadBotIntents: loadBotIntents,
      createIntent: createIntent,
      updateIntent: updateIntent,
      trainBot: trainBot
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Intents)
