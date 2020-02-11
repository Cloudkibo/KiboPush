// /* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import {
  searchComments,
  resetSearchResult
} from '../../redux/actions/commentCapture.actions'
import AlertContainer from 'react-alert'
import { formatDateTime } from '../../utility/utils'
import ReactPlayer from 'react-player'
import { getMetaUrls } from '../../utility/utils'
import Dotdotdot from 'react-dotdotdot'

class FilterComment extends React.Component {
  constructor (props, context) {
    super(props, context)
      this.state = {
        searchKeyword: '',
        startDate: '',
        endDate: '', 
        dateRangeWarning: ''
      }
      this.searchComments = this.searchComments.bind(this)
      this.changeDateFrom = this.changeDateFrom.bind(this)
      this.changeDateTo = this.changeDateTo.bind(this)
      this.applyFilter = this.applyFilter.bind(this)
      this.resetFilter = this.resetFilter.bind(this)
      this.handleText = this.handleText.bind(this)
      this.onTestURLVideo = this.onTestURLVideo.bind(this)
      this.loadMore = this.loadMore.bind(this)
      this.validDateRange = this.validDateRange.bind(this)
    }
    onTestURLVideo (url) {
      var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
      var truef = videoEXTENSIONS.test(url)
  
      if (truef === false) {
      }
    }

