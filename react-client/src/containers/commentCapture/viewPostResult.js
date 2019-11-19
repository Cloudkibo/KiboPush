import React from 'react'
import { connect } from 'react-redux'
import CardBoxesContainer from './CardBoxesContainer'


class PostResult extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.state = {
      }

}
render() {
    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
                <div className='d-flex align-items-center'>
                    <div className='mr-auto'>
                        <h3 className='m-subheader__title'>Comment Capture</h3>
                    </div>
                </div>
            </div>
            <div className='m-content'>
                <div className='row'>
                    {
                    <CardBoxesContainer data= {this.props.allPostsAnalytics} singlePostResult= {true} />
                    }
                </div>
            </div>
        </div>
    )
  }
}
function mapStateToProps(state) {
    console.log(state)
    return {
      posts: (state.postsInfo.posts),
      allPostsAnalytics: (state.postsInfo.allPostsAnalytics)
    }
  }

export default connect(mapStateToProps)(PostResult)
