import React from 'react'
import PropTypes from 'prop-types'
import { Popover, PopoverBody} from 'reactstrap'
import ADDOPTION from './addOption'
import ReactTooltip from 'react-tooltip'

class MoreOptions extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      options: [],
      showPopover: false,
      popoverTarget: '_more_options_in_chatbot',
      selectedOption: {},
      showingSuggestion: false,
      suggestionShown: false
    }
    this.showPopover = this.showPopover.bind(this)
    this.togglePopover = this.togglePopover.bind(this)
    this.setOptions = this.setOptions.bind(this)
  }

  componentDidMount () {
    if (this.props.data && this.props.data.length > 0) {
      this.setOptions(this.props.data)
    }

    document.getElementById('_chatbot_message_area').addEventListener("scroll", () => {
      if (this.state.showingSuggestion) {
        ReactTooltip.show(document.getElementById('_more_options_chatbot_add'))
      }
    });
  }

  showPopover (data, id) {
    const option = {
      index: id,
      title: data.title,
      blockId: data.blockId,
      showRemove: true,
      action: 'link',
      payloadAction: data.payloadAction,
      additionalActions: data.query ?
      {
        query: data.query,
        skipAllowed: data.skipAllowed,
        keyboardInputAllowed: data.keyboardInputAllowed,
        showing: true,
      } :
      {
        query: '',
        skipAllowed: false,
        keyboardInputAllowed: false,
        showing: false,
      }
    }
    console.log('option data', data)
    console.log('option set', option)
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
      if (item.payload) {
        let payload = JSON.parse(item.payload)
        return {
          title: item.title,
          action: payload[0].action,
          payloadAction: payload[0].payloadAction,
          blockId: payload[0].blockUniqueId
        }
      } else {
        return item
      }
    })
    this.setState({options})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (!this.state.suggestionShown && nextProps.text && /email|e-mail|phone|contact/.test(nextProps.text.toLowerCase())) {
      this.setState({suggestionShown: true, showingSuggestion: true}, () => {
        ReactTooltip.show(document.getElementById('_more_options_chatbot_add'))
      })
      setTimeout(() => {
        ReactTooltip.hide(document.getElementById('_more_options_chatbot_add'))
        this.setState({showingSuggestion: false})
      }, 5000)
    }
    if (nextProps.data && nextProps.data.length > 0) {
      this.setOptions(nextProps.data)
    } else {
      this.setState({options: []})
    }
  }

  render () {
    return (
      <>
      <ReactTooltip
        place='top'
        type='dark'
        effect='solid'
      />
      <div id='_cb_ma_mo' className='row'>
        <div className='col-md-12'>
          <div className="form-group m-form__group">
            {
              this.props.showLabel &&
              <span className='m--font-boldest'>More Options:</span>
            }
            <div style={{padding: '10px'}} className='row'>
              {
                this.state.options
                .map((option, i) => (
                  <button
                    key={i}
                    id={`_more_options_chatbot_${i}`}
                    type="button"
                    style={{border: '1px solid #36a3f7', marginRight: '10px', marginBottom: '10px'}}
                    className="btn m-btn--pill btn-outline-info btn-sm"
                    onClick={() => this.showPopover(option, i)}
                    disabled={option.payloadAction === 'talk_to_agent'}
                  >
      							{option.title}
      						</button>
                ))
              }
              {
                this.state.options.length < 13 &&
                <button
                  data-tip={this.state.showingSuggestion ? "Consider adding an additional action to capture email or phone number" : ""}
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
                  action={this.state.selectedOption.action || (this.props.isCreatable ? 'create' : 'link')}
                  payloadAction={this.state.selectedOption.payloadAction || ''}
                  alertMsg={this.props.alertMsg}
                  isCreatable={this.props.isCreatable}
                  additionalActions={this.state.selectedOption.additionalActions}
                  type='quickReply'
                />
              }
            </PopoverBody>
          </Popover>
        </div>
      </div>
      </>
    )
  }
}

MoreOptions.defaultProps = {
  'showLabel': true,
  'isCreatable': true
}

MoreOptions.propTypes = {
  'showLabel': PropTypes.bool,
  'data': PropTypes.array.isRequired,
  'addOption': PropTypes.func.isRequired,
  'removeOption': PropTypes.func.isRequired,
  'updateOption': PropTypes.func.isRequired,
  'isCreatable': PropTypes.bool
}

export default MoreOptions