    handleText(text, index) {
      let urls = getMetaUrls(text)
      if (urls && urls.length > 0) {
        for (let i = 0; i < urls.length && i < 10; i++) {
          text = text.replace(urls[i], '<a href='+ urls[i]+'>'+ urls[i]+ '</a>')
        }
      }
      return {__html:text}
    } 
    validDateRange (startDate, endDate) {
      var valid = false
      if (startDate === '' && endDate !== '') {
        this.setState({
          dateRangeWarning: 'Select start date to apply filter'
        })
        valid = false
      } else if (startDate !== '' && endDate === '') {
        this.setState({
          dateRangeWarning: 'Select end date to apply filter'
        })
        valid = false
      } else if (moment(startDate).isAfter(endDate)) {
        this.setState({
          dateRangeWarning: 'Incorrect Range'
        })
        valid = false
      } else {
        this.setState({
          dateRangeWarning: ''
        })
        valid = true
      }
      return valid
    }
    changeDateFrom (e) {
      this.setState({
        startDate: e.target.value,
        dateRangeWarning: ''
      })
    }
    changeDateTo (e) {
      this.setState({
        endDate: e.target.value,
        dateRangeWarning: ''
      })
    }
    applyFilter () {
      this.props.resetSearchResult(null)
      var data = {
        search_value: this.state.searchKeyword,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        postId: this.props.currentPost._id,
        first_page: true,
        number_of_records: 10,
        sort_value: -1,
        last_id: 'none'
      }
      if (this.state.searchKeyword === '' && this.state.startDate === '' && this.state.endDate === '') {
        this.setState({
          dateRangeWarning: 'Search keywords or select a date range to apply filter'
        })
      } else if (this.state.searchKeyword !== '' || this.validDateRange(this.state.startDate, this.state.endDate)) {
        this.props.searchComments(data, this.msg)
        this.setState({
          dateRangeWarning: ''
        })
      } 
    }
    loadMore () {
      var data = {
        search_value: this.state.searchKeyword,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        postId: this.props.currentPost._id,
        first_page: false,
        number_of_records: 10,
        sort_value: -1,
        last_id: this.props.searchResult ? this.props.searchResult[this.props.searchResult.length - 1]._id : 'none',
      }
      this.props.searchComments(data, this.msg)
    }
    resetFilter () {
      this.setState({
        searchKeyword: '',
        startDate: '',
        endDate: ''
      })
      this.props.resetSearchResult(null)
    }
    searchComments (e) {
      this.setState({
        searchKeyword: e.target.value,
        dateRangeWarning: ''
      })
    }
    render () {
      var alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
      }
      return (
      <div id="m_quick_sidebar" class="m-quick-sidebar m-quick-sidebar--tabbed m-quick-sidebar--skin-light m-quick-sidebar--on">
         <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className="m-quick-sidebar__content">
          <div className='row' style={{borderBottom: '1px solid #ebedf2', marginBottom: '15px', height: '50px'}}>
            <h4>
              Filter Comments
            </h4>
            <span id="m_quick_sidebar_close" class="m-quick-sidebar__close" onClick={() => {this.props.toggleOffCanvas()}}>
              <i class="la la-close"></i>
            </span>
          </div>
          <div className='row'>
            <div className='col-12' style={{marginBottom: '10px'}}>
              <div className='m-input-icon m-input-icon--left'>
                <input type='text' value={this.state.searchKeyword} onChange={this.searchComments} className='form-control m-input m-input--solid' placeholder='Search Comments...' id='generalSearch' />
                <span className='m-input-icon__icon m-input-icon__icon--left'>
                  <span><i className='la la-search' /></span>
                </span>
              </div>
            </div>
            <div className='col-12' style={{marginBottom: '10px'}}>
              <label>Filter By Date</label>
            </div>  
            <div className='col-12' style={{display: 'flex', marginBottom: '10px'}}>
              <div className='col-2' style={{paddingLeft: '0px'}}><span>From</span></div>
              <input className='form-control col-10 m-input'
                  onChange={(e) => this.changeDateFrom(e)}
                  value={this.state.startDate}
                  id='text'
                  placeholder='Value'
                  max= {moment().format('YYYY-MM-DD')}
                  type='date'/>
            </div>
            <div className='col-12' style={{display: 'flex'}}>
              <div className='col-2' style={{paddingLeft: '0px'}}><span>To</span></div>
              <input className='form-control col-md-10 m-input'
                  onChange={(e) => this.changeDateTo(e)}
                  value={this.state.endDate}
                  id='text'
                  placeholder='Value'
                  max= {moment().format('YYYY-MM-DD')}
                  type='date'/>
            </div>
            { this.state.dateRangeWarning !== '' && <span style={{color: 'red', marginLeft: '15px', marginTop: '10px'}} className='m-form__help'>
                { this.state.dateRangeWarning}
              </span> }
            <div className='col-12 m-form m-form--label-align-left m--margin-bottom-10 m--margin-top-10'>
              <button className='btn btn-primary m-btn m-btn--icon pull-right' onClick={this.applyFilter}>
                Apply
              </button>
              <button style={{marginRight: '10px'}} className='btn btn-secondary m-btn m-btn--icon pull-right' onClick={this.resetFilter}>
                Reset
              </button>
            </div>             
          </div>
          { this.props.searchResult && this.props.searchResult.length > 0 &&
          <div>
            <div className='row' style={{borderBottom: '1px solid #ebedf2', marginTop:'10px', marginBottom: '15px'}}>
              <h5>
                Search Results: {this.props.searchCount}
              </h5>
            </div>
            <div className='row'>
                <div className="m-widget3">
                { this.props.searchResult.map((comment, index) => (
                  <div className="m-widget3__item" key={index}>
                    <div className="m-widget3__header">
                      <div className="m-widget3__info" style={{minWidth: '280px'}}>
                        <span class="m-widget3__username" style={{color:'blue'}}>
                          {comment.senderName}
                        </span>
                        <br />
                        <span class="m-widget3__time">
                          {comment.datetime && formatDateTime(comment.datetime) }
                        </span>
                      </div>
                      <span style={{marginTop: '10px', float:'right'}}>
                      <a style={{textDecoration: 'underline'}} target='_blank' rel='noopener noreferrer' href={`https://facebook.com/${comment.commentFbId}`}>View on Facebook</a>
                      </span>
                    </div>
                    <Dotdotdot clamp={2}>
                      <div class="m-widget3__body" style={{marginLeft: '15px'}}>
                      { comment.commentPayload.map((component, index) => (
                          component.componentType === 'text'
                          ? <span dangerouslySetInnerHTML={ this.handleText(component.text, index)} key={index}>
                          </span>
                          : component.componentType === 'image'
                          ? <span key={index} style={{display: 'block'}}>
                            <img alt='' style={{width: '50px', height: '50px'}} className='m-widget3__img' src={component.url}/> 
                          </span>
                          : component.componentType === 'gif'
                          ? <span key={index} style={{display: 'block'}}>
                            <img alt=''  style={{width: '50px', height: '50px'}} className='m-widget3__img' src={component.url}/> 
                          </span>
                          : component.componentType === 'video'
                          ? <span key={index}style={{display: 'block'}}>
                          <ReactPlayer
                            url={component.url}
                            controls
                            width='50px'
                            height='50px'
                            onPlay={this.onTestURLVideo(component.url)} />
                          </span> 
                          :component.componentType === 'sticker'
                          ?<span key={index} style={{display: 'block'}}>
                              <img alt=''  style={{width: '50px', height: '50px'}} className='m-widget3__img' src={component.url}/> 
                          </span>
                          : <span key={index}>
                            Component Not Supported 
                          </span>
                        ))
                      }
                    </div>
                    </Dotdotdot>
                  </div>
              ))
            }
            { this.props.searchCount && this.props.searchCount > this.props.searchResult.length && <span>
              <a href="#/" style={{marginLeft: '10px', fontSize:'0.9rem'}} onClick={() => this.loadMore()}>Load More..</a>
            </span>
            }
            </div>
          </div>
        </div>
        }
        </div>
      </div>
      )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    searchResult: (state.postsInfo.searchResult),
    searchCount: (state.postsInfo.searchCount),
    currentPost: (state.postsInfo.currentPost)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    searchComments: searchComments,
    resetSearchResult: resetSearchResult
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FilterComment)
