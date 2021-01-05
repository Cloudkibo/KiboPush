import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

class AlertSubscriptions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      agents: [],
      selectedAgent: ''
    }

    this.onAgentChange = this.onAgentChange.bind(this)
    this.onAddAgent = this.onAddAgent.bind(this)
  }

  componentDidMount () {
    if (this.props.members && this.props.members.length > 0) {
      const agents = this.props.members.map((item) => {
        return {
          label: item.name,
          value: item._id
        }
      })
      this.setState({agents})
    }
  }

  onAgentChange (value, others) {
    this.setState({selectedAgent: value})
  }

  onAddAgent () {}

  render () {
    return (
      <div>
        <div className='form-group m-form__group row'>
          <div className='col-lg-2 col-md-2 col-sm-12' />
          <div className='col-lg-6 col-md-16 col-sm-12'>
            <Select
              className='basic-single'
              classNamePrefix='select'
              isClearable={true}
              isSearchable={true}
              options={this.state.agents}
              value={this.state.selectedAgent}
              onChange={this.onAgentChange}
            />
          </div>
          <div className='col-lg-2 col-md-2 col-sm-12'>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onAddAgent}
              disabled={!this.state.selectedAgent}
            >
              Add
            </button>
          </div>
          <div className='col-lg-2 col-md-2 col-sm-12' />
        </div>
        <div className='form-group m-form__group row'>
          <div className='col-lg-12 col-md-12 col-sm-12 m--font-boldest'>
            Subscribed Agents:
          </div>
        </div>
        <div className='form-group m-form__group row'>
          <div className='col-lg-4 col-md-4 col-sm-4'>
            <div style={{border: '1px solid #111', borderRadius: '10px', position: 'relative'}}>
              <span style={{position: 'absolute', top: '0px', right: '0px'}}>
                <i className='la la-times-circle' />
              </span>
              <div className="m-card-user">
                <div className="m-card-user__pic">
                  <img src="" className="m--img-rounded m--marginless" alt="" />
                </div>
                <div class="m-card-user__details">
                  <span className="m-card-user__name m--font-weight-500">
                    Mark Andre
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AlertSubscriptions.propTypes = {
  'channel': PropTypes.string.isRequired,
  'subscriptions': PropTypes.array.isRequired,
  'members': PropTypes.array
}

export default AlertSubscriptions
