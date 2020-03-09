import React from 'react'
import PropTypes from 'prop-types'
import Creatable from 'react-select/creatable';

class AssignTag extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedTag: '',
      subscriberTags: props.subscriberTags.tags.map(tag => (
            {
                label: tag.tag,
                value: tag._id
            }
        ))
    }
    this.onTagChange = this.onTagChange.bind(this)
    this.assignTag = this.assignTag.bind(this)
    this.handleCreateTag = this.handleCreateTag.bind(this)
    this.onCreateTag = this.onCreateTag.bind(this)
    this.removeTags = this.removeTags.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
      if (nextProps.subscriberTags) {
          this.setState({subscriberTags: nextProps.subscriberTags.tags.map(tag => (
                    {
                        label: tag.tag,
                        value: tag._id
                    }
                ))
            })
      }
  }

  removeTags() {
    let payload = {
        subscribers: [this.props.activeSession._id],
        tagId: this.state.selectedTag.value
    }
    this.props.unassignTags(payload, null, this.props.alertMsg)
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
    this.props.createTag(tag, this.handleCreateTag)
  }

  handleCreateTag (res) {
    if (res.status === 'success' && res.payload) {
        this.props.alertMsg.success(`New tag "${res.payload.tag}" created`)
        this.setState({
            selectedTag: {
                value: res.payload._id,
                label: res.payload.tag
            }
        }, () => {
            this.assignTag()
        })
    } else {
        this.props.alertMsg.error(`Tag couldn't be created`)
    }
  }


  assignTag() {
    let index = this.state.subscriberTags.findIndex(tag => tag.value === this.state.selectedTag.value)
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

  onSelectChange (selected) {
    console.log('assignTag onSelectChange', selected)
    console.log('assignTag onSelectChange previousSelected', this.state.subscriberTags)
    if (selected && selected.length > 0 && selected.length > this.state.subscriberTags.length) {
        this.setState({selectedTag: {
            value: selected[selected.length - 1].value,
            label: selected[selected.length - 1].label
        }}, () => {
            this.assignTag()
        })
    } else if (this.state.subscriberTags.length > 0) {
        let removedTag = this.state.subscriberTags[0]
        if (selected && selected.length > 0) {
            removedTag = this.state.subscriberTags.filter(tag => !selected.includes(tag))[0]
        }
        this.setState({selectedTag: {
            value: removedTag.value,
            label: removedTag.label
        }}, () => {
            this.removeTags()
        })
    }
  }


  render () {
    return (
        <div>
            <div style={{marginBottom: '10px', marginTop: '15px'}}>
                <h6>Tags:</h6>
                <Creatable
                    styles={
                        {
                            valueContainer: (base) => ({
                                ...base,
                                maxHeight: '15vh',
                                overflowY: 'scroll'
                            })
                        }
                    }
                    isMulti
                    isClearable={false}
                    onCreateOption={this.onCreateTag}
                    options={this.props.tags}
                    onChange={this.onSelectChange}
                    value={[...this.state.subscriberTags]}
                    placeholder={'Assign tag(s)'}
                />
            </div>
            {/* <ProfileAction
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
              } */}
        </div>
    )
  }
}

AssignTag.propTypes = {
    'tags': PropTypes.array.isRequired,
    'activeSession': PropTypes.object.isRequired,
    'subscriberTags': PropTypes.object.isRequired,
    'assignTags': PropTypes.func.isRequired,
    'unassignTags': PropTypes.func.isRequired,
    'createTag': PropTypes.func.isRequired
  }

export default AssignTag
