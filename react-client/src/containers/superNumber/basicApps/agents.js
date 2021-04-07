import React from "react"
import PropTypes from 'prop-types'
import { isTimeInInterval } from '../../../utility/utils'
import AGENTMODAL from './agentModal'
import ONOFFHOURSMODAL from './onOffHoursModal'
import ReactTooltip from 'react-tooltip'

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

class Agents extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedAgent: null,
      selectedAgentIndex: null
    }
    this.getOnlineStatus = this.getOnlineStatus.bind(this)
    this.getEnabledStatus = this.getEnabledStatus.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.toggleAgentModal = this.toggleAgentModal.bind(this)
    this.toggleOnOffHoursModal = this.toggleOnOffHoursModal.bind(this)
    this.addAgent = this.addAgent.bind(this)
    this.editAgent = this.editAgent.bind(this)
    this.saveOnOffHours = this.saveOnOffHours.bind(this)
  }

  toggleAgentModal (agent, index) {
    this.setState({
      selectedAgent: agent,
      selectedAgentIndex: index
    }, () => {
      this.refs.agent.click()
    })
  }

  toggleOnOffHoursModal (agent, index) {
    this.refs.onOffHours.click()
  }

  getOnlineStatus (onlineHours) {
    let d = new Date()
    let dayName = days[d.getDay()]
    if (isTimeInInterval(`${onlineHours[dayName].startTime}:00`, `${onlineHours[dayName].endTime}:00`, new Date())) {
      return {text: 'Online', style: 'success'}
    } else {
      return {text: 'Offline', style: 'secondary'}
    }
  }

  getEnabledStatus (enabled) {
    if (enabled) {
      return {text: 'Enabled', style: 'success'}
    } else {
      return {text: 'Disabled', style: 'danger'}
    }
  }

  getStatus (enabled, onlineHours) {
    let html = []
    html.push(
      <div>
        <span className={`m-badge m-badge--wide m-badge--${this.getEnabledStatus(enabled).style}`}>
        {this.getEnabledStatus(enabled).text}
        </span>
        {enabled &&
          <span className={`m-badge m-badge--wide m-badge--${this.getOnlineStatus(onlineHours).style}`}
            style={{marginLeft: '5px'}}>
            {this.getOnlineStatus(onlineHours).text}
          </span>
        }
      </div>
    )
    return html
  }

  addAgent (agent) {
    let agents = JSON.parse(JSON.stringify(this.props.agents))
    agents.push(agent)
    this.props.updateState(agents, true)
    this.refs.agent.click()
  }

  editAgent (agent) {
    let agents = JSON.parse(JSON.stringify(this.props.agents))
    agents[this.state.selectedAgentIndex] = agent
    this.props.updateState(agents, true)
    this.refs.agent.click()
  }

  saveOnOffHours (onOffHours) {
    this.props.updateState({onOffHours})
    this.refs.onOffHours.click()
  }

  render () {
    return (
      <div className='accordion'>
        <a href='#/' style={{ display: 'none' }} ref='agent' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#agent">Send Message</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="agent" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {this.state.selectedAgent ? 'Edit' : 'Add'} Agent
                  </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <AGENTMODAL
                selectedAgent={this.state.selectedAgent}
                days={days}
                alertMsg={this.props.alertMsg}
                addAgent={this.addAgent}
                editAgent={this.editAgent}
              />
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='onOffHours' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#onOffHours">Send Message</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="onOffHours" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit On/Off Hours
                  </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <ONOFFHOURSMODAL
                days={days}
                alertMsg={this.props.alertMsg}
                onOffHours={this.props.onOffHours}
                saveOnOffHours={this.saveOnOffHours}
              />
            </div>
          </div>
        </div>
        <div className='card'>
          <div className='card-header'>
            <h4 className='mb-0'>
              <div
                style={{fontSize: 'medium', fontWeight: '500'}}
                className='btn'
                aria-expanded='true'
              >
                Agent Settings
              </div>
            </h4>
          </div>
          <div data-parent="#accordion">
            <div className='card-body'>
              {this.props.agents.length > 0 &&
              <div className='form-group m-form__group row'>
                  <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded col-12' id='ajax_data'>
                    <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{ height: '53px' }}>
                          <th data-field='number'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '150px' }}>Phone Number</span>
                          </th>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '150px' }}>Agent Name</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '150px' }}>Status</span>
                          </th>
                          <th data-field='actions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '100px' }}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                          this.props.agents.map((agent, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{ height: '55px' }} key={i}>
                              <td data-field='number' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '150px' }}>{agent.whatsappNumber}</span>
                              </td>
                              <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '150px' }}>{agent.agentName}</span></td>
                              <td data-field='status' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '150px' }}>
                                {this.getStatus(agent.enabled, agent.onlineHours)}</span></td>
                              <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{ width: '100px' }}>
                                <button className='btn btn-primary btn-sm'
                                  onClick={() => this.toggleAgentModal(agent, i)}>
                                  Edit
                                </button>
                              </span></td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }
              <div className='form-group m-form__group row'>
                <ReactTooltip
                id='addAgent'
                place='top'
                type='info'
                multiline={true}
                disable={this.props.agents.length < this.props.agentsLimit}
              />
                <div id='addAgent' data-for='addAgent' style={{marginLeft: '15px'}}
                  data-tip={`You can only add upto ${this.props.agentsLimit} agents!`}>
                  <button
                    className='btn btn-primary btn-sm'
                    disabled={this.props.agents.length === this.props.agentsLimit} onClick={() => this.toggleAgentModal()}>
                    Add Agent
                  </button>
                </div>
                <button className='btn btn-primary btn-sm' style={{marginLeft: '5px'}}
                  onClick={() => this.toggleOnOffHoursModal()}>
                  Edit On/Off hours
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Agents.propTypes = {
  'agents': PropTypes.array.isRequired,
  'agentsLimit': PropTypes.number.isRequired,
  'onOffHours': PropTypes.object.isRequired,
  'updateState': PropTypes.func.isRequired,
}

export default Agents
