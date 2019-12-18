import React from 'react'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class setAnswer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonActions: ['open website', 'open webview', 'set custom field', 'google sheets', 'hubspot'],
            broadcast: props.location.state.currentIntent.answer ? props.location.state.currentIntent.answer : [],
            convoTitle: 'Set Your Answer'
        }
        this.handleChange = this.handleChange.bind(this)
        this.onSave = this.onSave.bind(this)
        this.onBack = this.onBack.bind(this)
    }

    onSave() {
        this.props.location.state.currentIntent.answer = this.state.broadcast
        this.props.history.push({
            pathname: `/intents`,
            state: this.props.location.state
        })
    }

    onBack() {
        this.props.history.push({
            pathname: `/intents`,
            state: this.props.location.state
        })
    }

    handleChange(broadcast) {
        console.log(broadcast)
        this.setState(broadcast)
    }

    componentDidMount () {
      const hostname = window.location.hostname
      let title = ''
      if (hostname.includes('kiboengage.cloudkibo.com')) {
        title = 'KiboEngage'
      } else if (hostname.includes('kibochat.cloudkibo.com')) {
        title = 'KiboChat'
      }
      if (this.props.location.state && this.props.location.state.module === 'edit') {
        document.title = `${title} | Edit Message`
      } else {
        document.title = `${title} | Create Message`
      }
    }

    render() {
        return (
            <div>
                <div className='m-grid__item m-grid__item--fluid m-wrapper'>
                    <div className='m-content'>
                        <div className='row'>
                            <div className='col-xl-12'>
                                <div className='m-portlet'>
                                    <div className='m-portlet__head'>
                                        <div className='m-portlet__head-caption'>
                                            <div className='m-portlet__head-title'>
                                                <h3 className='m-portlet__head-text'>
                                                    {
                                                        this.props.isEdit
                                                            ? 'Edit Answer'
                                                            : 'Set Answer'
                                                    }
                                                </h3>
                                            </div>
                                        </div>
                                        <div className='m-portlet__head-tools'>
                                            <button
                                                className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                                                style={{ marginLeft: '5px' }}
                                                onClick={this.onBack}
                                            >
                                                <span>Back</span>
                                            </button>
                                            <button
                                                className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                                                style={{ marginLeft: '5px' }}
                                                disabled={this.state.broadcast.length < 1}
                                                onClick={this.onSave}>
                                                <span>Save</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='m-portlet__body'>
                                        <div className='row'>
                                            <div className='col-md-12 col-lg-12 col-sm-12'>
                                                <GenericMessage
                                                    broadcast={this.state.broadcast}
                                                    handleChange={this.handleChange}
                                                    pageId={this.props.location.state.page._id}
                                                    convoTitle={this.state.convoTitle}
                                                    buttonActions={this.state.buttonActions}
                                                    pages={[this.props.location.state.page._id]} />                                            </div>
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
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(setAnswer)
