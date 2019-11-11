import React from 'react'
import { getPermissions, updatePermission } from '../../redux/actions/settings.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
class ShowPermissions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentMember: '',
      companyId: '',
      memberPermissions: false,
      currentPermissions: {
      }
    }
    this.showMemberPermission = this.showMemberPermission.bind(this)
    this.onChangeHandel = this.onChangeHandel.bind(this)
    this.sendToServer = this.sendToServer.bind(this)
  }
  UNSAFE_componentWillMount () {
    this.props.getPermissions()
  }

  componentDidMount () {
    document.title = 'KiboPush | Permissions'
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
  }

  sendToServer () {
    console.log(this.state.currentPermissions)
    let obj4server = {
      'apiPermission': this.state.currentPermissions['API Permission'],
      'subscriberPermission': this.state.currentPermissions['Subscriber Permission'],
      'pollsPermission': this.state.currentPermissions['Polls Permission'],
      'pagesPermission': this.state.currentPermissions['Pages Permission'],
      'pagesAccessPermission': this.state.currentPermissions['Pages Access Permission'],
      'menuPermission': this.state.currentPermissions['Menu Permission'],
      'livechatPermission': this.state.currentPermissions['Live Chat Permission'],
      'autopostingPermission': this.state.currentPermissions['Autoposting Permission'],
      'broadcastPermission': this.state.currentPermissions['Broadcast Permission'],
      'invitationPermission': this.state.currentPermissions['Invitation Permission'],
      'deleteAgentPermission': this.state.currentPermissions['Delete Agent Permission'],
      'inviteAgentPermission': this.state.currentPermissions['Invite Agent Permission'],
      'updateRolePermission': this.state.currentPermissions['Update Role Permission'],
      'deleteAdminPermission': this.state.currentPermissions['Delete Admin Permission'],
      'inviteAdminPermission': this.state.currentPermissions['Invite Admin Permission'],
      'memberPermission': this.state.currentPermissions['Member Permission'],
      'companyUpdatePermission': this.state.currentPermissions['Company Update Permission'],
      'companyPermission': this.state.currentPermissions['Company Permission'],
      'dashboardPermission': this.state.currentPermissions['Dashboard Permission'],
      'customerMatchingPermission': this.state.currentPermissions['Customer Matching Permission'],
      'terminateService': this.state.currentPermissions['Terminate Service'],
      'upgradeService': this.state.currentPermissions['Upgrade Service'],
      'downgradeService': this.state.currentPermissions['Downgrade Service'],
      'billingPermission': this.state.currentPermissions['Billing Permission']

    }
    obj4server['userId'] = this.state.currentMember
    obj4server['companyId'] = this.state.companyId

    console.log(obj4server)

    this.props.updatePermissionOnServer(obj4server, this.msg)
  }

  onChangeHandel (key) {
    if (this.state.currentPermissions[key]) {
      let updatedPerm = this.state.currentPermissions
      updatedPerm[key] = false
      console.log('settin updated perm')
      this.setState({currentPermissions: updatedPerm})
    } else {
      let updatedPerm = this.state.currentPermissions
      updatedPerm[key] = true
      console.log('settin updated perm')
      this.setState({currentPermissions: updatedPerm})
    }
  }

  showMemberPermission (index) {
    let permission = {
      'API Permission': this.props.permissions[index].apiPermission,
      'Subscriber Permission': this.props.permissions[index].subscriberPermission,
      'Polls Permission': this.props.permissions[index].pollsPermission,
      'Pages Permission': this.props.permissions[index].pagesPermission,
      'Pages Access Permission': this.props.permissions[index].pagesAccessPermission,
      'Menu Permission': this.props.permissions[index].menuPermission,
      'Live Chat Permission': this.props.permissions[index].livechatPermission,
      'Autoposting Permission': this.props.permissions[index].autopostingPermission,
      'Broadcast Permission': this.props.permissions[index].broadcastPermission,
      'Invitation Permission': this.props.permissions[index].invitationsPermission,
      'Delete Agent Permission': this.props.permissions[index].deleteAgentPermission,
      'Invite Agent Permission': this.props.permissions[index].inviteAgentPermission,
      'Update Role Permission': this.props.permissions[index].updateRolePermission,
      'Delete Admin Permission': this.props.permissions[index].deleteAdminPermission,
      'Invite Admin Permission': this.props.permissions[index].inviteAdminPermission,
      'Member Permission': this.props.permissions[index].membersPermission,
      'Company Update Permission': this.props.permissions[index].companyUpdatePermission,
      'Company Permission': this.props.permissions[index].companyPermission,
      'Dashboard Permission': this.props.permissions[index].dashboardPermission,
      'Customer Matching Permission': this.props.permissions[index].customerMatchingPermission,
      'Terminate Service': this.props.permissions[index].terminateService,
      'Upgrade Service': this.props.permissions[index].upgradeService,
      'Downgrade Service': this.props.permissions[index].downgradeService,
      'Billing Permission': this.props.permissions[index].billingPermission

    }
    this.setState({
      currentPermissions: permission,
      memberPermissions: true,
      currentMember: this.props.permissions[index].userId._id,
      companyId: this.props.permissions[index].companyId
    })
  }
  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='col-xl-8'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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
                { (this.props.permissions.length > 1)
                 ? <div className='m-widget4'>
                   {
                      !this.state.memberPermissions && this.props.permissions && this.props.permissions.map((permission, index) => {
                        if (index > 0) {
                          return (<div className='m-widget4__item'>
                            <div className='m-widget4__info'>
                              <span className='m-widget4__title'>
                                {permission.userId && permission.userId.name ? permission.userId.name : ''}
                              </span>
                              <br />
                              <span className='m-widget4__sub'>
                                {permission.userId.role}
                              </span>
                            </div>
                            <div className='m-widget4__ext'>
                              <a onClick={() => { this.showMemberPermission(index) }} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                              View and Update
                              </a>
                            </div>
                          </div>)
                        }
                      })
                    }
                   {
                      this.state.memberPermissions && Object.keys(this.state.currentPermissions).map((key, index) => {
                        if (index > 0) {
                          return (<div className='m-widget4__item'>
                            <div className='m-widget4__info'>
                              <span className='m-widget4__title'>
                                { key }
                              </span>
                              <br />
                            </div>
                            <div className='m-widget4__ext'>
                              <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                  {this.state.currentPermissions[key] ? 'Permitted' : 'Not Permitted'}
                                </button>
                                <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                                  <a className='dropdown-item' onClick={() => { this.onChangeHandel(key) }}>
                                    Permitted
                                  </a>
                                  <a className='dropdown-item' onClick={() => { this.onChangeHandel(key) }}>
                                    Not Permitted
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>)
                        }
                      })
                    }
                   {
                      this.state.memberPermissions &&
                      <div className='m-widget4__item'>
                        <div className='m-widget4__info'>
                          <span className='m-widget4__title' />
                          <br />
                          <br />
                        </div>

                        <div className='m-widget4__ext'>
                          <a className='m-btn m-btn--pill m-btn--hover-brand btn btn-lg btn-primary' onClick={() => { this.sendToServer() }}>
                            Update
                          </a>
                        </div>
                      </div>
                  }
                 </div>
                  : <center><label style={{ fontWeight: 'normal' }}>Please add members to change their permissions</label></center>
                }
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
    getPermissions: getPermissions,
    updatePermissionOnServer: updatePermission
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ShowPermissions)
