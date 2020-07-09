import React from 'react'
import PagesInfo from './userPages'
import BroadcastsInfo from './userBroadcasts'
import CommentCaptures from './commentCaptures'
import ChatBots from './chatbots'
import SurveysInfo from './userSurveys'
import PollsInfo from './userPolls'
import { loadPagesList, deleteAccount, deleteLiveChat, deleteSubscribers, getMessagesCount } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'

class UserDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('this.props.location.state', this.props.location.state)
    if (this.props.location.state) {
      const userID = this.props.location.state._id
      props.loadPagesList(userID, {first_page: 'first', last_id: 'none', number_of_records: 10, search_value: ''})
      props.getMessagesCount({companyId: this.props.location.state.companyId})
    }
    this.state = {
      pagesData: [],
      totalLength: 0,
      pageNumber: 0,
      isShowingModalAccount: false,
      isShowingModalSubscribers: false,
      isShowingModalLiveChat: false,
      id: '',
      searchValue: ''
    }
    this.displayData = this.displayData.bind(this)
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.search = this.search.bind(this)
    // this.deleteAccount = this.deleteAccount.bind(this)
    // this.deleteLiveChat = this.deleteLiveChat.bind(this)
    // this.deleteSubscribers = this.deleteSubscribers.bind(this)
    this.showDialogAccount = this.showDialogAccount.bind(this)
    this.closeDialogAccount = this.closeDialogAccount.bind(this)
    this.showDialogSubscribers = this.showDialogSubscribers.bind(this)
    this.closeDialogSubscribers = this.closeDialogSubscribers.bind(this)
    this.showDialogLiveChat = this.showDialogLiveChat.bind(this)
    this.closeDialogLiveChat = this.closeDialogLiveChat.bind(this)
  }

  componentDidMount () {
    // this.scrollToTop();

    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | User Details`
  }

  search (value, name) {
    if (value !== '') {
      this.setState({searchValue: value.toLowerCase()})
      this.props.loadPagesList(this.props.location.state._id, {first_page: 'first', last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, search_value: value.toLowerCase()})
    } else {
      this.props.loadPagesList(this.props.location.state._id, {first_page: 'first', last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, search_value: ''})
    }
    // var filtered = []
    // for (let i = 0; i < this.props.pages.length; i++) {
    //   if (this.props.pages[i].pageName.toLowerCase().includes(event.target.value.toLowerCase())) {
    //     filtered.push(this.props.pages[i])
    //   }
    // }
    //
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }

  displayData (n, pages) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > pages.length) {
      limit = pages.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pages[i]
      index++
    }
    this.setState({pagesData: data})
  }

  handleClickEvent (data) {
    if (data.selected === 0) {
      this.props.loadPagesList(this.props.location.state._id, {first_page: 'first', last_id: 'none', number_of_records: 10, search_value: this.state.searchValue})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadPagesList(this.props.location.state._id, {current_page: this.state.pageNumber, requested_page: data.selected, first_page: 'next', last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, search_value: this.state.searchValue})
    } else {
      this.props.loadPagesList(this.props.location.state._id, {current_page: this.state.pageNumber, requested_page: data.selected, first_page: 'previous', last_id: this.props.pages.length > 0 ? this.props.pages[0]._id : 'none', number_of_records: 10, search_value: this.state.searchValue})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.pages)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps in allpages', nextProps)
    if (nextProps.pages && nextProps.count) {
      this.displayData(0, nextProps.pages)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({pagesData: [], totalLength: 0})
    }
    if (nextProps.response) {
      this.props.history.push({
        pathname: `/operationalDashboard`
      })
    }
  }
  // NOTE: We are disabling the delete logic
  // deleteAccount (id) {
  //   this.props.deleteAccount(id, this.msg)
  //   this.setState({isShowingModalAccount: false})
  // }
  // deleteLiveChat (id) {
  //   this.props.deleteLiveChat(id, this.msg)
  //   this.setState({isShowingModalLiveChat: false})
  // }
  // deleteSubscribers (id) {
  //   this.props.deleteSubscribers(id, this.msg)
  //   this.setState({isShowingModalSubscribers: false})
  // }
  componentDidUpdate () {
    window.scrollTo(0, 0)
  }
  showDialogAccount (id) {
    this.setState({isShowingModalAccount: true, id: id})
  }

  closeDialogAccount () {
    this.setState({isShowingModalAccount: false})
  }
  showDialogSubscribers (id) {
    this.setState({isShowingModalSubscribers: true, id: id})
  }

  closeDialogSubscribers () {
    this.setState({isShowingModalSubscribers: false})
  }
  showDialogLiveChat (id) {
    this.setState({isShowingModalLiveChat: true, id: id})
  }

  closeDialogLiveChat () {
    this.setState({isShowingModalLiveChat: false})
  }
  render () {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper' style={{height: 'fit-content'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          // NOTE: We are disabling delete logic for now
          // this.state.isShowingModalAccount &&
          // <ModalContainer style={{width: '500px'}}
          //   onClose={this.closeDialogAccount}>
          //   <ModalDialog style={{width: '500px'}}
          //     onClose={this.closeDialogAccount}>
          //     <h3>Delete Account?</h3>
          //     <p>Are you sure you want to delete this entire account?</p>
          //     <button style={{float: 'right'}}
          //       className='btn btn-primary btn-sm'
          //       onClick={() => {
          //         this.deleteAccount(this.state.id)
          //       }}>Delete
          //     </button>
          //   </ModalDialog>
          // </ModalContainer>
        }
        {
          // NOTE: We are disabling delete logic for now
          // this.state.isShowingModalLiveChat &&
          // <ModalContainer style={{width: '500px'}}
          //   onClose={this.closeDialogLiveChat}>
          //   <ModalDialog style={{width: '500px'}}
          //     onClose={this.closeDialogLiveChat}>
          //     <h3>Delete Live Chat?</h3>
          //     <p>Are you sure you want to delete the live chat for this account?</p>
          //     <button style={{float: 'right'}}
          //       className='btn btn-primary btn-sm'
          //       onClick={() => {
          //         this.deleteLiveChat(this.state.id)
          //       }}>Delete
          //     </button>
          //   </ModalDialog>
          // </ModalContainer>
        }
        {
          // NOTE: We are disabling delete logic for now
          // this.state.isShowingModalSubscribers &&
          // <ModalContainer style={{width: '500px'}}
          //   onClose={this.closeDialogSubscribers}>
          //   <ModalDialog style={{width: '500px'}}
          //     onClose={this.closeDialogSubscribers}>
          //     <h3>Delete Subscribers?</h3>
          //     <p>Are you sure you want to delete all the subscribers for this account?</p>
          //     <button style={{float: 'right'}}
          //       className='btn btn-primary btn-sm'
          //       onClick={() => {
          //         this.deleteSubscribers(this.state.id)
          //       }}>Delete
          //     </button>
          //   </ModalDialog>
          // </ModalContainer>
        }
        <div className='m-subheader '>
          {/* NOTE: We are disabling delete logic for now
          <button className='btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent pull-right' onClick={() => this.showDialogAccount(this.props.location.state._id)}>Delete Entire Account
          </button>
          <button className='btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent pull-right' style={{marginRight: '10px'}} onClick={() => this.showDialogLiveChat(this.props.location.state._id)}>Delete Live Chat
          </button>
          <button className='btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent pull-right' style={{marginRight: '10px'}} onClick={() => this.showDialogSubscribers(this.props.location.state._id)}>Delete Subscribers
          </button> */}
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>{this.props.location.state.name}&nbsp;&nbsp;&nbsp;
              {this.props.messagesCount &&
                <span className='m-badge m-badge--wide m-badge--primary'>{`${this.props.messagesCount.totalMessagesSent} Messages Sent`}</span>
              }
              </h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <PagesInfo history={this.props.history} location={this.props.location} pages={this.state.pagesData} pagesData={this.props.pages} pageNumber={this.state.pageNumber} length={this.state.totalLength} handleClickEvent={this.handleClickEvent} displayData={this.displayData} search={this.search} />
          <BroadcastsInfo history={this.props.history} location={this.props.location} userID={this.props.location.state._id} />
          <SurveysInfo history={this.props.history} location={this.props.location} userID={this.props.location.state._id} />
          <PollsInfo history={this.props.history} location={this.props.location} userID={this.props.location.state._id} />
          <CommentCaptures history={this.props.history} location={this.props.location} userId={this.props.location.state._id} />
          <ChatBots history={this.props.history} location={this.props.location} userId={this.props.location.state._id} />
          <div style={{'overflow': 'auto'}}>
            <Link to='/operationalDashboard' className='btn btn-primary btn-sm' style={{ float: 'right', margin: '20px' }}>Back
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    pages: state.backdoorInfo.pages,
    count: state.backdoorInfo.pagesCount,
    response: state.backdoorInfo.response,
    messagesCount: state.backdoorInfo.messagesCount
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPagesList: loadPagesList,
    deleteAccount: deleteAccount,
    deleteLiveChat: deleteLiveChat,
    deleteSubscribers: deleteSubscribers,
    getMessagesCount: getMessagesCount
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UserDetails)
