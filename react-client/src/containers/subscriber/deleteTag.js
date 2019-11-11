import React from 'react'
import { deleteTag } from '../../redux/actions/tags.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

class DeleteTags extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {

            tags: this.props.currentTags,
            deleteTag: ''
        }
        this.deleteTag = this.deleteTag.bind(this)
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.tags) {
            this.setState({
                tags: nextProps.tags
            })
        }
    }

    deleteTag(tag) {
        this.props.deleteTag(tag, this.msg, this.props.loadsubscriberData)
    }
    render() {
        var alertOptions = {
            offset: 14,
            position: 'top right',
            theme: 'dark',
            time: 5000,
            transition: 'scale'
        }

        return (
            <div>
                <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
                <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade center" id="deleteTag" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
                        <div style={{ width: '400px' }} className="modal-content">
                            <div style={{ display: 'block' }} className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Delete Tag
                                </h5>
                                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">
                                        &times;
                                    </span>
                                </button>
                            </div>
                            <div style={{ color: 'black' }} className="modal-body">
                                <p>Are you sure you want to delete? The tag will be removed and unassigned from all the subscribers.</p>
                                <button style={{ float: 'right', marginLeft: '10px' }}
                                    className='btn btn-primary btn-sm'
                                    // onClick={() => {
                                    //     this.deleteTag(this.state.deleteTag)
                                    // }}
                                    data-dismiss="modal" aria-label="Close"
                                >Yes
                                </button>
                                <button style={{ float: 'right' }}
                                    className='btn btn-primary btn-sm'
                                    data-dismiss="modal" aria-label="Close"
                                >Cancel
                                </button>
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
        tags: (state.tagsInfo.tags)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteTag: deleteTag,
    },
        dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(DeleteTags)
