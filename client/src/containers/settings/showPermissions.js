import React from 'react'
import { getPermissions } from '../../redux/actions/settings.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
class ShowPermissions extends React.Component {
  componentWillMount () {
    this.props.getPermissions()
  }

  componentDidMount () {
    document.title = 'KiboPush | Permissions'
  }
  componentWillReceiveProps (nextProps) {
  }
  render () {
    return (
      <div className='col-xl-8'>
        <div className='m-portlet m-portlet--full-height'>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>
                  Team Member Permissions
                </h3>
              </div>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active' id='m_widget4_tab1_content'>
                <div className='m-widget4'>
                  {
                    this.props.permissions && this.props.permissions.map((permission, index) => {
                      if (index > 0) {
                        return (<div className='m-widget4__item'>
                          <div className='m-widget4__info'>
                            <span className='m-widget4__title'>
                              {permission.userId.name}
                            </span>
                            <br />
                            <span className='m-widget4__sub'>
                              {permission.userId.role}
                            </span>
                          </div>
                          <div className='m-widget4__ext'>
                            <a href='#' className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                            View and Update
                            </a>
                          </div>
                        </div>)
                      }
                    })
                  }
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
  return {
    permissions: (state.settingsInfo.permissions)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getPermissions: getPermissions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ShowPermissions)
