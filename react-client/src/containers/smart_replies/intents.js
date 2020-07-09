/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { editBot } from '../../redux/actions/smart_replies.actions'
import { loadBotIntents, createIntent, updateIntent, trainBot, deleteIntnet } from '../../redux/actions/smart_replies_intents.actions'
import BACKBUTTON from '../../components/extras/backButton'

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
      intents: props.location.state.intents ? props.location.state.intents : [],
      renameIntent: '',
      currentIntent: props.location.state.currentIntent ? props.location.state.currentIntent : null,
      //other state
      disableRenameButton: true,
      searchValue: props.location.state.searchValue ? props.location.state.searchValue : ''
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
    this.deleteIntnet = this.deleteIntnet.bind(this)
    this.updateIntentName = this.updateIntentName.bind(this)
    this.renameIntent = this.renameIntent.bind(this)
    this.setAnswer = this.setAnswer.bind(this)
    this.searchIntent = this.searchIntent.bind(this)
    this.handleTrainBot = this.handleTrainBot.bind(this)
    this.onBack = this.onBack.bind(this)
  }

  onBack() {
    this.props.history.push({
      pathname: '/bots'
    })
  }

  searchIntent(e) {
    this.setState({ searchValue: e.target.value })
    if (e.target.value !== '') {
      let filtered = this.props.botIntents.filter((intent) => intent.name.toLowerCase().includes(e.target.value.toLowerCase()))
      this.setState({ intents: filtered })
    } else {
      this.setState({ intents: this.props.botIntents }, () => {
        if (this.state.currentIntent !== null) {
          for (let a = 0; a < this.state.intents.length; a++) {
            if (this.state.intents[a]._id === this.state.currentIntent._id) {
              document.getElementById(`collapse_${this.state.currentIntent._id}`).classList.add("show")
            }
          }
        }
      })
    }
  }

  setAnswer() {
    let bot = {
      _id: this.state.id,
      botName: this.state.botName,
      pageId: this.state.page,
      isActive: this.state.isActive,
      gcpPojectId: this.state.gcpProjectId,
    }
    this.props.history.push({
      pathname: `/setAnswer`,
      state: Object.assign(this.state, { bot })
    })
  }

  renameIntent(e) {
    this.setState({ renameIntent: e.target.value })
    if (e.target.value === '') {
      this.setState({ disableRenameButton: true })
    } else {
      this.setState({ disableRenameButton: false })
    }
  }

  updateIntentName() {
    let data = {
      botId: this.state.id,
      intentId: this.state.currentIntent._id,
      name: this.state.renameIntent
    }
    this.props.updateIntent(data, this.msg)
    this.setState({ disableRenameButton: true, renameIntent: '' })
  }

  clickIntent(intent, state) {
    if (state === 'edit') {
      this.refs.renameIntent.click()
    } else {
      if (this.state.currentIntent !== null) {
        for (let a = 0; a < this.state.intents.length; a++) {
          if (this.state.intents[a]._id !== intent._id) {
            document.getElementById(`collapse_${this.state.intents[a]._id}`).classList.remove("show")
          }
        }
        if (this.state.currentIntent._id === intent._id) {
          this.setState({ currentIntent: null })
        } else {
          let temp = JSON.parse(JSON.stringify(intent))
          this.setState({ currentIntent: temp })
        }
      } else {
        let temp = JSON.parse(JSON.stringify(intent))
        this.setState({ currentIntent: temp })
      }
    }
  }

  deleteIntnet() {
    let data = {
      intentId: this.state.currentIntent._id,
      gcpPojectId: this.state.gcpProjectId,
      dialogflowIntentId: this.state.currentIntent.dialogflowIntentId
    }
    this.props.deleteIntnet(data, this.state.id, this.msg)
    this.setState({ currentIntent: null })
  }

  updateIntent() {
    let data = {
      intentId: this.state.currentIntent._id,
      name: this.state.currentIntent.name,
      questions: this.state.currentIntent.questions,
      answer: this.state.currentIntent.answer,
      dialogflowIntentId: this.state.currentIntent.dialogflowIntentId,
      gcpPojectId: this.state.gcpProjectId
    }
    console.log(data)
    let emptyQuestion = false
    for (let i = 0; i < data.questions.length; i++) {
      if (data.questions[i].trim() === '') {
        emptyQuestion = true
        break
      }
    }
    if (!data.questions || data.questions.length === 0) this.msg.error("Atleast one question is required")
    else if (emptyQuestion) this.msg.error("Each question must have some text")
    else if (!data.answer || data.answer.length === 0) this.msg.error("Please set the Answer")
    else this.props.trainBot(data, this.state.id, this.msg, this.handleTrainBot)
  }

  handleTrainBot(response) {
    let filtered = response.payload.filter((intent) => intent._id === this.state.currentIntent._id)[0]
    this.setState({ currentIntent: filtered })
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
    let bot = {
      _id: this.state.id,
      botName: this.state.botName,
      pageId: this.state.page,
      isActive: this.state.isActive,
      gcpPojectId: this.state.gcpProjectId,
    }
    this.props.history.push({
      pathname: `/WaitingReplyList`,
      state: Object.assign(this.state, { bot })
    })
  }

  gotoUnansweredQueries() {
    let bot = {
      _id: this.state.id,
      botName: this.state.botName,
      pageId: this.state.page,
      isActive: this.state.isActive,
      gcpPojectId: this.state.gcpProjectId,
    }
    this.props.history.push({
      pathname: `/UnansweredQueries`,
      state: Object.assign(this.state, { bot })
    })
  }

  renameBot(e) {
    this.setState({ renameBot: e.target.value })
    if (e.target.value === '') {
      this.setState({ disableRenameButton: true })
    } else {
      this.setState({ disableRenameButton: false })
    }
  }
  updateBotName() {
    this.props.editBot({ botId: this.state.id, botName: this.state.renameBot }, this.msg, this.handleEditResponse)
    this.setState({ disableRenameButton: true })
  }

  handleEditResponse(status) {
    if (status === 'success') {
      this.setState({ botName: this.state.renameBot })
      this.refs.rename.click()
      this.setState({ renameBot: '' })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.botIntents) {
      this.setState({ intents: nextProps.botIntents })
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
    if (this.props.location.state.currentIntent) {
      document.getElementById(`collapse_${this.state.currentIntent._id}`).classList.add('show')
    }
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
    console.log('current', this.state.currentIntent)
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
                  onChange={this.renameIntent}
                  value={this.state.renameIntent}
                  type='text'
                  className='form-control' />
                <button
                  style={{ float: 'left', margin: 2 }}
                  onClick={this.updateIntentName}
                  className='btn btn-primary'
                  type='button' data-dismiss='modal'
                  disabled={this.state.disableRenameButton}>
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
                  type='text'
                  className='form-control' />
                <button
                  style={{ float: 'left', margin: 2 }}
                  onClick={this.updateBotName}
                  className='btn btn-primary'
                  type='button'
                  disabled={this.state.disableRenameButton}>
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
                  value={this.state.newIntentName}
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Warning
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to delete this intent?</p>
                <button style={{ float: 'right', marginLeft: '10px' }}
                  className='btn btn-primary btn-sm'
                  onClick={this.deleteIntnet}
                  data-dismiss='modal'>Yes
                </button>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  data-dismiss='modal'>Cancel
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
                    <button
                      className='btn btn-link'
                      onClick={this.gotoUnansweredQueries} >Unanswered Queries</button>
                    <button
                      className='btn btn-link'
                      onClick={this.gotoWaitingReply}>Waiting Subscribers</button>
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
                    this.props.botIntents && this.props.botIntents.length > 0
                      ? <div className='row'>
                        <div className="input-group m-input-group m-input-group--pill col-md-12 col-lg-12 col-xl-12" style={{ padding: '20px 44px 0px 44px' }}>
                          <span className="input-group-addon" id="basic-addon1"
                            style={{ background: 'white', borderColor: '#ccc' }}>
                            <i className="fa fa-searcresolvedh"></i>
                          </span>
                          <input
                            style={{ borderLeft: 'none' }}
                            type="text"
                            className="form-control m-input"
                            placeholder="Search..."
                            aria-describedby="basic-addon1"
                            onChange={this.searchIntent}
                            value={this.state.searchValue} />
                        </div>
                        {
                          this.state.intents && this.state.intents.length > 0
                            ? <div className="input-group m-input-group m-input-group--pill col-md-12 col-lg-12 col-xl-12" style={{ padding: '20px 44px 0px 44px' }}>
                              {this.state.intents.map((intent, i) =>
                                <div key={intent._id} className='accordion' id={`accordion${intent._id}`}>
                                  <div className='card'>
                                    <div className='card-header' id={`heading${intent._id}`}>
                                      <h4 className='mb-0'>
                                        <div
                                          className='btn'
                                          data-toggle='collapse'
                                          data-target={`#collapse_${intent._id}`}
                                          aria-expanded="true"
                                          aria-controls={`#collapse_${intent._id}`}
                                          onClick={() => this.clickIntent(intent)}>
                                          {intent.name}
                                        </div>
                                        {
                                          this.state.currentIntent &&
                                          this.state.currentIntent._id === intent._id &&
                                          <i
                                            id="convoTitle"
                                            className="fa fa-pencil-square-o"
                                            aria-hidden="true"
                                            style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '20px' }}
                                            onClick={() => this.clickIntent(intent, 'edit')}
                                          />
                                        }
                                        {
                                          this.state.currentIntent &&
                                            this.state.currentIntent._id === intent._id
                                            ? <div className='btn pull-right'>
                                              <i
                                                onClick={() => this.clickIntent(intent)}
                                                style={{ fontSize: '20px' }}
                                                className='la la-angle-up'
                                                data-toggle='collapse'
                                                data-target={`#collapse_${intent._id}`}
                                              />
                                            </div>
                                            : <div className='btn pull-right'>
                                              <i
                                                onClick={() => this.clickIntent(intent)}
                                                style={{ fontSize: '20px' }}
                                                className='la la-angle-down'
                                                data-toggle='collapse'
                                                data-target={`#collapse_${intent._id}`}
                                              />
                                            </div>
                                        }
                                      </h4>
                                    </div>
                                    <div id={`collapse_${intent._id}`} className='collapse' aria-labelledby={`heading${intent._id}`} data-parent="#accordion">
                                      <div className='card-body'>
                                        <p>Enter several variations of same  question to train the bot.</p>
                                        {this.state.currentIntent &&
                                          <div className='row'>
                                            <div className="col-md-8 col-lg-8 col-xl-8" style={{ borderRight: '1px solid #ddd' }}>
                                              {this.state.currentIntent.questions.length > 0 &&
                                                this.state.currentIntent.questions.map((question, b) => (
                                                  <div data-row={b} key={b}>
                                                    <div className="input-group" >
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
                                                style={{ position: 'relative', top: '50%' }}
                                                onClick={this.setAnswer}>
                                                {(this.state.currentIntent.answer && this.state.currentIntent.answer.length > 0)
                                                  ? <span>
                                                    <i className="la la-plus"></i>
                                                    <span>
                                                      Edit Answer
                                                  </span>
                                                  </span>
                                                  : <span>
                                                    <i className="la la-plus"></i>
                                                    <span>
                                                      Set Answer
                                                  </span>
                                                  </span>
                                                }

                                              </button>
                                            </div>
                                            <div className="col-md-12 col-lg-12 col-xl-12"
                                              style={{ textAlign: 'right', margin: '20px 0px 10px -10px' }}>
                                              <button
                                                className="btn btn btn-secondary"
                                                style={{ marginRight: '10px' }}
                                                data-target='#delete'
                                                data-toggle='modal'
                                              >
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
                            : <div className='row'>
                              <div className="col-md-12 col-lg-12 col-xl-12" style={{ padding: '20px 44px 0px 44px' }}>
                                <span>
                                  No Data To Display
                              </span>
                              </div>
                            </div>
                        }
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
        <BACKBUTTON onBack={this.onBack} />
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
      trainBot: trainBot,
      deleteIntnet: deleteIntnet
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Intents)
