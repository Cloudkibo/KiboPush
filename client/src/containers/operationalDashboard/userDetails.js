import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import PagesInfo from './userPages'
import BroadcastsInfo from './userBroadcasts'
import SurveysInfo from './userSurveys'
import PollsInfo from './userPolls'
import { loadPagesList } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class UserDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    const userID = this.props.location.state._id
    props.loadPagesList(userID, {first_page: true, last_id: 'none', number_of_records: 10, search_value: ''})
    this.state = {
      pagesData: [],
      totalLength: 0,
      pageNumber: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.search = this.search.bind(this)
  }

  search (event, name) {
    this.setState({searchValue: event.target.value.toLowerCase()})
    this.props.loadPagesList(this.props.location.state._id, {first_page: true, last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, search_value: event.target.value.toLowerCase})

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
    this.setState({pageNumber: data.selected})
    if (data.selected === 0) {
      this.props.loadPagesList(this.props.location.state._id, {first_page: true, last_id: 'none', number_of_records: 10, search_value: this.state.searchValue})
    } else {
      this.props.loadPagesList(this.props.location.state._id, {first_page: false, last_id: this.props.pages.length > 0 ? this.props.pages[this.props.pages.length - 1]._id : 'none', number_of_records: 10, search_value: this.state.searchValue})
    }
    this.displayData(data.selected, this.props.pages)
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextProps in allpages', nextProps)
    if (nextProps.pages && nextProps.count) {
      this.displayData(0, nextProps.pages)
      this.setState({ totalLength: nextProps.pages.count })
    }
  }

  componentDidUpdate () {
    window.scrollTo(0, 0)
  }

  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper' style={{height: 'fit-content'}}>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>{this.props.location.state.name}</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <PagesInfo pages={this.state.pagesData} pagesData={this.props.pages} pageNumber={this.state.pageNumber} length={this.state.totalLength} handleClickEvent={this.handleClickEvent} displayData={this.displayData} search={this.search} />
              <BroadcastsInfo userID={this.props.location.state._id} />
              <SurveysInfo userID={this.props.location.state._id} />
              <PollsInfo userID={this.props.location.state._id} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    pages: state.backdoorInfo.pages,
    count: state.backdoorInfo.pagesCount
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPagesList: loadPagesList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UserDetails)
