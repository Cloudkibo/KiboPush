import React from 'react'
import PropTypes from 'prop-types'

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: false,
      talkToAgentButton: false
    }
    this.onNext = this.onNext.bind(this)
    this.afterNext = this.afterNext.bind(this)
    this.handleTalkToAgentCheckbox = this.handleTalkToAgentCheckbox.bind(this)
    this.setTalkToAgentButton = this.setTalkToAgentButton.bind(this)
  }

  componentDidMount () {
    this.setTalkToAgentButton(this.props.currentBlock)
  }

  onNext () {
    this.setState({loading: true})
    this.props.onNext(this.afterNext)
  }

  afterNext () {
    this.setState({loading: false})
  }

  handleTalkToAgentCheckbox (e) {
    this.setState({talkToAgentButton: e.target.checked}, () => {
      if (this.state.talkToAgentButton) {
        this.props.linkBlock('talk_to_agent')
      } else {
        this.props.removeLink('talk_to_agent')
      }
    })
  }

  setTalkToAgentButton (currentBlock) {
    if (currentBlock.payload.length > 0) {
      const quickReplies = currentBlock.payload[currentBlock.payload.length - 1].quickReplies
      const tta = quickReplies.find((item) => JSON.parse(item.payload)[0].payloadAction === 'talk_to_agent')
      const talkToAgentButton = tta ? true : false
      this.setState({talkToAgentButton})
    } else {
      this.setState({talkToAgentButton: false})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.currentBlock) {
      this.setTalkToAgentButton(nextProps.currentBlock)
    }
  }

  render () {
    return (
      <div id='_cb_ma_footer' style={{ flex: '0 0 auto', width: '100%', padding: '1.1rem'}} className="m-portlet__foot">
        <div className='row'>
          <div className='col-md-6'>
            {
              this.props.showTalkToAgentButton &&
              <div className="m-checkbox-inline">
                <label className="m-checkbox m--font-boldest">
                  <input
                    type="checkbox"
                    onChange={this.handleTalkToAgentCheckbox}
                    checked={this.state.talkToAgentButton}
                  />
                    Talk to agent button
                  <span></span>
                </label>
              </div>
            }
          </div>
          <div className='col-md-6'>
            {
              this.props.showNext &&
              <button
                type='button'
                id='_cb_ma_footer_next'
                className={`pull-right btn btn-primary m-btn m-btn--icon ${this.state.loading && 'm-loader m-loader--light m-loader--right'}`}
                onClick={this.onNext}
                disabled={this.props.disableNext}
              >
                <span>
                  <span>{this.props.emptyBlocks ? 'Next' : 'Save'}</span>
                  {
                    this.props.emptyBlocks && !this.state.loading &&
                    <i style={{paddingLeft: '.5em'}} className='la la-arrow-right' />
                  }
                </span>
              </button>
            }
          </div>
        </div>
      </div>
    )
  }
}

Footer.propTypes = {
  'showPrevious': PropTypes.bool.isRequired,
  'showNext': PropTypes.bool.isRequired,
  'onNext': PropTypes.func.isRequired,
  'onPrevious': PropTypes.func.isRequired,
  'disableNext': PropTypes.bool.isRequired,
  'emptyBlocks': PropTypes.bool.isRequired,
  'showTalkToAgentButton': PropTypes.bool.isRequired,
  'currentBlock': PropTypes.object.isRequired,
  'linkBlock': PropTypes.func.isRequired,
  'removeLink': PropTypes.func.isRequired
}

export default Footer
