import React from 'react'
import { connect } from 'react-redux'
import CardBoxesContainer from './CardBoxesContainer'
import Comments from './comments'
import GlobalPosts from './globalPosts'
import { handleDate } from '../../utility/utils'
import {fetchComments , fetchExportCommentsData, fetchPostContent, fetchPosts, resetSearchResult } from '../../redux/actions/commentCapture.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import fileDownload from 'js-file-download'
import AlertContainer from 'react-alert'
import PostBox from './PostBox'
import FilterComments from './filterComments'

var json2csv = require('json2csv')

class PostResult extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.state = {
        page: this.props.pages.filter((page) => page._id === this.props.currentPost.pageId)[0],
        isMenuOpened: false,
        showOffCanvas: false,
        captureType: this.props.currentPost.payload && this.props.currentPost.payload.length > 0 ? 'New Post': (this.props.currentPost.post_id && this.props.currentPost.post_id !== ''? 'Existing Post': 'Any Post'),
            CurrentPostsAnalytics: {
              totalComments: this.props.currentPost.count,
              conversions: this.props.currentPost.conversionCount,
              totalRepliesSent: this.props.currentPost.positiveMatchCount,
              waitingConversions: this.props.currentPost.waitingReply,
              negativeMatch: this.props.currentPost.count-this.props.currentPost.positiveMatchCount
            }
        }
        if ((props.currentPost.payload && this.props.currentPost.payload.length > 0) ||  (this.props.currentPost.post_id && this.props.currentPost.post_id !== '')) {
        props.fetchComments({
          first_page: true,
          last_id: 'none',
          number_of_records: 10,
          postId: props.currentPost._id,
          sort_value: -1
        })
        props.fetchPostContent(props.currentPost._id)
      } else {
        props.fetchPosts({
        pageId: this.props.currentPost.pageId,
        number_of_records: 10
        })
      }
      this.exportAnalytics = this.exportAnalytics.bind(this)
      this.prepareExportSummary = this.prepareExportSummary.bind(this)
      this.exportComments = this.exportComments.bind(this)
      this.toggleOffCanvas = this.toggleOffCanvas.bind(this)
    }

    toggleOffCanvas () {
      this.props.resetSearchResult(null)
      this.setState({
        showOffCanvas: !this.state.showOffCanvas
      })
    }

    prepareExportSummary () {
      var data = []
      var analytics = {}
      if (this.props.currentPost) {
        analytics = {
          'Page': this.state.page.pageName,
          'Title': this.props.currentPost.title,
          'Type': this.props.currentPost.payload && this.props.currentPost.payload.length > 0 ? 'New Post': (this.props.currentPost.post_id && this.props.currentPost.post_id !== ''? 'Existing Post': 'Any Post'),
          'Date Created': handleDate(this.props.currentPost.datetime),
          'Total Users comments': this.props.currentPost.count,
          'Total Conversions': this.props.currentPost.conversionCount,
          'Total Replies Sent': this.props.currentPost.positiveMatchCount,
          'Waiting Conversions': this.props.currentPost.waitingReply,
          'Negative Match': this.props.currentPost.count-this.props.currentPost.positiveMatchCount,
        }
      }
      if (this.props.currentPost.post_id && this.props.currentPost.post_id !== '') {
        analytics['Post Link'] = `https://facebook.com/${this.props.currentPost.post_id}`  
      }
      data.push(analytics)
      return data
    }
    exportAnalytics () {
      var data = this.prepareExportSummary()
      var info = data
      var keys = []
      var val = info[0]
  
      for (var j in val) {
        var subKey = j
        keys.push(subKey)
      }
      json2csv({ data: info, fields: keys }, function (err, csv) {
        if (err) {
        } else {
          console.log('call file download function')
          fileDownload(csv, 'CommentCaptureAnalytics.csv')
        }
      })
    }
    prepareExportComments (comments) {
      var payload = []
      for(var i = 0; i < comments.length; i++) {
        var commentObj = {}
        var content = []
        commentObj['Comment Id'] = comments[i]._id
        commentObj['Sender Name'] = comments[i].senderName
        commentObj['Replies Count'] = comments[i].childCommentCount
        commentObj['Facebook Link'] = comments[i].postFbLink
  
        for(var j=0; j < comments[i].commentPayload.length; j++) {
          if (comments[i].commentPayload[j].componentType === 'text') {
            content.push(comments[i].commentPayload[j].text)
          } else {
            content.push(comments[i].commentPayload[j].url)
          }
        }
        commentObj['Comment'] = content
        commentObj['Reply for Comment(Id)'] = comments[i].parentId
        commentObj['Created Date'] = comments[i].datetime
        payload.push(commentObj)
      }
      return payload
    }
    exportComments () {
      this.props.fetchExportCommentsData({postId: this.props.currentPost._id},this.msg,(comments) => {
      var data = this.prepareExportComments(comments)
      var info = data
      var keys = []
      var val = info[0]
  
      for (var j in val) {
        var subKey = j
        keys.push(subKey)
      }
      json2csv({ data: data, fields: keys, unwindPath: ['Comment']}, function (err, csv) {
        if (err) {
        } else {
          console.log('call file download function')
          fileDownload(csv, 'CommentCaptureComments.csv')
        }
      })
      })
    }
    handleClick() {
      // toggles the menu opened state
      this.setState({ isMenuOpened: !this.state.isMenuOpened });
    }
