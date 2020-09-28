import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchChatbots, createChatbot } from '../../redux/actions/chatbot.actions'
import AlertContainer from 'react-alert'
import CHATBOTITEM from '../../components/chatbot/chatbotItem'

class Chatbots extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedRadio: 'modify',
      loading: false,
      title: ''
    }

    this.onRadioClick = this.onRadioClick.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.handleOnCreate = this.handleOnCreate.bind(this)
    this.modifyChatbot = this.modifyChatbot.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)

    props.fetchChatbots()
  }

  componentDidMount() {
    document.title = 'KiboChat | ChatBot'
  }

  onRadioClick (e) {
    this.setState({selectedRadio: e.target.value})
  }

  onCreate () {
    const titles = this.props.chatbots.map((item) => item.title)
    if (titles.includes(this.state.title)) {
      this.msg.error('A chatbot already exists with this title. Please enter a different title.')
    } else {
      this.setState({loading: true})
      this.props.createChatbot({ title: this.state.title, startingBlockId: `${new Date().getTime()}` }, this.handleOnCreate)
    }
  }

  modifyChatbot(chatbot) {
    this.props.history.push({
      pathname: '/chatbots/configure',
      state: { chatbot }
    })
  }

  handleOnCreate(res) {
    this.setState({loading: false})
    if (res.status === 'success') {
      const chatbot = res.payload
      this.props.history.push({
        pathname: '/chatbots/configure',
        state: { chatbot }
      })
    } else {
      this.msg.error(res.description || 'Failed to create chatbot.')
    }
  }

  onTitleChange (e) {
    if (e.target.value.length <= 30) {
      this.setState({title: e.target.value})
    }
  }

  render() {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Chatbots</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet m-portlet-mobile'>
                <div className='m-portlet__body'>
                  <div className="m-form__group form-group">
                    <div className="m-radio-list">
                      <label className="m-radio m-radio--bold m-radio--state-brand">
                        <input
                          type="radio"
                          onClick={this.onRadioClick}
                          onChange={() => { }}
                          value='modify'
                          checked={this.state.selectedRadio === 'modify'}
                        />
                          Modify Existing Chatbot
                        <span />
                      </label>
                      {
                        this.state.selectedRadio === 'modify' &&
                        <div style={{ marginLeft: '50px' }} className='row'>
                          {
                            this.props.chatbots && this.props.chatbots.length > 0
                              ? this.props.chatbots.map((chatbot) => (
                                <CHATBOTITEM
                                  key={chatbot.chatbotId}
                                  name={chatbot.title}
                                  onItemClick={() => this.modifyChatbot(chatbot)}
                                />
                              ))
                              : (!this.props.chatbots)
                              ? <p>Loading chatbots...</p>
                              : <p>No data to display</p>
                          }
                        </div>
                      }
                      <label className="m-radio m-radio--bold m-radio--state-brand">
                        <input
                          type="radio"
                          onClick={this.onRadioClick}
                          onChange={() => { }}
                          value='create'
                          checked={this.state.selectedRadio === 'create'}
                        />
                          Create New Chatbot
                        <span />
                      </label>
                      {
                        this.state.selectedRadio === 'create' &&
                        <div style={{ marginLeft: '50px' }} className='row'>
                          <div className='col-md-6'>
                            <div className="form-group m-form__group">
                              <input
                                className='form-control'
                                value={this.state.title}
                                placeholder='Enter chatbot title...'
                                onChange={this.onTitleChange}
                              />
                            </div>
                          </div>
                          <div className='col-md-3'>
                            <button
                              type='button'
                              style={{ border: '1px solid' }}
                              className={`btn btn-primary ${this.state.loading && 'm-loader m-loader--light m-loader--left'}`}
                              onClick={this.onCreate}
                              disabled={!this.state.title}
                            >
                              Create
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    chatbots: (state.chatbotsInfo.chatbots),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchChatbots,
    createChatbot
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Chatbots)
