/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadBotsList, updateStatus, createBot, deleteBot, loadAnalytics } from '../../redux/actions/smart_replies.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import AlertMessage from '../../components/alertMessages/alertMessage'
import YouTube from 'react-youtube'
import { RingLoader } from 'halogenium'

class Bot extends React.Component {
  constructor(props, context) {
    props.loadBotsList()
    props.loadMyPagesList()
    super(props, context)
    this.state = {
      botsData: [],
      totalLength: 0,
      isShowingModal: false,
      isShowingModalDelete: false,
      deleteid: '',
      name: '',
      pageSelected: '',
      isActive: true,
      error: false,
      filterValue: '',
      statusFilterValue: '',
      searchValue: '',
      createBotDialogButton: false,
      pageNumber: 0,
      filter: false,
      pages: [],
      showDropDown: false,
      responded: 0,
      total: 0,
      notResponded: 0,
      password: '',
      errorMessage: '',
      loader: false,
      openVideo: false
    }
    this.gotoCreate = this.gotoCreate.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.gotoEdit = this.gotoEdit.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.updateName = this.updateName.bind(this)
    this.changePage = this.changePage.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.changeStatusCheckBox = this.changeStatusCheckBox.bind(this)
    this.searchBot = this.searchBot.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.onStatusFilter = this.onStatusFilter.bind(this)
    this.updateAllowedPages = this.updateAllowedPages.bind(this)
    this.showDropdown = this.showDropdown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.handleResponseCreate = this.handleResponseCreate.bind(this)
    this.handleResponseDelete = this.handleResponseDelete.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoBot.click()
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Bots`;
  }

  showDialog() {
    if (this.state.pages.length === 0) {
      this.msg.error('You have already added bots on all pages.')
      return
    }
    this.refs.create.click()
    this.setState({ isShowingModal: true })
  }

  closeDialog() {
    this.setState({ isShowingModal: false })
  }
  showDialogDelete(id) {
    this.setState({ isShowingModalDelete: true })
    this.setState({ deleteid: id })
    this.refs.delete.click()
  }

  closeDialogDelete() {
    this.setState({ loader: true })
    this.props.deleteBot(this.state.deleteid, this.state.password, this.msg, this.handleResponseDelete)
    this.setState({ isShowingModalDelete: false })
  }

  handleResponseDelete(status) {
    if (status === 'success') {
      this.refs.delete.click()
      this.setState({ deleteid: '', password: '' })
    }
    this.setState({ loader: false })
  }
  onPasswordChange(e) {
    this.setState({ password: e.target.value })
  }
  UNSAFE_componentWillMount() {
    //  document.title('KiboPush | Poll')
  }

  displayData(n, bots) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > bots.length) {
      limit = bots.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = bots[i]
      index++
    }
    this.setState({ botsData: data })
  }

  handlePageClick(data) {
    // this.setState({pageSelected: data.selected})
    // if (data.selected === 0) {
    //   this.props.loadBotsListNew({last_id: 'none', number_of_records: 10, first_page: true, filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, page_value: this.state.filterValue}})
    // } else {
    //   this.props.loadBotsListNew({last_id: this.props.bots.length > 0 ? this.props.bots[this.props.bots.length - 1]._id : 'none', number_of_records: 10, first_page: false, filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, page_value: this.state.filterValue}})
    // }
    this.displayData(data.selected, this.props.bots)
  }

  updateName(e) {
    var name = e.target.value.replace('-', '')
    this.setState({ name: name, error: false, errorMessage: '' })
  }

  handleFilter(search, page, status) {
    let filtered = []
    if (search !== '' && page === '' && status === '') {
      for (let i = 0; i < this.props.bots.length; i++) {
        if (this.props.bots[i].botName.toLowerCase().includes(search.toLowerCase())) {
          filtered.push(this.props.bots[i])
        }
      }
    } else if (search === '' && page !== '' && status === '') {
      filtered = this.props.bots.filter((b) => b.pageId._id === page)
    } else if (search === '' && page === '' && status !== '') {
      filtered = this.props.bots.filter((b) => b.isActive === status)
    } else if (search !== '' && page !== '' && status === '') {
      for (let i = 0; i < this.props.bots.length; i++) {
        if (
          this.props.bots[i].botName.toLowerCase().includes(search.toLowerCase()) &&
          this.props.bots[i].pageId._id === page
        ) {
          filtered.push(this.props.bots[i])
        }
      }
    } else if (search !== '' && page === '' && status !== '') {
      for (let i = 0; i < this.props.bots.length; i++) {
        if (
          this.props.bots[i].botName.toLowerCase().includes(search.toLowerCase()) &&
          this.props.bots[i].isActive === status
        ) {
          filtered.push(this.props.bots[i])
        }
      }
    } else if (search === '' && page !== '' && status !== '') {
      filtered = this.props.bots.filter((b) => (b.pageId._id === page && b.isActive === status))
    } else if (search !== '' && page !== '' && status !== '') {
      for (let i = 0; i < this.props.bots.length; i++) {
        if (
          this.props.bots[i].botName.toLowerCase().includes(search.toLowerCase()) &&
          this.props.bots[i].isActive === status &&
          this.props.bots[i].pageId._id === page
        ) {
          filtered.push(this.props.bots[i])
        }
      }
    } else {
      filtered = this.props.bots
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
    // console.log('filtered', filtered)
  }
  searchBot(e) {
    this.setState({ searchValue: e.target.value })
    this.handleFilter(e.target.value, this.state.filterValue, this.state.statusFilterValue)

  }
  onFilter(e) {
    this.setState({ filterValue: e.target.value })
    this.handleFilter(this.state.searchValue, e.target.value, this.state.statusFilterValue)
  }

  onStatusFilter(e) {
    this.setState({ statusFilterValue: e.target.value })
    this.handleFilter(this.state.searchValue, this.state.filterValue, e.target.value)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextprops in bots.js', nextProps)
    if (nextProps.bots && nextProps.bots.length > 0) {
      this.displayData(0, nextProps.bots)
      //  this.updateAllowedPages(nextProps.pages, nextProps.bots)
      this.setState({ totalLength: nextProps.bots.length })
      var responded = 0
      var total = 0
      var notResponded = 0
      for (let i = 0; i < nextProps.bots.length; i++) {
        responded = responded + nextProps.bots[i].hitCount
        total = total + nextProps.bots[i].hitCount + nextProps.bots[i].missCount
        notResponded = notResponded + nextProps.bots[i].missCount
      }
      this.setState({ responded: responded, total: total, notResponded: notResponded })
    } else {
      this.setState({ botsData: [], totalLength: 0 })
    }
    if (nextProps.pages && nextProps.pages.length > 0 && nextProps.bots) {
      // this.state.pageSelected = nextProps.pages[0]._id
      this.updateAllowedPages(nextProps.pages, nextProps.bots)
    }
  }

  updateAllowedPages(pages, bots) {
    var temp = pages.filter((page) => {
      for (let i = 0; i < bots.length; i++) {
        // console.log('Comparing the two', bots[i].pageId._id, page._id, bots[i].pageId._id === page._id)
        if (bots[i].pageId._id === page._id) {
          return false
        }
      }
      return true
    })
    // console.log('Updating the allowed pages', temp)
    this.setState({ pages: temp, pageSelected: temp && temp.length > 0 ? temp[0]._id : [] })
  }

  changePage(e) {
    this.setState({ pageSelected: e.target.value })
  }

  changeStatus(e) {
    console.log('e.target.value', e.target.value)
    this.setState({ isActive: e.target.value })
  }
  changeStatusCheckBox(botId, enable) {
    if (enable === 'true') {
      this.props.updateStatus({ botId: botId, isActive: 'false' })
      this.setState({ isActive: 'false' })
    } else {
      this.props.updateStatus({ botId: botId, isActive: 'true' })
      this.setState({ isActive: 'true' })
    }
  }

  gotoView(bot) {
    this.props.history.push({
      pathname: `/intents`,
      state: { bot }
    })
    // this.props.history.push(`/pollResult/${poll._id}`)
  }

  gotoEdit(bot) {
    this.props.history.push({
      pathname: `/editBot`,
      state: bot
    })
    // this.props.history.push(`/pollResult/${poll._id}`)
  }

  gotoWaitingReply(bot) {
    this.props.history.push({
      pathname: `/WaitingReplyList`,
      state: bot
    })
    // this.props.history.push(`/pollResult/${poll._id}`)
  }


  showDropdown() {
    this.setState({ showDropDown: true })
  }

  hideDropDown() {
    this.setState({ showDropDown: false })
  }

  gotoCreate() {
    if (this.state.name === '') {
      this.setState({ error: true, errorMessage: 'Please enter a name' })
    } else if (this.state.name.length > 25) {
      this.setState({ error: true, errorMessage: 'Please enter a valid name (Name must be at most 25 charachters long)' })
    } else if (!/^[a-zA-Z]*$/g.test(this.state.name)) {
      this.setState({ error: true, errorMessage: 'Please enter a valid name (Name should not contain any number)' })
    } else {
      this.setState({ loader: true })
      var botName = this.state.name.trim()
      botName = botName.replace(/\s+/g, '-')
      this.props.createBot({
        botName: botName,
        pageId: this.state.pageSelected,
      }, this.msg, this.handleResponseCreate)
    }
  }

  handleResponseCreate(res) {
    if (res.status === 'success') {
      this.refs.create.click()
      this.props.history.push({
        pathname: `/intents`,
        state: { bot: res.payload }
      })
    }
    this.setState({ loader: false })
  }

  render() {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('render', this.state.loader)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {
          this.state.loader
          &&
          <div style={{ width: '100vw', height: '100vh', background: 'rgba(33, 37, 41, 0.6)', position: 'fixed', zIndex: '99999', top: '0px' }}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
              className='align-center'>
              <center><RingLoader color='#716aca' /></center>
            </div>
          </div>
        }
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='videoBot' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoBot">videoBot</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoBot" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Dashboard Video Tutorial
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" 
                aria-label="Close"
                onClick={() => {
                  this.setState({
                    openVideo: false
                  })}}>
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
              {this.state.openVideo && <YouTube
                  videoId='dhLolxFQPkE'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
                }
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='create' data-toggle="modal" data-target="#create">create</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create Bot
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div className='m-form'>
                  <div id='question' className='form-group m-form__group'>
                    <label className='control-label'>Bot Name:</label>
                    {this.state.error &&
                      <div id='email-error' style={{ color: 'red', fontWeight: 'bold' }}><strong>{this.state.errorMessage}</strong></div>
                    }
                    <input className='form-control' placeholder='Enter bot name here'
                      value={this.state.name} onChange={(e) => this.updateName(e)} />
                  </div>
                  <div className='form-group m-form__group'>
                    <label className='control-label'>Assigned to Page:</label>
                    <select className='custom-select' id='m_form_type' style={{ width: '100%', display: 'block' }} tabIndex='-98' value={this.state.pageSelected} onChange={this.changePage}>
                      {
                        this.state.pages.map((page, i) => (
                          <option key={i} value={page._id}>{page.pageName}</option>
                        ))
                      }
                    </select>
                  </div>
                  {/* <div className='form-group m-form__group'>
                    <label className='control-label'>Status:&nbsp;&nbsp;&nbsp;</label>
                    <select className='custom-select' id='m_form_type' style={{ width: '250px' }} tabIndex='-98' value={this.state.isActive} onChange={this.changeStatus}>
                      <option key='2' value='true'>Active</option>
                      <option key='3' value='false'>Disabled</option>
                    </select>
                  </div> */}
                </div>
                <br />
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: '5px', float: 'right' }}>
                    <button className='btn btn-primary' disabled={this.state.createBotDialogButton} id="m_blockui_4_3" onClick={() => this.gotoCreate()}>
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='delete' data-toggle="modal" data-target="#delete">delete</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Deleting the bot
							  </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Deleting the bot will remove all the data related to the bot.</p>
                <br />
                <div id='question' className='form-group m-form__group'>
                  <label className='control-label'>To continue, first verify it's you</label>
                  <input className='form-control' type='password' placeholder='Enter password here'
                    value={this.state.password} onChange={this.onPasswordChange} />
                </div>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  disabled={this.state.password === ''}
                  onClick={() => {
                    // this.props.deleteBot(this.state.deleteid, this.msg)
                    this.closeDialogDelete()
                  }}>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="password" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Verification
							  </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to delete this bot?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deleteBot(this.state.deleteid, this.msg)
                    this.closeDialogDelete()
                  }} data-dismiss='modal'>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Bots</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            this.props.user && this.props.user.role !== 'agent' && this.props.pages && this.props.pages.length === 0 &&
            <AlertMessage type='page' />
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding bots? Here is the <a href='https://kibopush.com/smart-replies/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
            </div>
          </div>

          {/* <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Bots might take 30mins to 1 hour to train. Please test the bot after 1 hour to see if it is working
            </div>
          </div> */}
          <div className='row'>
            <div className='col-xl-12'>
              <div className='row m-row--full-height'>
                <div className='col-sm-4 col-md-4 col-lg-4' style={{ height: 'fit-content' }}>
                  <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-brand'>
                    <div className='m-portlet__body'>
                      <div className='m-widget26'>
                        <div className='m-widget26__number'>{this.state.total}
                          <small>
                            Total Queries
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-sm-4 col-md-4 col-lg-4' style={{ height: 'fit-content' }}>
                  <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-success'>
                    <div className='m-portlet__body'>
                      <div className='m-widget26'>
                        <div className='m-widget26__number'>{this.state.responded}
                          <small>
                            Responded
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-sm-4 col-md-4 col-lg-4' style={{ height: 'fit-content' }}>
                  <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-danger'>
                    <div className='m-portlet__body'>
                      <div className='m-widget26'>
                        <div className='m-widget26__number'>{this.state.notResponded}
                          <small>
                            Not Responded
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Smart Agents
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    {
                      this.props.pages && this.props.pages.length === 0
                        ? <div>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog} >
                            <span>
                              <i className='la la-plus' />
                              <span>
                                Create New
                            </span>
                            </span>
                          </button>
                        </div>
                        : <div>
                          {this.props.user && this.props.user.role !== 'agent' &&
                            <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog}>
                              <span>
                                <i className='la la-plus' />
                                <span>
                                  Create New
                            </span>
                              </span>
                            </button>
                          }
                        </div>
                    }
                  </div>
                </div>
                {
                  this.props.bots && this.props.bots.length > 0
                  ? <div className='m-portlet__body'>
                    <div className='row align-items-center'>
                      <div className='col-xl-8 order-2 order-xl-1' />
                      <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                      </div>
                      <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4'>
                        <input type='text' placeholder='Search bots by name...' className='form-control m-input m-input--solid' onChange={this.searchBot} />
                        <span className='m-input-icon__icon m-input-icon__icon--left'>
                          <span><i className='la la-search' /></span>
                        </span>
                      </div>
                      <div className='m-form__group m-form__group--inline col-md-4 col-lg-4 col-xl-4 row align-items-center' style={{ margin: '10px' }}>
                        <select className="form-control m-input m-input--square" id='m_form_status' tabIndex='-98' value={this.state.filterValue} onChange={this.onFilter}>
                          <option value='' disabled>Filter by Pages...</option>
                          {
                            this.props.pages && this.props.pages.length > 0 &&
                            this.props.pages.map((page, i) => (
                              <option key={i} value={page._id}>{page.pageName}</option>
                            ))
                          }
                          <option value=''>All</option>
                        </select>
                      </div>
                      <div className='m-form__group m-form__group--inline col-md-4 col-lg-4 col-xl-4 row align-items-center'>
                        <select className="form-control m-input m-input--square" id='m_form_status' tabIndex='-98' value={this.state.statusFilterValue} onChange={this.onStatusFilter}>
                          <option value='' disabled>Filter by Status...</option>
                          <option value='true'>Active</option>
                          <option value='false'>Disabled</option>
                          <option value=''>All</option>
                        </select>
                      </div>
                    </div>
                    <br />
                    {this.state.botsData && this.state.botsData.length > 0
                      ? <div className="m-widget5">
                        {this.state.botsData.map((bot, i) => (
                          <div className="m-widget5__item" key={bot._id}>
                            <div className="m-widget5__pic" onClick={() => this.gotoView(bot)} style={{ cursor: 'pointer' }}>
                              <img
                                className="m-widget7__img"
                                src={bot.pageId.pagePic}
                                alt=""
                                style={{ borderRadius: '65px', width: '68px', height: '68px' }} />
                            </div>
                            <div className="m-widget5__content" onClick={() => this.gotoView(bot)} style={{ cursor: 'pointer' }}>
                              <h4 className="m-widget5__title" style={{ marginTop: '10px' }}>
                                {bot.botName ? bot.botName.split('-').join(' ') : ''}
                              </h4>
                              <div className="m-widget5__info">
                                <span className="m-widget5__info-label" style={{ marginRight: '5px' }}>
                                  Page:
                                </span>
                                <span className="m-widget5__info-author-name">
                                  {bot.pageId.pageName}
                                </span>
                              </div>
                            </div>
                            <div
                              className="m-widget5__stats1"
                              style={{
                                textAlign: 'center',
                                width: '12rem',
                                paddingLeft: '0px'
                              }}>
                              <span className="m-widget5__number">
                                {bot.hitCount ? bot.hitCount : 0}
                              </span>
                              <br />
                              <span className="m-widget5__sales">
                                Responded
                              </span>
                            </div>
                            <div
                              className="m-widget5__stats2"
                              style={{
                                textAlign: 'center',
                                width: '12rem',
                                paddingLeft: '0px'
                              }}>
                              <span className="m-widget5__number">
                                {bot.missCount ? bot.missCount : 0}
                              </span>
                              <br />
                              <span className="m-widget5__votes">
                                Not Responded
                              </span>
                            </div>
                            <div
                              className="m-widget5__stats2"
                              style={{
                                textAlign: 'center',
                                width: '12rem',
                                paddingLeft: '0px'
                              }}>
                              <span className="m-widget5__number">
                                <span className="m-widget5__votes m-switch m-switch--outline m-switch--icon m-switch--success">
                                  <label>
                                    <input type="checkbox" onChange={() => { this.changeStatusCheckBox(bot._id, bot.isActive) }} checked={bot.isActive === 'false' ? false : true} name="" />
                                    <span></span>
                                  </label>
                                </span>
                              </span>
                            </div>
                            <div
                              className="m-widget5__stats2"
                              style={{
                                textAlign: 'center',
                                width: '7.1rem',
                                color: 'red',
                                paddingLeft: '0px'
                              }}>
                              <span
                                onClick={() => this.showDialogDelete(bot._id)}
                                style={{ cursor: 'pointer' }}
                              >
                                <span className="m-widget5__number">
                                  <i
                                    className='la la-trash-o'
                                    style={{
                                      fontSize: '26px',
                                      paddingLeft: '0px',
                                      color: 'red',
                                    }} />
                                </span>
                                <br />
                                <span className="m-widget5__votes" style={{ color: 'red' }}>
                                  Delete
                                </span>
                              </span>
                            </div>
                          </div>
                        ))
                        }
                      </div>
                      : <span>
                        <p> No data to display </p>
                      </span>
                    }
                  </div>
                  : <div className='m-portlet__body'>
                    No data to display
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('state', state)
  return {
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    bots: (state.botsInfo.bots),
    count: (state.botsInfo.count),
    analytics: (state.botsInfo.analytics)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadBotsList: loadBotsList,
      loadMyPagesList: loadMyPagesList,
      createBot: createBot,
      deleteBot: deleteBot,
      loadAnalytics: loadAnalytics,
      updateStatus: updateStatus,
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Bot)
