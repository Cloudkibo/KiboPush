import React from 'react'
import PropTypes from 'prop-types'
import TreeView from '@material-ui/lab/TreeView'
import StyledTreeItem from '../chatbotAutomation/styledTreeItem'
import Select from 'react-select'

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      items: [],
      selectedItem: '',
      emptyBlocks: 0
    }
    this.setItems = this.setItems.bind(this)
    this.onNodeSelect = this.onNodeSelect.bind(this)
    this.afterSave = this.afterSave.bind(this)
    this.getSelectOptions = this.getSelectOptions.bind(this)
    this.onBlockChange = this.onBlockChange.bind(this)
    this.backToParent = this.backToParent.bind(this)
    this.gotoEmptyBlock = this.gotoEmptyBlock.bind(this)
  }

  componentDidMount () {
    if (this.props.data && this.props.data.length > 0) {
      this.setItems(this.props.data, this.props.currentBlock, this.props.blocks)
    }
    const selectedItem = {
      label: this.props.currentBlock.title,
      value: this.props.currentBlock.uniqueId
    }
    this.setState({selectedItem})
  }

  getSelectOptions () {
    const options = this.props.blocks.map((item) => {
      return {
        label: item.title,
        value: item.uniqueId
      }
    })
    return options
  }

  onBlockChange (value, others) {
    const currentBlock = this.props.blocks.find((item) => item.uniqueId === value.value)
    this.setState({selectedItem: value}, () => {
      this.props.updateParentState({currentBlock})
    })
  }

  setItems (data, currentBlock, blocks) {
    const items = data.filter((d) => d.parentId && d.parentId === currentBlock.uniqueId)
    const emptyBlocks = blocks.filter((item) => item.payload.length === 0)
    this.setState({items, emptyBlocks: emptyBlocks.length})
  }

  backToParent () {
    if (!this.props.attachmentUploading) {
      const parentId = this.props.data.find((item) => item.id === this.state.selectedItem.value).parentId
      if (parentId) {
        const currentBlock = this.props.blocks.find((item) => item.uniqueId === parentId)
        if (this.props.unsavedChanges) {
          if (this.props.currentBlock.payload && this.props.currentBlock.payload.length === 0) {
            this.props.alertMsg.error('Text or attachment is required')
          } else {
            const data = {
              triggers: this.props.currentBlock.triggers,
              uniqueId: `${this.props.currentBlock.uniqueId}`,
              title: this.props.currentBlock.title,
              chatbotId: this.props.chatbot.chatbotId,
              payload: this.props.currentBlock.payload,
              options: this.props.currentBlock.options
            }
            console.log('data to save for message block', data)
            this.props.handleMessageBlock(data, (res) => this.afterSave(res, data, currentBlock))
          }
        } else {
          this.props.updateParentState({currentBlock})
        }
      } else {
        this.props.updateParentState({currentBlock: this.props.blocks[0]})
      }
    }
  }

  onNodeSelect (event, value) {
    if (!this.props.attachmentUploading) {
      const currentBlock = this.props.blocks.find((item) => item.uniqueId === value)
      if (this.props.unsavedChanges) {
        if (this.props.currentBlock.payload && this.props.currentBlock.payload.length === 0) {
          this.props.alertMsg.error('Text or attachment is required')
        } else {
          const data = {
            triggers: this.props.currentBlock.triggers,
            uniqueId: `${this.props.currentBlock.uniqueId}`,
            title: this.props.currentBlock.title,
            chatbotId: this.props.chatbot.chatbotId,
            payload: this.props.currentBlock.payload,
            options: this.props.currentBlock.options
          }
          console.log('data to save for message block', data)
          this.props.handleMessageBlock(data, (res) => this.afterSave(res, data, currentBlock))
        }
      } else {
        this.props.updateParentState({currentBlock})
      }
    }
  }

  afterSave (res, data, currentBlock) {
    if (res.status === 'success') {
      let blocks = this.props.blocks
      const index = blocks.findIndex((item) => item.uniqueId === data.uniqueId)
      if (index !== -1) {
        blocks.splice(index, 1)
      }
      blocks = [...blocks, data]
      const completed = blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / blocks.length) * 100)
      this.props.updateParentState({blocks, currentBlock, progress, unsavedChanges: false})
    } else {
      this.props.alertMsg.error(res.description)
    }
  }

  gotoEmptyBlock () {
    const block = this.props.blocks.find((item) => item.payload.length === 0)
    if (this.props.unsavedChanges) {
      if (this.props.currentBlock.payload && this.props.currentBlock.payload.length === 0) {
        this.props.alertMsg.error('Text or attachment is required')
      } else {
        const data = {
          triggers: this.props.currentBlock.triggers,
          uniqueId: `${this.props.currentBlock.uniqueId}`,
          title: this.props.currentBlock.title,
          chatbotId: this.props.chatbot.chatbotId,
          payload: this.props.currentBlock.payload,
          options: this.props.currentBlock.options
        }
        console.log('data to save for message block', data)
        this.props.handleMessageBlock(data, (res) => this.afterSave(res, data, block))
      }
    } else {
      this.props.updateParentState({currentBlock: block})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.data && nextProps.data.length > 0) {
      this.setItems(nextProps.data, nextProps.currentBlock, nextProps.blocks)
    }
    if (nextProps.currentBlock) {
      const selectedItem = {
        label: nextProps.currentBlock.title,
        value: nextProps.currentBlock.uniqueId
      }
      this.setState({selectedItem})
    }
  }

  render () {
    return (
      <div id='_chatbot_sidebar' style={{border: '1px solid #ccc', backgroundColor: 'white', padding: '0px'}} className='col-md-3'>
        <div style={{margin: '0px', height: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} className='m-portlet m-portlet-mobile'>
          <div style={{flex: '0 0 auto'}} className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='row'>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='col-md-2'>
                  {
                    this.props.currentBlock.uniqueId === this.props.chatbot.startingBlockId
                    ? <i
                      style={{fontSize: '2rem', cursor: 'not-allowed'}}
                      data-tip='Back to parent'
                      data-place='bottom'
                      className='la la-mail-reply'
                    />
                    : <i
                      style={{fontSize: '2rem', cursor: 'pointer'}}
                      onClick={this.backToParent}
                      data-tip='Back to parent'
                      data-place='bottom'
                      className='la la-mail-reply'
                    />
                  }
                </div>
                <div className='col-md-10'>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isDisabled={true}
                    options={this.getSelectOptions()}
                    value={this.state.selectedItem}
                    onChange={this.onBlockChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div id='_chatbot_sidebar_items' style={{padding: '1.2rem 1.2rem', overflowY: 'scroll', flex: '1 1 auto'}} className='m-portlet__body'>
            <TreeView
              onNodeSelect={this.onNodeSelect}
            >
              {
                this.state.items.length > 0 && this.state.items.map((item) => (
                  <StyledTreeItem
                    key={item.id}
                    nodeId={`${item.id}`}
                    label={item.title}
                    selected={item.id === this.props.currentBlock.uniqueId}
                    completed={this.props.blocks.find((b) => b.uniqueId === item.id).payload.length > 0}
                  />
                ))
              }
            </TreeView>
          </div>
          <div
            style={{
              flex: '0 0 auto',
              width: '100%',
              padding: '1.1rem'
            }}
            className="m-portlet__foot"
          >
						<div className="row align-items-center">
							<div className="col-lg-12">
                <span className='pull-right'>
                  Empty blocks: {this.state.emptyBlocks}
                  {
                    this.state.emptyBlocks > 0 &&
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onClick={this.gotoEmptyBlock}
                      className="m-link m--font-boldest m-btn"
                    >
                      <span>
                        (Fix)
                      </span>
                    </button>
                  }
                </span>
  						</div>
  					</div>
          </div>
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  'data': PropTypes.array.isRequired,
  'currentBlock': PropTypes.object.isRequired,
  'blocks': PropTypes.array.isRequired,
  'updateParentState': PropTypes.func.isRequired,
  'chatbot': PropTypes.object.isRequired,
  'unsavedChanges': PropTypes.bool.isRequired,
  'handleMessageBlock': PropTypes.func.isRequired,
  'attachmentUploading': PropTypes.bool.isRequired
}

export default Sidebar
