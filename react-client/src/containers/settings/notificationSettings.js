import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import Select from 'react-select'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import { getUserPermissions, setPermission } from '../../redux/actions/settings.actions'

class NotificationSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      notifications: [],
      selectedPages: [],
      pages: []
    }
    props.loadMyPagesList()
    this.saveNotificationSettings = this.saveNotificationSettings.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  saveNotificationSettings () {
    var muteNotifications = []
    this.state.selectedPages && this.state.selectedPages.map(page => (
      muteNotifications.push(page.value)
    ))
    var payload= {muteNotifications: muteNotifications}
    this.props.setPermission({payload: payload}, this.msg)
  }
  handlePageChange (value) {
    this.setState({
      selectedPages: value ? value : []
    })
  }
  componentDidMount () {
    this.props.getUserPermissions()
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.pages) {
      var pages = []
      for (var i = 0; i < nextProps.pages.length; i++) {
        pages.push({ 'value': nextProps.pages[i]._id, 'label': nextProps.pages[i].pageName })
      }
      this.setState({
        pages: pages
      })
      if (nextProps.userPermissions) {
        if (nextProps.userPermissions.muteNotifications && nextProps.userPermissions.muteNotifications.length > 0) {
          var selectedPages = []
          nextProps.userPermissions.muteNotifications.map(pageId => {
            var page = nextProps.pages.filter((page) => { return (page._id === pageId) })
            selectedPages.push({ 'value': page[0]._id, 'label': page[0].pageName })
            return selectedPages
          })
          this.setState({
            selectedPages: selectedPages
          })
        }
      }
    }
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12' style={{minHeight: '900px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs'>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Notification Settings
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
            <div className= 'row'>
                <div className='col-6'>
                   Mute notifications for selected pages 
                </div>
                <div className='col-6'>
                  <Select
                    options={this.state.pages}
                    onChange={this.handlePageChange}
                    value={this.state.selectedPages}
                    isMulti={true}
                    placeholder='None'
                  />
                </div>
            </div>
            <div className='col-12 input-group pull-right' style={{marginTop: '20px'}}>
              <button className='btn btn-primary pull-right'onClick={this.saveNotificationSettings}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userPermissions: (state.settingsInfo.userPermissions),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getUserPermissions: getUserPermissions,
    setPermission: setPermission,
    loadMyPagesList: loadMyPagesList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettings)
