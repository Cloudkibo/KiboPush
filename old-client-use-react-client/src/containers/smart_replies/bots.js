/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadBotsList, createBot, deleteBot, loadAnalytics } from '../../redux/actions/smart_replies.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import AlertMessage from '../../components/alertMessages/alertMessage'
import YouTube from 'react-youtube'

class Bot extends React.Component {
  constructor (props, context) {
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
      searchValue: '',
      createBotDialogButton: false,
      pageNumber: 0,
      filter: false,
      pages: [],
      showDropDown: false,
      responded: 0,
      total: 0,
      notResponded: 0,
      showVideo: false
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
    this.searchBot = this.searchBot.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.updateAllowedPages = this.updateAllowedPages.bind(this)
    this.showDropdown = this.showDropdown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Bots`;
  }

  showDialog () {
    if (this.state.pages.length === 0) {
      this.msg.error('You have already added bots on all pages.')
      return
    }
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }
  componentWillMount () {
   // this.props.loadSubscribersList()
  //  document.title('KiboPush | Poll')
  }

  displayData (n, bots) {
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
    this.setState({botsData: data})
  }

  handlePageClick (data) {
    // this.setState({pageSelected: data.selected})
    // if (data.selected === 0) {
    //   this.props.loadBotsListNew({last_id: 'none', number_of_records: 10, first_page: true, filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, page_value: this.state.filterValue}})
    // } else {
    //   this.props.loadBotsListNew({last_id: this.props.bots.length > 0 ? this.props.bots[this.props.bots.length - 1]._id : 'none', number_of_records: 10, first_page: false, filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, page_value: this.state.filterValue}})
    // }
    this.displayData(data.selected, this.props.bots)
  }

  updateName (e) {
    var name = e.target.value.replace('-', '')
    this.setState({name: name, error: false})
  }

  searchBot (event) {
    this.setState({searchValue: event.target.value})
    var filtered = []
    if (event.target.value !== '' && this.state.filterValue === '') {
      // this.setState({filter: true})
      // this.props.loadBotsListNew({last_id: this.props.bots.length > 0 ? this.props.bots[this.props.bots.length - 1]._id : 'none', number_of_records: 10, first_page: true, filter: true, filter_criteria: {search_value: event.target.value, page_value: this.state.filterValue}})
      for (let i = 0; i < this.props.bots.length; i++) {
        if (this.props.bots[i].botName && this.props.bots[i].botName.toLowerCase().includes(event.target.value.toLowerCase())) {
          filtered.push(this.props.bots[i])
        }
      }
    } else if (event.target.value !== '' && this.state.filterValue !== '') {
      for (let i = 0; i < this.props.bots.length; i++) {
        if (this.props.bots[i].botName && this.props.bots[i].botName.toLowerCase().includes(event.target.value.toLowerCase()) && this.props.bots[i].pageId._id === this.state.filterValue) {
          filtered.push(this.props.bots[i])
        }
      }
    } else {
      filtered = this.props.bots
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    this.setState({filterValue: e.target.value})
    var filtered = []
    if (e.target.value && e.target.value !== 'all' && this.state.searchValue === '') {
      // this.setState({filter: true})
      // this.props.loadBotsListNew({last_id: this.props.bots.length > 0 ? this.props.bots[this.props.bots.length - 1]._id : 'none', number_of_records: 10, first_page: true, filter: true, filter_criteria: {search_value: this.state.searchValue, page_value: e.target.value}})
      if (this.props.bots && this.props.bots.length > 0) {
        for (let i = 0; i < this.props.bots.length; i++) {
          if (this.props.bots[i].pageId._id === e.target.value) {
            filtered.push(this.props.bots[i])
          }
        }
      }
    } else if (e.target.value !== '' && e.target.value !== 'all' && this.state.searchValue !== '') {
      for (let i = 0; i < this.props.bots.length; i++) {
        if (this.props.bots[i].botName && this.props.bots[i].botName.toLowerCase().includes(this.state.searchValue.toLowerCase()) && this.props.bots[i].pageId._id === e.target.value) {
          filtered.push(this.props.bots[i])
        }
      }
    } else {
      filtered = this.props.bots
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  componentWillReceiveProps (nextProps) {
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
      this.setState({responded: responded, total: total, notResponded: notResponded})
    } else {
      this.setState({botsData: [], totalLength: 0})
    }
    if (nextProps.pages && nextProps.pages.length > 0 && nextProps.bots) {
      // this.state.pageSelected = nextProps.pages[0]._id
      this.updateAllowedPages(nextProps.pages, nextProps.bots)
    }
  }

  updateAllowedPages (pages, bots) {
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
    this.setState({pages: temp, pageSelected: temp && temp.length > 0 ? temp[0]._id : []})
  }

  changePage (e) {
    this.setState({pageSelected: e.target.value})
  }

  changeStatus (e) {
    console.log('e.target.value', e.target.value)
    this.setState({isActive: e.target.value})
  }

  gotoView (bot) {
    this.props.history.push({
      pathname: `/viewBot`,
      state: bot
    })
    // browserHistory.push(`/pollResult/${poll._id}`)
  }

  gotoEdit (bot) {
    this.props.history.push({
      pathname: `/editBot`,
      state: bot
    })
    // browserHistory.push(`/pollResult/${poll._id}`)
  }

  gotoWaitingReply (bot) {
    this.props.history.push({
      pathname: `/WaitingReplyList`,
      state: bot
    })
    // browserHistory.push(`/pollResult/${poll._id}`)
  }

  gotoUnansweredQueries (bot) {
    console.log('going to unanswered queries')
    this.props.history.push({
      pathname: `/UnansweredQueries`,
      state: bot
    })
    // browserHistory.push(`/pollResult/${poll._id}`)
  }

  showDropdown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }

  gotoCreate () {
    if (this.state.name === '') {
      this.setState({error: true})
    } else {
      var botName = this.state.name.trim()
      botName = botName.replace(/\s+/g, '-')
      this.props.createBot({botName: botName, pageId: this.state.pageSelected, isActive: this.state.isActive})
      browserHistory.push({
        pathname: `/createBot`
      })
    }
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='dhLolxFQPkE'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                  />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
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
              Need help in understanding bots? Here is the <a href='http://kibopush.com/smart-replies/' target='_blank'>documentation</a>.
              Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
            </div>
          </div>

          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Bots might take 30mins to 1 hour to train. Please test the bot after 1 hour to see if it is working
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='row m-row--full-height'>
                <div className='col-sm-4 col-md-4 col-lg-4' style={{height: 'fit-content'}}>
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
                <div className='col-sm-4 col-md-4 col-lg-4' style={{height: 'fit-content'}}>
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
                <div className='col-sm-4 col-md-4 col-lg-4' style={{height: 'fit-content'}}>
                  <div className='m-portlet m-portlet--half-height m-portlet--border-bottom-success'>
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
                        Bots
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
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-xl-8 order-2 order-xl-1' />
                    <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                      {
                        this.state.isShowingModal &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialog}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialog}>
                            <h3>Create Bot</h3>
                            <div className='m-form'>
                              <div id='question' className='form-group m-form__group'>
                                <label className='control-label'>Bot Name:</label>
                                {this.state.error &&
                                  <div id='email-error' style={{color: 'red', fontWeight: 'bold'}}><bold>Please enter a name</bold></div>
                                  }
                                <input className='form-control' placeholder='Enter bot name here'
                                  value={this.state.name} onChange={(e) => this.updateName(e)} />
                              </div>
                              <div className='form-group m-form__group'>
                                <label className='control-label'>Assigned to Page:&nbsp;&nbsp;&nbsp;</label>
                                <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.pageSelected} onChange={this.changePage}>
                                  {
                                    this.state.pages.map((page, i) => (
                                      <option key={i} value={page._id}>{page.pageName}</option>
                                    ))
                                  }
                                </select>
                              </div>
                              <div className='form-group m-form__group'>
                                <label className='control-label'>Status:&nbsp;&nbsp;&nbsp;</label>
                                <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.isActive} onChange={this.changeStatus}>
                                  <option key='2' value='true'>Active</option>
                                  <option key='3' value='false'>Disabled</option>
                                </select>
                              </div>
                            </div>
                            <div style={{width: '100%', textAlign: 'center'}}>
                              <div style={{display: 'inline-block', padding: '5px', float: 'right'}}>
                                <button className='btn btn-primary' disabled={this.state.createBotDialogButton} onClick={() => this.gotoCreate()}>
                                  Create
                                </button>
                              </div>
                            </div>
                          </ModalDialog>
                        </ModalContainer>
                      }
                      {
                        this.state.isShowingModalDelete &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialogDelete}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialogDelete}>
                            <h3>Delete Bot</h3>
                            <p>Are you sure you want to delete this bot?</p>
                            <button style={{float: 'right'}}
                              className='btn btn-primary btn-sm'
                              onClick={() => {
                                this.props.deleteBot(this.state.deleteid, this.msg)
                                this.closeDialogDelete()
                              }}>Delete
                            </button>
                          </ModalDialog>
                        </ModalContainer>
                      }
                    </div>
                    <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4'>
                      <input type='text' placeholder='Search bots by name...' className='form-control m-input m-input--solid' onChange={this.searchBot} />
                      <span className='m-input-icon__icon m-input-icon__icon--left'>
                        <span><i className='la la-search' /></span>
                      </span>
                    </div>
                    <div style={{margin: '5px'}} className='col-md-4 col-lg-4 col-xl-4 row align-items-center' />
                    <div className='m-form__group m-form__group--inline col-md-4 col-lg-4 col-xl-4 row align-items-center'>
                      <div className='m-form__label'>
                        <label>Pages:&nbsp;&nbsp;</label>
                      </div>
                      <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.filterValue} onChange={this.onFilter}>
                        <option value='' disabled>Filter by Pages...</option>
                        {
                          this.props.pages && this.props.pages.length > 0 &&
                          this.props.pages.map((page, i) => (
                            <option key={i} value={page._id}>{page.pageName}</option>
                          ))
                        }
                        <option value='all'>All</option>
                      </select>
                    </div>
                  </div>
                  <br />
                  { this.state.botsData && this.state.botsData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflow: 'inherit'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '125px'}}>Name</span>
                          </th>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '125px'}}>Page</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '125px'}}>Status</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '125px'}}>Answered Queries</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '125px'}}>Unanswered Queries</span>
                          </th>
                          <th data-field='actions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '250px'}}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                        {
                        this.state.botsData.map((bot, i) => (
                          <tr key={i} data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}}>
                            <td data-field='name' className='m-datatable__cell'><span style={{width: '125px'}}>{bot.botName ? bot.botName.split('-').join(' ') : ''}</span></td>
                            <td data-field='page' className='m-datatable__cell'><span style={{width: '125px'}}>{bot.pageId.pageName}</span></td>
                            <td data-field='page' className='m-datatable__cell'>
                              {bot.isActive === 'true'
                                ? <span style={{width: '125px'}}>Active</span>
                                : <span style={{width: '125px'}}>Disabled</span>
                              }
                            </td>
                            <td data-field='page' className='m-datatable__cell'>
                              { (bot.hitCount)
                                ? <span style={{width: '125px'}}>{ bot.hitCount}</span>
                                : <span style={{width: '125px'}}>0</span>
                              }
                            </td>
                            <td data-field='page' className='m-datatable__cell'>
                              { (bot.missCount)
                                ? <span style={{width: '125px'}}>{ bot.missCount}</span>
                                : <span style={{width: '125px'}}>0</span>
                              }
                            </td>
                            <td data-field='actions' className='m-datatable__cell'>
                              {this.props.user && this.props.user.role !== 'agent'
                              ? <span style={{width: '250px', overflow: 'inherit', paddingLeft: '65px'}}>

                                <div style={{paddingLeft: 0}} className='col-md-2'>
                                  <div className='m-portlet__head-tools'>
                                    <ul className='m-portlet__nav'>
                                      <li onClick={this.showDropDown} className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                                        <a className='m-portlet__nav-link m-portlet__nav-link--icon m-dropdown__toggle'>
                                          <i onClick={this.showDropdown} style={{cursor: 'pointer', fontSize: '40px'}} className='la la-ellipsis-h' />
                                        </a>
                                        {
                                          /* This is dropdown of possible actions for a bot */
                                          this.state.showDropDown &&
                                          <div className='m-dropdown__wrapper'>
                                            <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                                            <div className='m-dropdown__inner'>
                                              <div className='m-dropdown__body'>
                                                <div className='m-dropdown__content'>
                                                  <ul className='m-nav'>
                                                    <li className='m-nav__item' style={{ margin: '10px' }}>
                                                      <a onClick={() => this.gotoView(bot._id)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                                        {
                                                          <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                                            View
                                                          </span>
                                                        }
                                                      </a>
                                                    </li>
                                                    <li className='m-nav__item' style={{ margin: '10px' }}>
                                                      <a onClick={() => this.gotoEdit(bot._id)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                                        {
                                                          <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                                            Edit
                                                          </span>
                                                        }
                                                      </a>
                                                    </li>
                                                    <li className='m-nav__item' style={{ margin: '10px' }}>
                                                      <a onClick={() => this.showDialogDelete(bot._id)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                                        {
                                                          <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                                            Delete
                                                          </span>
                                                        }
                                                      </a>
                                                    </li>
                                                    <li className='m-nav__item' style={{ margin: '10px' }}>
                                                      <a onClick={() => this.gotoWaitingReply(bot._id)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                                        {
                                                          <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                                            Waiting Subscribers
                                                          </span>
                                                        }
                                                      </a>
                                                    </li>
                                                    <li className='m-nav__item' style={{ margin: '10px' }}>
                                                      <a onClick={() => this.gotoUnansweredQueries(bot._id)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                                        {
                                                          <span style={{fontWeight: 600}} className='m-nav__link-text'>
                                                            Unanswered Queries
                                                          </span>
                                                        }
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        }
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </span>
                              : <span style={{width: '250px'}}>
                                <button className='btn btn-primary btn-sm'
                                  style={{float: 'left', margin: 2}}
                                  onClick={() => this.gotoView(bot)}>
                                  View
                                </button>
                              </span>
                            }
                            </td>
                            <hr />
                          </tr>
                        ))
                      }
                      </tbody>
                    </table>
                    <div className='pagination'>
                      <ReactPaginate previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'} />
                    </div>
                  </div>
                  : <span>
                    <p> No data to display </p>
                  </span>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state', state)
  return {
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    bots: (state.botsInfo.bots),
    count: (state.botsInfo.count),
    analytics: (state.botsInfo.analytics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBotsList: loadBotsList,
      loadMyPagesList: loadMyPagesList,
      createBot: createBot,
      deleteBot: deleteBot,
      loadAnalytics: loadAnalytics
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Bot)