componentDidMount() {
  console.log('ComponentDidMount called in ', this.props.currentPost)
    let conversions = this.props.currentPost.conversionCount
    let waitingConversions = this.props.currentPost.waitingReply
    let negativeMatch = this.props.currentPost.count-this.props.currentPost.positiveMatchCount
    let CurrentPostsAnalytics = {
              totalComments: this.props.currentPost.count,
              conversions: conversions,
              totalRepliesSent: this.props.currentPost.positiveMatchCount,
              waitingConversions: waitingConversions,
              negativeMatch: negativeMatch
            }
    this.setState({CurrentPostsAnalytics: CurrentPostsAnalytics})
    if(conversions !==0 || waitingConversions !==0 || negativeMatch !==0 )
    {
      var radarChart = document.getElementById('radar-chart')
      var counts = []
      var vals = []
      var colors = ['#34bfa3','#ffb822', '#f4516c']
      var values = ['conversion', 'waiting','Negative Match' ]
      var backcolors = []
      counts.push(conversions)
      backcolors.push(colors[0])
      vals.push(values[0])

      counts.push(waitingConversions)
      backcolors.push(colors[1])
      vals.push(values[1])

      counts.push(negativeMatch)
      backcolors.push(colors[2])
      vals.push(values[2])

      if (radarChart !== null) {
      // eslint-disable-next-line camelcase
      var ctx_rc = radarChart.getContext('2d')

      // eslint-disable-next-line camelcase
      var data_rc = {
          datasets: [
          {
              data: counts,
              backgroundColor: backcolors
          }],
          labels: vals
      }
      // eslint-disable-next-line no-unused-vars,no-undef
      var radarChartEl = new Chart(ctx_rc, {
          type: 'pie',
          data: data_rc
      })
      }
    }
  }
render() {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
           { this.state.showOffCanvas &&
              <FilterComments 
                toggleOffCanvas={this.toggleOffCanvas}
              />
            }
            <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
            <div className='m-subheader '>
                <div className='d-flex align-items-center'>
                    <div className='mr-auto'>
                        <h3 className='m-subheader__title'>Title : {this.props.currentPost.title}</h3>
                    </div>
                </div>
            </div>
            <div className='m-content'>
                <div className='row'>
                    {
                    <CardBoxesContainer data= {this.state.CurrentPostsAnalytics} singlePostResult= {true} />
                    }
                </div>
            <div className='m-portlet m-portlet--full-height '>
			<div className='m-portlet__head'>
				<div className='m-portlet__head-caption'>
					<div className='m-portlet__head-title'>
						<h3 className='m-portlet__head-text'>Comment Capture Post</h3>
					</div>
				</div>
			</div>
            <div className='m-portlet__body'>
            <div className='row'>
              <div className='col-md-6 col-lg-7 col-sm-4'>
          { this.state.captureType !== 'Any Post' &&
          <PostBox
           post={this.props.postContent ? this.props.postContent: {}} 
           page={this.state.page} />
          
				  }	  
          <div className='m-widget1' style={{paddingTop: '1.2rem'}}>
                  {this.state.captureType === 'Any Post' && <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                    <div className='col'>
                      <h3 className='m-widget1__title'>Page Name</h3>
                    </div>
                    <div className='col m--align-left'>
                      <span>{this.state.page.pageName}</span>
                    </div>
                    </div>
                  </div>
                  }
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Comment Capture Type</h3>
                      </div>
                      <div className='col m--align-left'>
                        <span>{this.state.captureType}</span>
                      </div>
                    </div>
                  </div>
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Comment Capture Created</h3>
                      </div>
                      <div className='col m--align-left'>
                        <span>{handleDate(this.props.currentPost.datetime)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className='col-md-9 col-lg-5 col-sm-9'>
                  <div style={{'width': '600px', 'height': '400px', 'margin': '0 auto'}} className='col m--align-left'>
                      <canvas id='radar-chart' width={250} height={170}  />
                    </div>
                  </div>
            </div>
          </div>
          </div>
          {this.state.captureType !== 'Any Post' 
          ? <Comments 
              comments={this.props.comments ? this.props.comments: []} 
              toggleOffCanvas={this.toggleOffCanvas} />
          : <GlobalPosts 
              globalPosts={this.props.globalPosts ? this.props.globalPosts: []} 
              toggleOffCanvas={this.toggleOffCanvas} />
          }
          <div className='row'>
            <div className='col-6'>
              <Link to='/commentCapture' className='btn btn-primary m-btn m-btn--icon'> Back </Link>
            </div>
            <div className='m-form m-form--label-align-right m--margin-bottom-30 col-6'>
              <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.exportAnalytics}>
                <span>
                  <i className='fa fa-download' />
                  <span>
                    Export Summary in CSV File
                  </span>
                </span>
              </button>
              <button style={{marginRight: '10px'}} className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.exportComments}>
                <span>
                  <i className='fa fa-download' />
                  <span>
                    Export Comments in CSV File
                  </span>
                </span>
              </button>
              </div>
            </div>
          </div>
        </div>
    )
  }
}
function mapStateToProps(state) {
    return {
	  posts: (state.postsInfo.posts),
	  postContent: (state.postsInfo.postContent),
    comments: (state.postsInfo.comments),
    commentsCount: (state.postsInfo.commentsCount),
    currentPost: (state.postsInfo.currentPost),
    allPostsAnalytics: (state.postsInfo.allPostsAnalytics),
	  pages: (state.pagesInfo.pages),
	  globalPosts: (state.postsInfo.globalPosts)
    }
  }
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
	  fetchPosts: fetchPosts,
      fetchComments: fetchComments,
      resetSearchResult: resetSearchResult,
	  fetchExportCommentsData: fetchExportCommentsData,
	  fetchPostContent: fetchPostContent
        }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PostResult)
