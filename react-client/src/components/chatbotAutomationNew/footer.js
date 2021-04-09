import React from 'react'
import PropTypes from 'prop-types'

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: false,
      backButton: false,
      homeButton: false,
      talkToAgentButton: false
    }
    this.onNext = this.onNext.bind(this)
    this.afterNext = this.afterNext.bind(this)
    this.handleBackCheckbox = this.handleBackCheckbox.bind(this)
    this.handleHomeCheckbox = this.handleHomeCheckbox.bind(this)
    this.setFooterCheckboxes = this.setFooterCheckboxes.bind(this)
    this.handleTalkToAgentCheckbox = this.handleTalkToAgentCheckbox.bind(this)
  }

  componentDidMount () {
    this.setFooterCheckboxes(this.props.currentBlock)
  }

  onNext () {
    this.setState({loading: true})
    this.props.onNext(this.afterNext)
  }

  afterNext () {
    this.setState({loading: false})
  }

  handleBackCheckbox (e) {
    this.setState({backButton: e.target.checked}, () => {
      if (this.state.backButton) {
        this.props.linkBlock('Back')
      } else {
        this.props.removeLink('Back')
      }
    })
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

  handleHomeCheckbox (e) {
    this.setState({homeButton: e.target.checked}, () => {
      if (this.state.homeButton) {
        this.props.linkBlock('Home')
      } else {
        this.props.removeLink('Home')
      }
    })
  }

  setFooterCheckboxes (currentBlock) {
    if (currentBlock.payload.length > 0) {
      const quickReplies = currentBlock.payload[currentBlock.payload.length - 1].quickReplies
      const back = quickReplies.find((item) => item.title === 'Back')
      const home = quickReplies.find((item) => item.title === 'Home')
      const talkToAgent = quickReplies.find((item) => JSON.parse(item.payload) && JSON.parse(item.payload)[0].payloadAction === 'talk_to_agent')
      const backButton = back ? true : false
      const homeButton = home ? true : false
      const talkToAgentButton = talkToAgent ? true : false
      this.setState({backButton, homeButton, talkToAgentButton})
    } else {
      this.setState({backButton: false, homeButton: false, talkToAgentButton: false})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.currentBlock) {
      this.setFooterCheckboxes(nextProps.currentBlock)
    }
  }

  render () {
    return (
      <div id='_cb_ma_footer' style={{position: 'absolute', bottom: 0, marginBottom: '15px', width: '100%', right: '15px'}} className='row'>
        <div className='col-md-8'>
          <div className="m-checkbox-inline">
            <label className="m-checkbox m--font-boldest">
              {
                this.props.showBackHomeButtons &&
                <>
                  <label className="m-checkbox m--font-boldest">
                    <input
                      type="checkbox"
                      onChange={this.handleBackCheckbox}
                      checked={this.state.backButton}
                    />
                      Back button
                    <span></span>
                  </label>
                  <label className="m-checkbox m--font-boldest">
                    <input
                      type="checkbox"
                      onChange={this.handleHomeCheckbox}
                      checked={this.state.homeButton}
                    />
                      Home button
                    <span></span>
                  </label>
                </>
              }
              <input
                type="checkbox"
                onChange={this.handleTalkToAgentCheckbox}
                checked={this.state.talkToAgentButton}
              />
                Talk to agent button
              <span></span>
            </label>
          </div>
        </div>
        <div className='col-md-4'>
          <button
            type='button'
            id='_cb_ma_footer_next'
            className={`pull-right btn btn-primary m-btn m-btn--icon ${this.state.loading && 'm-loader m-loader--light m-loader--right'}`}
            onClick={this.onNext}
            disabled={this.props.disableNext}
          >
            <span>
              <span>Save Changes</span>
            </span>
          </button>
        </div>
      </div>
    )
  }
}

Footer.propTypes = {
  'onNext': PropTypes.func.isRequired,
  'disableNext': PropTypes.bool.isRequired,
  'showBackHomeButtons': PropTypes.bool.isRequired,
  'linkBlock': PropTypes.func.isRequired,
  'removeLink': PropTypes.func.isRequired,
  'currentBlock': PropTypes.object.isRequired
}

export default Footer
