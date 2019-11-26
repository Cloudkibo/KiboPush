import React from 'react'
import { connect } from 'react-redux'
import CardBoxesContainer from './CardBoxesContainer'
import Comments from './comments'
import { handleDate } from '../../utility/utils'
import {fetchComments} from '../../redux/actions/commentCapture.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

class PostResult extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.state = {
        pageName: this.props.pages.filter((page) => page._id === this.props.currentPost.pageId)[0].pageName,
        CurrentPostsAnalytics: {
          totalComments: this.props.currentPost.count,
          conversions: this.props.currentPost.conversionCount,
          totalRepliesSent: this.props.currentPost.positiveMatchCount,
          waitingConversions: this.props.currentPost.positiveMatchCount-this.props.currentPost.conversionCount,
          negativeMatch: this.props.currentPost.count-this.props.currentPost.positiveMatchCount
        }
      }
      props.fetchComments({
        first_page: true,
        last_id: 'none',
        number_of_records: 10,
        postId: props.currentPost._id,
        sort_value: -1
      })
    }
componentDidMount() {
  console.log('ComponentDidMount called in ', this.props.currentPost)
    let conversions = this.props.currentPost.conversionCount
    let waitingConversions = this.props.currentPost.positiveMatchCount-this.props.currentPost.conversionCount
    let negativeMatch = this.props.currentPost.count-this.props.currentPost.positiveMatchCount
    let CurrentPostsAnalytics = {
              totalComments: this.props.currentPost.count,
              conversions: conversions,
              totalRepliesSent: this.props.currentPost.positiveMatchCount,
              waitingConversions: waitingConversions,
              negativeMatch: negativeMatch
            }
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
    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
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
            <div className='m-portlet__body'>
            <div className='row'>
              <div className='col-md-6 col-lg-7 col-sm-4'>
                <div className='m-widget1' style={{paddingTop: '1.2rem'}}>
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Page</h3>
                      </div>
                      <div className='col m--align-left'>
                        <span >{this.state.pageName}</span>
                      </div>
                    </div>
                  </div>
                  {
                  this.props.currentPost.post_id && this.props.currentPost.post_id !== '' &&
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Post Link</h3>
                      </div>
                      <div className='col m--align-left'>
                      <a href={`https://facebook.com/${this.props.currentPost.post_id}`} target='_blank' rel='noopener noreferrer' className='m-widget5__info-date m--font-info'>
                      {`https://facebook.com/${this.props.currentPost.post_id}`}
                    </a>
                      </div>
                    </div>
                  </div>
                  }
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Tracking</h3>
                      </div>
                      <div className='col m--align-left'>
                        <span>{this.props.currentPost.payload && this.props.currentPost.payload.length > 0 ? 'New Post': (this.props.currentPost.post_id && this.props.currentPost.post_id !== ''? 'Existing Post': 'Any Post')}</span>
                      </div>
                    </div>
                  </div>
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Date Created</h3>
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
            <div className='col-12'>
              <Comments comments={this.props.comments ? this.props.comments: []}/>
            </div>
            <div className='m-form m-form--label-align-right m--margin-bottom-30'>
              <Link to='/commentCapture' className='btn btn-primary m-btn m-btn--icon pull-right'> Back </Link>
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
      posts: (state.postsInfo.posts),
      comments: (state.postsInfo.comments),
      currentPost: (state.postsInfo.currentPost),
      allPostsAnalytics: (state.postsInfo.allPostsAnalytics),
      pages: (state.pagesInfo.pages)
    }
  }
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      fetchComments: fetchComments
        }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PostResult)
