/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  getbroadcast,
  loadBroadcastsList,
  editbroadcast
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'

class EditBroadcast extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getbroadcast(props.location.state)
    // this.editPage = this.editPage.bind(this);
  }

  componentDidMount () {
    document.title = 'KiboPush | Edit Broadcast'
  }

  editbroadcast (event) {
    event.preventDefault()
    this.props.editbroadcast({
      _id: this.props.broadcast._id,
      platform: this.props.broadcast.platform,
      type: 'message',
      text: this.refs.message.value
    })
    this.props.history.push({
      pathname: '/broadcasts'
    })
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container'>
          <br />
          <br />
          <br />
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h2 className='presentation-margin'>Edit Broadcast</h2>
            <div className='ui-block'>
              <div className='news-feed-form'>

                <div className='tab-content'>
                  <div className='tab-pane active' id='home-1' role='tabpanel'
                    aria-expanded='true'>
                    {this.props.broadcast &&
                    <form>

                      <div
                        className='form-group with-icon label-floating is-empty'>
                        <textarea className='form-control'
                          defaultValue={this.props.broadcast
                                    ? this.props.broadcast.text
                                    : ''} ref='message' />
                      </div>
                      <div className='add-options-message'>
                        <a href='#' className='options-message'
                          data-toggle='modal'
                          data-target='#update-header-photo'
                          data-placement='top' title
                          data-original-title='ADD PHOTOS'>
                          <i className='fa fa-image' />
                          <span>Add Image</span>
                        </a>
                        <a href='#' className='options-message'
                          data-toggle='tooltip' data-placement='top' title
                          data-original-title='TAG YOUR FRIENDS'>
                          <i className='fa fa-video-camera' />
                          <span>Add Video</span>
                        </a>
                        <a href='#' className='options-message'
                          data-toggle='tooltip' data-placement='top' title
                          data-original-title='ADD LOCATION'>
                          <i className='fa fa-link' />
                          <span>Add Link</span>
                        </a>
                        <a href='#' className='options-message'
                          data-toggle='tooltip' data-placement='top' title
                          data-original-title='ADD LOCATION'>
                          <i className='fa fa-volume-up' />
                          <span>Add Audio</span>
                        </a>
                        <button className='btn btn-primary btn-md-2'
                          onClick={this.editbroadcast.bind(this)}> Save
                          Broadcast
                        </button>
                        <Link to='broadcasts'
                          className='btn btn-md-2 btn-border-think btn-transparent c-grey'
                          style={{float: 'right', margin: 2}}>Back</Link>
                      </div>
                    </form>
                    }
                  </div>

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
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    broadcast: (state.broadcastsInfo.broadcast)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    getbroadcast: getbroadcast,
    editbroadcast: editbroadcast
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditBroadcast)
