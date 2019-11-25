import React from 'react'
import { connect } from 'react-redux'
import CardBoxesContainer from './CardBoxesContainer'
import Comments from './comments'
import { handleDate } from '../../utility/utils'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

class PostResult extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.state = {
        pageName: this.props.pages.filter((page) => page._id === this.props.location.state.pageId)[0].pageName,
        CurrentPostsAnalytics: {
          totalComments: this.props.location.state.count,
          conversions: this.props.location.state.conversionCount,
          totalRepliesSent: this.props.location.state.positiveMatchCount,
          waitingConversions: this.props.location.state.conversionCount-this.props.location.state.positiveMatchCount,
          negativeMatch: this.props.location.state.count-this.props.location.state.positiveMatchCount
        }
      }
}
componentDidMount() {
    let conversions = this.props.location.state.conversionCount
    let waitingConversions = this.props.location.state.conversionCount-this.props.location.state.positiveMatchCount
    let negativeMatch = this.props.location.state.count-this.props.location.state.positiveMatchCount
    if(conversions !==0 || waitingConversions !==0 || negativeMatch !==0 )
    {
      var radarChart = document.getElementById('radar-chart')
      var counts = []
      var vals = []
      var colors = ['#00ff00','#0000ff', '#FF0000']
      var values = ['conversion', 'waiting','Negative Match' ]
      var backcolors = []
      counts.push(this.props.location.state.conversionCount)
      backcolors.push(colors[0])
      vals.push(values[0])

      counts.push(this.props.location.state.conversionCount-this.props.location.state.positiveMatchCount)
      backcolors.push(colors[1])
      vals.push(values[1])

      counts.push(this.props.location.state.count-this.props.location.state.positiveMatchCount)
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
                        <h3 className='m-subheader__title'>Title : {this.props.location.state.title}</h3>
                    </div>
                </div>
            </div>
            <div className='m-content'>
                <div className='row'>
                    {
                    <CardBoxesContainer data= {this.state.CurrentPostsAnalytics} singlePostResult= {true} />
                    }
                </div>
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
                  this.props.location.state.post_id && this.props.location.state.post_id !== '' &&
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Post Link</h3>
                      </div>
                      <div className='col m--align-left'>
                      <a href={`https://facebook.com/${this.props.location.state.post_id}`} target='_blank' rel='noopener noreferrer' className='m-widget5__info-date m--font-info'>
                      {`https://facebook.com/${this.props.location.state.post_id}`}
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
                        <span>{this.props.location.state.payload && this.props.location.state.payload.length > 0 ? 'New Post': (this.props.location.state.post_id && this.props.location.state.post_id !== ''? 'Existing Post': 'Any Post')}</span>
                      </div>
                    </div>
                  </div>
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Date Created</h3>
                      </div>
                      <div className='col m--align-left'>
                        <span>{handleDate(this.props.location.state.datetime)}</span>
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
              <Comments />
            </div>
            <div className='m-form m-form--label-align-right m--margin-bottom-30'>
              <Link to='/commentCapture' className='btn btn-primary m-btn m-btn--icon pull-right'> Back </Link>
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
      allPostsAnalytics: (state.postsInfo.allPostsAnalytics),
      pages: (state.pagesInfo.pages)
    }
  }
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PostResult)
