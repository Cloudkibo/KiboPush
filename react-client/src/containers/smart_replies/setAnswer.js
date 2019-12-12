import React from 'react'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class setAnswer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonActions: ['open website'],
            broadcast: [],
            convoTitle: 'Set Your Answer'
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(broadcast) {
        console.log(broadcast)
        this.setState(broadcast)
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
                                                >
                                                <span>Back</span>
                                            </button>
                                            <button
                                                className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                                                style={{ marginLeft: '5px' }}
                                                disabled={this.state.broadcast.length < 1}>
                                                <span>Save</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='m-portlet__body'>
                                        <div className='row'>
                                            <div className='col-md-12 col-lg-12 col-sm-12'>
                                                <GenericMessage
                                                    module='sponsorMessaging'
                                                    broadcast={this.state.broadcast}
                                                    handleChange={this.handleChange}
                                                    pageId={this.props.location.state.page._id}
                                                    convoTitle={this.state.convoTitle}
                                                    buttonActions={this.state.buttonActions} />                                            </div>
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
