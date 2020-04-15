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
  }

  showPopover (option, id) {
    this.setState({
      showPopover: true,
      popoverTarget: `_more_options_chatbot_${id}`,
      selectedOption: option
    })
  }

  togglePopover () {
    this.setState({showPopover: !this.state.showPopover})
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className="form-group m-form__group">
            <span className='m--font-boldest'>More Options:</span>
            <div style={{padding: '10px'}} className='row'>
              {
                this.state.options.map((option, i) => (
                  <button
                    id={`_more_options_chatbot_${i}`}
                    type="button"
                    style={{border: '1px solid #36a3f7'}}
                    className="btn m-btn--pill btn-outline-info btn-sm"
                    onClick={this.showPopover}
                  >
      							{option.title}
      						</button>
                ))
              }
              {
                this.props.currentLevel < this.props.maxLevel && this.state.options.length < 13 &&
                <button
                  style={{border: 'none', cursor: 'pointer'}}
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
            placement='right'
            isOpen={this.state.showPopover}
            className='chatPopover _popover_max_width_400'
            target={this.state.popoverTarget}
            toggle={this.togglePopover}
          >
            <PopoverBody>
              {
                this.state.showPopover &&
                <ADDOPTION
                  title={this.state.selectedOption.title || ''}
                  blockId={this.state.selectedOption.blockId || ''}
                  blocks={this.props.blocks}
                  onCancel={this.togglePopover}
                  onSave={() => {}}
                  onRemove={() => {}}
                  showRemove={this.state.options.length > 0}
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
  'data': PropTypes.object.isRequired,
  'chatbot': PropTypes.object.isRequired,
  'currentLevel': PropTypes.number.isRequired,
  'maxLevel': PropTypes.number.isRequired
}

export default MoreOptions
