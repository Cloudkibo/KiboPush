// /* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchComments
} from '../../redux/actions/commentCapture.actions'

// import MediaCapturer from 'react-multimedia-capture'

class Comments extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    props.fetchComments({
      first_page: false,
     	last_id: 'none',
      number_of_records: 10,
	    postId: props.currentPost._id,
      sort_value: -1
    })
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }
  render () {
    return (
      <div className='row'>
        <div className='col-12' style={{marginBottom: '15px'}}>
          <h3 className='m-widget1__title'>Comments</h3>
        </div>
        <div className='col-12'>
          <div className='m-widget3'>
            <div className='m-widget3__item'>
              <div className='m-widget3__header'>
                <div className='m-widget3__user-img' style={{marginRight: '10px'}}>
                  <img alt='' className='m-widget3__img' src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'/>
                </div>
                <div className='m-widget3__info' style={{width: '400px', background: 'aliceblue', border:'1px', borderRadius: '25px', padding: '5px' }}>
                  <span className='m-widget3__username' style={{color: 'blue', marginLeft: '10px'}}>
                    Sania Siddiqui
                  </span>
                  <span style={{marginLeft: '5px'}}>
                    Hello All 
                  </span>
                  <br/>
                  <span className='m-widget3__time' style={{marginLeft: '10px'}}>
                    1 hr
                    <span>
                      <a href="#/" style={{marginLeft: '10px'}}><i className='fa fa-reply' /> 1 reply</a>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12'>
          <div className='m-widget3' style={{marginLeft: '25px'}}>
            <div className='col-12'>
              <span>
                <a href="#/" style={{marginLeft: '10px', fontSize:'0.9rem'}}><i className='fa fa-reply' /> View 2 more replies</a>
              </span>
            </div>
            <div className='m-widget3__item'>
              <div className='m-widget3__header'>
                <div className='m-widget3__user-img' style={{marginRight: '10px'}}>
                  <img alt='' className='m-widget3__img' src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'/>
                </div>
                <div className='m-widget3__info' style={{width: '400px', background: 'aliceblue', border:'1px', borderRadius: '25px', padding: '5px' }}>
                  <span className='m-widget3__username' style={{color: 'blue', marginLeft: '10px'}}>
                    Sania Siddiqui
                  </span>
                  <span style={{marginLeft: '5px'}}>
                    Hello All 
                  </span>
                  <br/>
                  <span className='m-widget3__time' style={{marginLeft: '10px'}}>
                    1 hr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span>
          <a href="#/" style={{marginLeft: '10px', fontSize:'0.9rem'}}>View More Comments</a>
        </span>
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    comments: (state.postsInfo.comments),
    currentPost: (state.postsInfo.currentPost)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchComments: fetchComments
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Comments)
