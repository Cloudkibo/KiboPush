import React from 'react'
import PropTypes from 'prop-types'
import ProfileAction from './profileAction'

class AssignTag extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedTag: '',
      subscriberTags: this.props.subscriberTags
    }
    this.onTagChange = this.onTagChange.bind(this)
    this.assignTag = this.assignTag.bind(this)
    this.handleCreateTag = this.handleCreateTag.bind(this)
    this.onCreateTag = this.onCreateTag.bind(this)
    this.removeTags = this.removeTags.bind(this)
  }

  removeTags(tagToRemove) {
    let payload = {
        subscribers: [this.props.activeSession._id],
        tagId: tagToRemove._id
    }
    this.props.unassignTags(payload, () => {
        let subscriberTags = this.state.subscriberTags
        let index = subscriberTags.find(tag => tag._id === tagToRemove._id)
        subscriberTags.splice(index, 1)
        this.setState({subscriberTags})
    }, this.props.alertMsg)
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
        this.props.assignTags(payload, () => {
            let subscriberTags = this.state.subscriberTags
            subscriberTags.push({
                _id: this.state.selectedTag.value,
                tag: this.state.selectedTag.label
            })
            this.setState({subscriberTags})
        }, this.props.alertMsg)
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
            {
                this.state.subscriberTags && this.state.subscriberTags.length > 0 &&
                <div className='row' style={{ minWidth: '150px', padding: '10px' }}>
                  {
                    this.state.subscriberTags.map((tag, i) => (
                      <span key={i} style={{ display: 'flex' }} className='tagLabel'>
                        <label className='tagName'>{tag.tag}</label>
                        <div className='deleteTag' style={{ marginLeft: '10px' }}>
                          <i className='fa fa-times fa-stack' style={{ marginRight: '-8px', cursor: 'pointer' }} onClick={() => this.removeTags(tag)} />
                        </div>
                      </span>
                    ))
                  }
                </div>
              }
        </div>
    )
  }
}

AssignTag.propTypes = {
    'tags': PropTypes.array.isRequired,
    'activeSession': PropTypes.object.isRequired,
    'subscriberTags': PropTypes.array.isRequired,
    'assignTags': PropTypes.func.isRequired,
    'unassignTags': PropTypes.func.isRequired,
    'createTag': PropTypes.func.isRequired
  }
  
export default AssignTag
