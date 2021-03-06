import React from 'react'
import PropTypes from 'prop-types'
import TreeView from '@material-ui/lab/TreeView'
import StyledTreeItem from './styledTreeItem'
import BACKUP from './backup'

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      expandedNodes: [],
      backup: '',
      showBackup: false,
      items: [],
      selectedItem: '',
      emptyBlocks: 0
    }
    this.setItems = this.setItems.bind(this)
    this.getCollapseIcon = this.getCollapseIcon.bind(this)
    this.getExpandIcon = this.getExpandIcon.bind(this)
    this.getItems = this.getItems.bind(this)
    this.getChildren = this.getChildren.bind(this)
    this.expandAll = this.expandAll.bind(this)
    this.onNodeSelect = this.onNodeSelect.bind(this)
    this.getOrphanBlocks = this.getOrphanBlocks.bind(this)
    this.toggleBackupModal = this.toggleBackupModal.bind(this)
    this.openBackupModal = this.openBackupModal.bind(this)
    this.handleBackup = this.handleBackup.bind(this)
    this.createBackup = this.createBackup.bind(this)
    this.restoreBackup = this.restoreBackup.bind(this)
    this.afterCreateBackup = this.afterCreateBackup.bind(this)
    this.afterRestoreBackup = this.afterRestoreBackup.bind(this)
    this.afterSave = this.afterSave.bind(this)
    this.gotoEmptyBlock = this.gotoEmptyBlock.bind(this)
    this.isChatbotEmpty = this.isChatbotEmpty.bind(this)
  }

  setItems (data, currentBlock, blocks) {
    const items = data.filter((d) => d.parentId && d.parentId.toString() === currentBlock.uniqueId.toString())
    const emptyBlocks = blocks.filter((item) => item.payload.length === 0)
    this.setState({items, emptyBlocks: emptyBlocks.length})
  }

  componentDidMount () {
    if (this.props.data && this.props.data.length > 0) {
      this.expandAll(this.props.data)
      this.setItems(this.props.data, this.props.currentBlock, this.props.blocks)
    }
  }

  getItems () {
    const firstLevel = this.props.data.filter((item) => !item.parentId)
    const sidebar = (
      <StyledTreeItem
        nodeId={`${firstLevel[0].id}`}
        onNodeSelect={this.onNodeSelect}
        label={firstLevel[0].title}
        selected={firstLevel[0].id === this.props.currentBlock.uniqueId}
        completed={this.props.blocks.find((item) => item.uniqueId.toString() === firstLevel[0].id.toString()).payload.length > 0}
      >
        {this.getChildren(firstLevel[0].id)}
        {this.getOrphanBlocks(firstLevel[0].id)}
      </StyledTreeItem>
    )
    return sidebar
  }

  getChildren (id) {
    const children = this.props.data.filter((item) => item.parentId && item.parentId.toString() === id.toString())
    let elements = []
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        elements.push(
          <StyledTreeItem
            key={children[i].id}
            nodeId={`${children[i].id}`}
            onNodeSelect={this.onNodeSelect}
            label={children[i].title}
            selected={children[i].id === this.props.currentBlock.uniqueId}
            completed={this.props.blocks.find((item) => item.uniqueId.toString() === children[i].id.toString()).payload.length > 0}
          >
            {this.getChildren(children[i].id)}
          </StyledTreeItem>
        )
      }
      return elements
    } else {
      return
    }
  }

  getOrphanBlocks (id) {
    const blocks = this.props.data.filter((item) => !item.parentId && item.id.toString() !== id.toString())
    let elements = []
    if (blocks.length > 0) {
      for (let i = 0; i < blocks.length; i++) {
        elements.push(
          <StyledTreeItem
            key={blocks[i].id}
            nodeId={`${blocks[i].id}`}
            onNodeSelect={this.onNodeSelect}
            label={blocks[i].title}
            selected={blocks[i].id === this.props.currentBlock.uniqueId}
            completed={this.props.blocks.find((item) => item.uniqueId.toString() === blocks[i].id.toString()).payload.length > 0}
          >
          {this.getChildren(blocks[i].id)}
        </StyledTreeItem>
        )
      }
      return elements
    } else {
      return
    }
  }

  getCollapseIcon () {
    return (
      <i className='fa fa-chevron-down' />
    )
  }

  getExpandIcon () {
    return (
      <i className='fa fa-chevron-right' />
    )
  }

  expandAll (data) {
    const nodes = data.map((item) => `${item.id}`)
    this.setState({expandedNodes: nodes})
  }

  onNodeSelect (value) {
    const currentBlock = this.props.blocks.find((item) => item.uniqueId.toString() === value)
    if (this.props.unsavedChanges) {
      if (this.props.currentBlock.payload && this.props.currentBlock.payload.length === 0) {
        this.props.alertMsg.error('Text or attachment is required')
      } else {
        const data = {
          triggers: this.props.currentBlock.triggers,
          uniqueId: `${this.props.currentBlock.uniqueId}`,
          title: this.props.currentBlock.title,
          chatbotId: this.props.chatbot._id,
          payload: this.props.currentBlock.payload
        }
        console.log('data to save for message block', data)
        this.props.handleMessageBlock(data, (res) => this.afterSave(res, data, currentBlock))
      }
    } else {
      this.props.updateParentState({currentBlock})
    }
  }

  toggleBackupModal () {
    this.setState({showBackup: !this.state.showBackup}, () => {
      this.refs.chatbotBackup.click()
    })
  }

  openBackupModal () {
    this.props.fetchBackup(this.props.chatbot._id, this.handleBackup)
  }

  handleBackup (res) {
    if (res.status === 'success') {
      this.setState({backup: res.payload, showBackup: true}, () => {
        this.refs.chatbotBackup.click()
      })
    }
  }

  createBackup (callback) {
    this.props.createBackup(
      {chatbotId: this.props.chatbot._id},
      (res) => this.afterCreateBackup(res, callback)
    )
  }

  restoreBackup (callback) {
    this.props.restoreBackup(
      {chatbotId: this.props.chatbot._id},
      (res) => this.afterRestoreBackup(res, callback)
    )
  }

  afterCreateBackup (res, callback) {
    if (res.status === 'success') {
      this.toggleBackupModal()
      this.props.alertMsg.success('Backup created successfully')
    } else {
      this.props.alertMsg.error('Failed to create backup')
    }
    callback()
  }

  afterRestoreBackup (res, callback) {
    if (res.status === 'success') {
      this.props.fetchChatbot()
      this.props.fetchChatbotDetails()
      this.toggleBackupModal()
      this.props.alertMsg.success('Backup restored successfully')
    } else {
      this.props.alertMsg.error('Failed to restore backup')
    }
    callback()
  }

  afterSave (res, data, currentBlock) {
    if (res.status === 'success') {
      let blocks = this.props.blocks
      const index = blocks.findIndex((item) => item.uniqueId.toString() === data.uniqueId.toString())
      if (index !== -1) {
        blocks.splice(index, 1)
        // const deletedItem = blocks.splice(index, 1)
        // if (res.payload.upserted && res.payload.upserted.length > 0) {
        //   data._id = res.payload.upserted[0]._id
        // } else {
        //   data._id = deletedItem[0]._id
        // }
      }
      // const chatbot = this.props.chatbot
      // if (data.triggers && data._id) {
      //   chatbot.startingBlockId = data._id
      // }
      blocks = [...blocks, data]
      const completed = blocks.filter((item) => item.payload.length > 0).length
      const progress = Math.floor((completed / blocks.length) * 100)
      this.props.updateParentState({blocks, currentBlock, progress, unsavedChanges: false})
    } else {
      this.props.alertMsg.error(res.description)
    }
  }

  isChatbotEmpty () {
    const notEmptyBlocks = this.props.blocks.filter((item) => item.payload.length > 0)
    if (notEmptyBlocks.length > 0) {
      return false
    } else {
      return true
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.data && nextProps.data.length > 0) {
      this.expandAll(nextProps.data)
      this.setItems(nextProps.data, nextProps.currentBlock, nextProps.blocks)
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
          chatbotId: this.props.chatbot._id,
          payload: this.props.currentBlock.payload
        }
        console.log('data to save for message block', data)
        this.props.handleMessageBlock(data, (res) => this.afterSave(res, data, block))
      }
    } else {
      this.props.updateParentState({currentBlock: block})
    }
  }

  render () {
    return (
      <div id='_chatbot_sidebar' style={{border: '1px solid #ccc', backgroundColor: 'white', padding: '0px'}} className='col-md-3'>
        <div style={{margin: '0px', height: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} className='m-portlet m-portlet-mobile'>
          <div id='_chatbot_sidebar_items' style={{padding: '1.2rem 1.2rem', overflowY: 'scroll', flex: '1 1 auto'}} className='m-portlet__body'>
            {
              this.state.expandedNodes.length > 0 &&
              <TreeView
                defaultCollapseIcon={this.getCollapseIcon()}
                defaultExpandIcon={this.getExpandIcon()}
                defaultExpanded={this.state.expandedNodes}
              >
                {this.getItems()}
              </TreeView>
            }
            <BACKUP
              data={this.state.backup}
              createBackup={this.createBackup}
              restoreBackup={this.restoreBackup}
              toggleBackupModal={this.toggleBackupModal}
              emptyChatbot={this.isChatbotEmpty()}
            />
          </div>
          <div
            style={{
              flex: '0 0 auto',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: '0 1.2rem 1.2rem 1.2rem',
              borderTop: 'none'
            }}
            className="m-portlet__foot"
          >
            <div className="row align-items-center">
              <button
                ref='chatbotBackup'
                style={{display: 'none'}}
                data-toggle='modal'
                data-target='#_chatbot_backup_modal'
              />
              <div className="col-lg-12">
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    float: 'right',
                    cursor: 'pointer'
                  }}
                  className="m-link m--font-boldest m-btn m-btn--icon"
                  onClick={this.openBackupModal}
                >
                <br/>
                  <span>
                    <i className='fa fa-cloud-upload'/>
                    <span>Backup</span>
                  </span>
                </button>
              </div>
            </div>
            <div className='m--space-10' />
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
  'fetchBackup': PropTypes.func.isRequired,
  'createBackup': PropTypes.func.isRequired,
  'restoreBackup': PropTypes.func.isRequired,
  'fetchChatbotDetails': PropTypes.func.isRequired,
  'fetchChatbot': PropTypes.func.isRequired,
  'unsavedChanges': PropTypes.bool.isRequired,
  'handleMessageBlock': PropTypes.func.isRequired
}

export default Sidebar
