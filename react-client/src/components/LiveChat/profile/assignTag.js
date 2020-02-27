import React from 'react'
import PropTypes from 'prop-types'
import ProfileAction from './profileAction'

class AssignTag extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedTag: ''
    }
    this.onTagChange = this.onTagChange.bind(this)
    this.assignTag = this.assignTag.bind(this)
    this.handleCreateTag = this.handleCreateTag.bind(this)
    this.onCreateTag = this.onCreateTag.bind(this)
  }

  onTagChange (value) {
    console.log('onTagChange', value)
    if (value) {
        this.setState({selectedTag: value})
    } else {
        this.setState({selectedTag: ''})
    }
  }

  onCreateTag (tag) {
    console.log('onCreateTag', tag)
    this.props.createTag(tag.value, this.handleCreateTag)
  }

  handleCreateTag (res) {
    if (res.status === 'success' && res.payload) {
        this.props.alertMsg.success(`New tag "${res.payload.tag}" created`)
        this.setState({
            selectedTag: {
                value: res.payload._id,
                label: res.payload.tag
            }
        })
    } else {
        this.props.alertMsg.error(`Tag couldn't be created`)
    }
  }


  assignTag() {
    let index = this.props.subscriberTags.findIndex(tag => tag._id === this.state.selectedTag.value)
    if (index === -1) {
        let payload = {
            subscribers: [this.props.activeSession._id],
            tagId: this.state.selectedTag.value
        }
        this.props.assignTags(payload, null, this.props.alertMsg)
    } else {
        this.props.alertMsg.error('Tag is already assigned')
    }
  }


  render () {
    return (
        <div>
            <ProfileAction 
                creatable
                onCreateOption={this.onCreateTag}
                title='Assign Tags'
                options={this.props.tags}
                currentSelected={this.state.selectedTag}
                selectPlaceholder='Select a tag...'
                performAction={this.assignTag}
                onSelectChange={this.onTagChange}
                actionTitle='Save'
                iconClass='fa fa-tags'
            />
        </div>
    )
  }
}

AssignTag.propTypes = {
    'tags': PropTypes.array.isRequired,
    'activeSession': PropTypes.object.isRequired,
    'subscriberTags': PropTypes.array.isRequired,
    'assignTags': PropTypes.func.isRequired,
    'createTag': PropTypes.func.isRequired
  }
  
export default AssignTag
