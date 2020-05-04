import React from 'react'
import PropTypes from 'prop-types'
import { Popover, PopoverBody} from 'reactstrap'
import ADDOPTION from './addOption'

class MoreOptions extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      options: [],
      showPopover: false,
      popoverTarget: '_more_options_in_chatbot',
      selectedOption: {}
    }
    this.showPopover = this.showPopover.bind(this)
    this.togglePopover = this.togglePopover.bind(this)
    this.setOptions = this.setOptions.bind(this)
  }

  componentDidMount () {
    if (this.props.data && this.props.data.length > 0) {
      this.setOptions(this.props.data)
    }
  }

  showPopover (data, id) {
    const option = {
      index: id,
      title: data.title,
      blockId: data.blockId,
      showRemove: true,
      action: 'link',
      payloadAction: data.payloadAction
    }
    this.setState({
      showPopover: true,
      popoverTarget: `_more_options_chatbot_${id}`,
      selectedOption: Object.keys(data).length > 0 ? option : data
    })
  }

  togglePopover () {
    this.setState({showPopover: !this.state.showPopover})
  }

  setOptions (data) {
    const options = data.map((item) => {
      let payload = JSON.parse(item.payload)
      return {
        title: item.title,
        action: payload[0].action,
        payloadAction: payload[0].payloadAction,
        blockId: payload[0].blockUniqueId
      }
    })
    this.setState({options})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.data && nextProps.data.length > 0) {
      this.setOptions(nextProps.data)
    } else {
      this.setState({options: []})
    }
  }

  render () {
    return (
      <div id='_cb_ma_mo' className='row'>
        <div className='col-md-12'>
          <div className="form-group m-form__group">
            <span className='m--font-boldest'>More Options:</span>
            <div style={{padding: '10px'}} className='row'>
              {
                this.state.options.map((option, i) => (
                  <button
                    key={i}
                    id={`_more_options_chatbot_${i}`}
                    type="button"
                    style={{border: '1px solid #36a3f7', marginRight: '10px', marginBottom: '10px'}}
                    className="btn m-btn--pill btn-outline-info btn-sm"
                    onClick={() => this.showPopover(option, i)}
                  >
      							{option.title}
      						</button>
                ))
              }
              {
                this.props.currentLevel < this.props.maxLevel && this.state.options.length < 13 &&
                <button
                  style={{border: 'none', cursor: 'pointer', background: 'none'}}
                  className='m-link m-link--state m-link--info'
                  onClick={() => this.showPopover({}, 'add')}
                  id='_more_options_chatbot_add'
                >
                  + Add
                </button>
              }
            </div>
          </div>
        </div>
        <div id='_more_options_in_chatbot'>
          <Popover
            placement='top'
            isOpen={this.state.showPopover}
            className='chatPopover _popover_max_width_400'
            target={this.state.popoverTarget}
            toggle={this.togglePopover}
          >
            <PopoverBody>
              {
                this.state.showPopover &&
                <ADDOPTION
                  index={this.state.selectedOption.index}
                  title={this.state.selectedOption.title || ''}
                  blockId={this.state.selectedOption.blockId || ''}
                  blocks={this.props.blocks}
                  onCancel={this.togglePopover}
                  onSave={this.props.addOption}
                  onUpdate={this.props.updateOption}
                  onRemove={this.props.removeOption}
                  showRemove={this.state.selectedOption.showRemove || false}
                  action={this.state.selectedOption.action || 'create'}
                  payloadAction={this.state.selectedOption.payloadAction || ''}
                  alertMsg={this.props.alertMsg}
                />
              }
            </PopoverBody>
          </Popover>
        </div>
      </div>
    )
  }
}

MoreOptions.propTypes = {
  'data': PropTypes.array.isRequired,
  'chatbot': PropTypes.object.isRequired,
  'currentLevel': PropTypes.number.isRequired,
  'maxLevel': PropTypes.number.isRequired,
  'addOption': PropTypes.func.isRequired,
  'removeOption': PropTypes.func.isRequired,
  'updateOption': PropTypes.func.isRequired
}

export default MoreOptions
