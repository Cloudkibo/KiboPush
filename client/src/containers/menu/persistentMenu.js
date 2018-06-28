import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { saveCurrentMenuItem, removeMenu, saveMenu, getIndexBypage } from '../../redux/actions/menu.actions'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { transformData, removeMenuPayload } from './utility'
import { Link } from 'react-router'
import AlertContainer from 'react-alert'
import { registerAction } from '../../utility/socketio'
import { isWebURL } from './../../utility/utils'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import ViewScreen from './viewScreen'
import Halogen from 'halogen'

class Menu extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.state = {
      openPopover: false,
      menuItems: [{
        title: 'Menu Item',
        submenu: []
      }],
      selectPage: '',
      selectedIndex: 'menuPopover',
      disabledWebUrl: true,
      showPreview: false,
      isEditMessage: false,
      loading: false
    }

    this.pageChange = this.pageChange.bind(this)
    this.selectPage = this.selectPage.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.selectIndex = this.selectIndex.bind(this)
    this.addMenu = this.addMenu.bind(this)
    this.removeMenu = this.removeMenu.bind(this)
    this.addSubMenu = this.addSubMenu.bind(this)
    this.removeSubMenu = this.removeSubMenu.bind(this)
    this.addNestedMenu = this.addNestedMenu.bind(this)
    this.removeNestedMenu = this.removeNestedMenu.bind(this)
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.setWebUrl = this.setWebUrl.bind(this)
    this.saveWebUrl = this.saveWebUrl.bind(this)
    this.replyWithMessage = this.replyWithMessage.bind(this)
    this.getMenuByIndex = this.getMenuByIndex.bind(this)
    this.changeLabel = this.changeLabel.bind(this)
    this.saveMenu = this.saveMenu.bind(this)
    this.handleSaveMenu = this.handleSaveMenu.bind(this)
    this.validateMenu = this.validateMenu.bind(this)
    this.removeMainMenu = this.removeMainMenu.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.showPreview = this.showPreview.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.handleIndexByPage = this.handleIndexByPage.bind(this)
    this.initializeMenuItems = this.initializeMenuItems.bind(this)
    this.validatePostbackPayload = this.validatePostbackPayload.bind(this)
    if (!this.props.currentMenuItem) {
      if (this.props.pages && this.props.pages.length > 0) {
        this.props.getIndexBypage(this.props.pages[0].pageId, this.handleIndexByPage)
      }
    }
  }

  componentDidMount () {
    document.title = 'KiboPush | Menu'
    var compProp = this.props
    registerAction({
      event: 'menu_updated',
      action: function (data) {
        compProp.getIndexBypage(compProp.pages[0].pageId, this.handleIndexByPage)
      }
    })
    if (this.props.location.state && this.props.location.state.action === 'replyWithMessage') {
      var index = this.props.currentMenuItem.clickedIndex.split('-')
      var menuReturned = this.props.currentMenuItem.itemMenus
      var menu = this.getMenuHierarchy(this.props.currentMenuItem.clickedIndex)
      switch (menu) {
        case 'item':
          if (menuReturned[index[1]].payload && menuReturned[index[1]].payload.length < 1) {
            menuReturned[index[1]].type = ''
            menuReturned[index[1]].payload = null
          }
          break
        case 'submenu':
          if (menuReturned[index[1]].submenu[index[2]].payload && menuReturned[index[1]].submenu[index[2]].payload.length < 1) {
            menuReturned[index[1]].submenu[index[2]].type = ''
            menuReturned[index[1]].submenu[index[2]] = null
          }
          break
        case 'nestedMenu':
          if (menuReturned[index[1]].submenu[index[2]].submenu[index[3]].payload && menuReturned[index[1]].submenu[index[2]].submenu[index[3]].payload.length < 1) {
            menuReturned[index[1]].submenu[index[2]].submenu[index[3]].type = ''
            menuReturned[index[1]].submenu[index[2]].submenu[index[3]].payload = null
          }
          break
        default:
          break
      }
      this.setState({
        menuItems: menuReturned,
        selectedIndex: this.props.currentMenuItem.clickedIndex
      })
      for (var i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === this.props.currentMenuItem.currentPage) {
          this.setState({ selectPage: this.props.pages[i] })
        }
      }
    }
  }
  validatePostbackPayload (indexVal) {
    var menuItemReturned = this.getMenuByIndex(indexVal)
    if (menuItemReturned.payload && menuItemReturned.payload.length < 0) {
      var temp = this.state.menuItems
      var index = indexVal.split('-')
      var menu = this.getMenuHierarchy(indexVal)
      switch (menu) {
        case 'item':
          temp[index[1]].type = ''
          temp[index[1]].payload = null
          break
        case 'submenu':
          temp[index[1]].submenu[index[2]].type = ''
          temp[index[1]].submenu[index[2]].payload = null
          break
        case 'nestedMenu':
          temp[index[1]].submenu[index[2]].submenu[index[3]].type = ''
          temp[index[1]].submenu[index[2]].submenu[index[3]].payload = null
          break

        default:
          break
      }
    }
  }
  initializeMenuItems () {
    var tempItemMenus = [{
      title: 'Main Menu',
      submenu: []
    }]
    this.setState({
      menuItems: tempItemMenus
    })
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.pages && nextProps.pages.length > 0 && this.state.selectPage === '') {
      this.setState({selectPage: nextProps.pages[0]})
    }
  }
  replyWithMessage (e) {
    var temp = this.state.menuItems
    var index = this.state.selectedIndex.split('-')
    var menu = this.getMenuHierarchy(this.state.selectedIndex)
    var payload = []
    switch (menu) {
      case 'item':
        //  console.log('An Item was Clicked position ', index[1])
        if (temp[index[1]].payload && temp[index[1]].payload !== '') {
          payload = temp[index[1]].payload
        }
        if (temp[index[1]].url) {
          delete temp[index[1]].url
        }
        temp[index[1]].type = 'postback'
        temp[index[1]].payload = payload
        break
      case 'submenu':
        //  console.log('A Submenu was Clicked position ', index[1], index[2])
        if (temp[index[1]].submenu[index[2]].payload && temp[index[1]].submenu[index[2]].payload !== '') {
          payload = temp[index[1]].submenu[index[2]].payload
        }
        if (temp[index[1]].submenu[index[2]].url) {
          delete temp[index[1]].submenu[index[2]].url
        }

        temp[index[1]].submenu[index[2]].type = 'postback'
        temp[index[1]].submenu[index[2]].payload = payload
        break
      case 'nestedMenu':
        //  console.log('A Nested was Clicked position ', index[1], index[2], index[3])
        if (temp[index[1]].submenu[index[2]].submenu[index[3]].payload && temp[index[1]].submenu[index[2]].submenu[index[3]].payload !== '') {
          payload = temp[index[1]].submenu[index[2]].submenu[index[3]].payload
        }
        if (temp[index[1]].submenu[index[2]].submenu[index[3]].url) {
          delete temp[index[1]].submenu[index[2]].submenu[index[3]].url
        }

        temp[index[1]].submenu[index[2]].submenu[index[3]].type = 'postback'
        temp[index[1]].submenu[index[2]].submenu[index[3]].payload = payload
        break

      default:
        break
    }

    this.setState({menuItems: temp})
    var currentState = { itemMenus: this.state.menuItems, clickedIndex: this.state.selectedIndex, currentPage: this.state.selectPage.pageId }
    this.props.saveCurrentMenuItem(currentState)
  }
  showPreview () {
    this.setState({
      showPreview: true
    })
  }
  closeDialog () {
    this.setState({
      showPreview: false
    })
  }
  handleReset () {
    this.props.getIndexBypage(this.state.selectPage.pageId, this.handleIndexByPage)
  }
  handleIndexByPage (res) {
    if (res.status === 'success' && res.payload && res.payload.length > 0) {
      this.setState({
        menuItems: res.payload[0].jsonStructure
      })
      for (var i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === res.payload.pageId) {
          this.setState({ selectPage: this.props.pages[i] })
        }
      }
    } else {
      this.initializeMenuItems()
    }
  }
  removeMainMenu () {
    var data = {}
    data.payload = removeMenuPayload()
    data.pageId = this.state.selectPage.pageId
    data.userId = this.props.user._id
    var tempItemMenus = [{
      title: 'Main Menu',
      submenu: []
    }]
    data.jsonStructure = tempItemMenus
    var currentState = null
    this.props.saveCurrentMenuItem(currentState)
    this.props.removeMenu(data, this.handleReset, this.msg)
  }
  validateMenu () {
    var errorMessage = ''
    var menuItems = this.state.menuItems
    for (var j = 0; j < menuItems.length; j++) {
      if (menuItems[j].title === '') {
        errorMessage = 'Menu title cannot be empty'
        break
      }
      if ((!menuItems[j].type || menuItems[j].type === '') && menuItems[j].submenu.length === 0) {
        errorMessage = `Please select action for your menu '${menuItems[j].title}`
        break
      }
      for (var k = 0; k < menuItems[j].submenu.length; k++) {
        if (menuItems[j].submenu[k].title === '') {
          errorMessage = 'Menu title cannot be empty'
          break
        }
        if ((!menuItems[j].submenu[k].type || menuItems[j].submenu[k].type === '') && menuItems[j].submenu[k].submenu.length === 0) {
          errorMessage = `Please select action for your submenu '${menuItems[j].submenu[k].title}'`
          break
        }
        for (var l = 0; l < menuItems[j].submenu[k].submenu.length; l++) {
          if (menuItems[j].submenu[k].submenu[l].title === '') {
            errorMessage = 'Menu title cannot be empty'
            break
          }
          if (!menuItems[j].submenu[k].submenu[l].type || menuItems[j].submenu[k].submenu[l].type === '') {
            errorMessage = `Please select action for your submenu '${menuItems[j].submenu[k].submenu[l].title}`
            break
          }
        }
      }
    }
    return errorMessage
  }
  changeLabel (e) {
    var temp = this.state.menuItems
    var index = this.state.selectedIndex.split('-')
    if (index && index.length > 1) {
      var menu = this.getMenuHierarchy(this.state.selectedIndex)
      switch (menu) {
        case 'item':
          temp[index[1]].title = e.target.value
          break
        case 'submenu':
          temp[index[1]].submenu[index[2]].title = e.target.value
          break
        case 'nestedMenu':
          temp[index[1]].submenu[index[2]].submenu[index[3]].title = e.target.value
          break
        default:
          break
      }
    }
    this.setState({
      menuItems: temp
    })
  }
  selectIndex (e, index) {
    this.setState({
      selectedIndex: index,
      openPopover: false
    })
    var menu = this.getMenuByIndex(index)
    if (menu.type === 'web_url') {
      this.setState({
        selectedRadio: 'openWebsite',
        webUrl: menu.url,
        disabledWebUrl: false
      })
    } else if (menu.type === 'nested') {
      this.setState({
        selectedRadio: 'openSubMenu'
      })
    } else if (menu.type === 'postback') {
      this.setState({
        selectedRadio: 'replyWithMessage',
        isEditMessage: true
      })
    } else {
      this.setState({
        selectedRadio: '',
        webUrl: ''
      })
    }
    console.log('Selected Index', this.state.selectedIndex)
  }
  handleRadioChange (e) {
    this.setState({
      selectedRadio: e.currentTarget.value,
      isEditMessage: false
    })
    var index = this.state.selectedIndex.split('-')
    if (e.currentTarget.value === 'openSubMenu') {
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'item') {
        this.addSubMenu(index[1])
      }
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'submenu') {
        this.addNestedMenu(index[1], index[2])
      }
      this.handleToggle()
    }
    if (e.currentTarget.value === 'replyWithMessage') {
      var menuItems = this.state.menuItems
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'item') {
        menuItems[index[1]].submenu = []
      }
      if (this.getMenuHierarchy(this.state.selectedIndex) === 'submenu') {
        menuItems[index[1]].submenu[index[2]].submenu = []
      }
      this.setState({
        menuItems: menuItems
      })
    }
  }
  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
  }
  pageChange (event) {
    if (event.target.value !== -1) {
      let page
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === event.target.value) {
          page = this.props.pages[i]
          break
        }
      }
      if (page) {
        this.setState({
          selectPage: page
        })
      }
      var currentState = null
      this.props.saveCurrentMenuItem(currentState)
      this.props.getIndexBypage(page.pageId, this.handleIndexByPage)
    } else {
      this.setState({
        selectPage: {}
      })
    }
  }
  selectPage () {
    if (this.props.pages && this.props.pages.length > 0) {
      this.setState({
        selectPage: this.props.pages[0]
      })
    } else {
      this.setState({
        selectPage: {}
      })
    }
  }
  addMenu () {
    var menuItems = this.state.menuItems
    var newMenu = {
      title: 'Menu Item',
      submenu: []
    }
    menuItems.push(newMenu)
    this.setState({
      menuItems: this.state.menuItems
    })
  }
  removeMenu (index) {
    var menuItems = []
    for (let i = 0; i < this.state.menuItems.length; i++) {
      if (index !== i) {
        menuItems.push(this.state.menuItems[i])
      }
    }
    this.setState({
      menuItems: menuItems
    })
  }
  addSubMenu (index) {
    var menuItems = this.state.menuItems
    var newSubmenu = {
      title: 'Sub Menu',
      submenu: []
    }
    if (menuItems[index].payload) {
      delete menuItems[index].payload
    }
    if (menuItems[index].url) {
      delete menuItems[index].url
    }
    menuItems[index].type = 'nested'
    var submenus = menuItems[index].submenu
    submenus.push(newSubmenu)
    this.setState({
      menuItems: this.state.menuItems
    })
  }
  removeSubMenu (index, subIndex) {
    var subItems = []
    for (let i = 0; i < this.state.menuItems[index].submenu.length; i++) {
      if (subIndex !== i) {
        subItems.push(this.state.menuItems[index].submenu[i])
      }
    }

    var menuItems = this.state.menuItems
    menuItems[index].submenu = subItems
    if (subItems.length === 0) {
      menuItems[index].type = ''
    }
    this.setState({
      menuItems: menuItems
    })
  }
  addNestedMenu (index, subIndex) {
    var menuItems = this.state.menuItems
    var newNestedMenu = {
      title: 'Nested Menu'
    }
    if (menuItems[index].submenu[subIndex].payload) {
      delete menuItems[index].submenu[subIndex].payload
    }
    if (menuItems[index].submenu[subIndex].url) {
      delete menuItems[index].submenu[subIndex].url
    }
    menuItems[index].submenu[subIndex].type = 'nested'
    var nestedMenus = menuItems[index].submenu[subIndex].submenu
    nestedMenus.push(newNestedMenu)
    this.setState({
      menuItems: this.state.menuItems
    })
  }
  removeNestedMenu (index, subIndex, nestedIndex) {
    var nestedItems = []
    for (let i = 0; i < this.state.menuItems[index].submenu[subIndex].submenu.length; i++) {
      if (nestedIndex !== i) {
        nestedItems.push(this.state.menuItems[index].submenu[subIndex].submenu[i])
      }
    }

    var menuItems = this.state.menuItems
    menuItems[index].submenu[subIndex].submenu = nestedItems
    if (nestedItems.length === 0) {
      menuItems[index].submenu[subIndex].type = ''
    }
    this.setState({
      menuItems: menuItems
    })
  }
  getMenuHierarchy (indexVal) {
    var index = indexVal.split('-')
    var menu = ''
    if (index && index.length > 1) {
      if (index.length === 2) {
        menu = 'item'
      } else if (index.length === 3) {
        menu = 'submenu'
      } else if (index.length === 4) {
        menu = 'nestedMenu'
      } else {
        menu = 'invalid'
      }
    }
    return menu
  }
  getMenuByIndex (indexValue) {
    var menuItems = this.state.menuItems
    var item = ''
    var index = indexValue.split('-')
    if (index && index.length > 1) {
      if (index.length === 2) {
        item = menuItems[index[1]]
      } else if (index.length === 3) {
        item = menuItems[index[1]].submenu[index[2]]
      } else if (index.length === 4) {
        item = menuItems[index[1]].submenu[index[2]].submenu[index[3]]
      } else {
        item = 'invalid'
      }
    }
    return item
  }
  setWebUrl (event) {
    this.setState({
      webUrl: event.target.value
    })
    if (event.target.value !== '' && isWebURL(event.target.value)) {
      this.setState({
        disabledWebUrl: false
      })
    } else {
      this.setState({
        disabledWebUrl: true
      })
    }
  }
  saveWebUrl (event) {
    var temp = this.state.menuItems
    var index = this.state.selectedIndex.split('-')
    if (index && index.length > 1) {
      var menu = this.getMenuHierarchy(this.state.selectedIndex)
      switch (menu) {
        case 'item':
          if (temp[index[1]].payload) {
            delete temp[index[1]].payload
          }
          temp[index[1]].type = 'web_url'
          temp[index[1]].url = this.state.webUrl
          break
        case 'submenu':
          if (temp[index[1]].submenu[index[2]].payload) {
            delete temp[index[1]].submenu[index[2]].payload
          }
          temp[index[1]].submenu[index[2]].type = 'web_url'
          temp[index[1]].submenu[index[2]].url = this.state.webUrl
          break
        case 'nestedMenu':
          if (temp[index[1]].submenu[index[2]].submenu[index[3]].payload) {
            delete temp[index[1]].submenu[index[2]].submenu[index[3]].payload
          }
          temp[index[1]].submenu[index[2]].submenu[index[3]].type = 'web_url'
          temp[index[1]].submenu[index[2]].submenu[index[3]].url = this.state.webUrl
          break
        default:
          break
      }
    }
    this.setState({menuItems: temp})
    this.handleToggle()
  }
  saveMenu () {
    if (this.state.menuItems && this.state.menuItems.length > 0) {
      var errorMessage = this.validateMenu()
      if (errorMessage === '') {
        var currentState = { itemMenus: this.state.menuItems, clickedIndex: this.state.selectedIndex, currentPage: this.state.selectPage.pageId }
        this.props.saveCurrentMenuItem(currentState)
        var temp = []
        for (var k = 0; k < this.state.menuItems.length; k++) {
          temp.push(this.state.menuItems[k])
        }
        temp.push({url: 'www.kibopush.com', type: 'web_url', submenu: [], title: 'Powered by KiboPush'})
        var data = {}
        if (!this.state.selectPage) {
          this.msg.error('Please select a page')
          return
        }
        data.payload = transformData(temp)
        data.pageId = this.state.selectPage.pageId
        data.userId = this.props.user._id
        data.jsonStructure = this.state.menuItems
        this.setState({
          loading: true
        })
        this.props.saveMenu(data, this.handleSaveMenu, this.msg)
      } else {
        this.msg.error(errorMessage)
      }
    }
  }
  handleSaveMenu (res) {
    if (res.status === 'success' && res.payload) {
      this.setState({
        menuItems: res.payload.jsonStructure
      })
      for (var i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === res.payload.pageId) {
          this.setState({ selectPage: this.props.pages[i] })
        }
      }
    }
    this.setState({
      loading: false
    })
    var currentState = null
    this.props.saveCurrentMenuItem(currentState)
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div id='menuPopover' />
        {
          this.state.loading
          ? <ModalContainer>
            <div style={{position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em'}}
              className='align-center'>
              <center><Halogen.RingLoader color='#716aca' /></center>
            </div>
          </ModalContainer>
          : <span />
        }
        <Popover placement='right-end' isOpen={this.state.openPopover} className='menuPopover' target={this.state.selectedIndex} toggle={this.handleToggle}>
          <PopoverHeader><strong>Edit Menu Item</strong></PopoverHeader>
          <PopoverBody>
            <h6>Choose an action for the menu item:</h6>
            <div className='radio-buttons' style={{marginLeft: '37px'}}>
              {
                this.getMenuHierarchy(this.state.selectedIndex) !== 'nestedMenu' &&
                  <div className='radio'>
                    <input id='openSubMenu'
                      type='radio'
                      value='openSubMenu'
                      name='openSubMenu'
                      onChange={this.handleRadioChange}
                      checked={this.state.selectedRadio === 'openSubMenu'} />
                    <label>Open a submenu</label>
                  </div>
              }
              <div className='radio'>
                <input id='replyWithMessage'
                  type='radio'
                  value='replyWithMessage'
                  name='replyWithMessage'
                  onChange={this.handleRadioChange}
                  checked={this.state.selectedRadio === 'replyWithMessage'} />
                <label>Reply with a message</label>
              </div>
              <div className='radio'>
                <input id='openWebsite'
                  type='radio'
                  value='openWebsite'
                  name='openWebsite'
                  onChange={this.handleRadioChange}
                  checked={this.state.selectedRadio === 'openWebsite'} />
                <label>Open website </label>
              </div>
            </div>
            {
              this.getMenuHierarchy(this.state.selectedIndex) !== 'nestedMenu' &&
              <span style={{fontSize: '0.9rem'}}>
                If you change the menu item action, all the underlying submenus and their
                content will be lost
              </span>
           }
            {
              this.state.selectedRadio === 'openWebsite' &&
              <div style={{marginTop: '20px'}}>
                <label>Website URL to open</label>
                <input placeholder='Enter URL' style={{marginBottom: '20px'}} value={this.state.webUrl} onChange={this.setWebUrl} type='url' className='form-control' />
                <button onClick={this.saveWebUrl} className='btn btn-success pull-right' disabled={(this.state.disabledWebUrl)}> Done </button>
                <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc', marginBottom: '10px'}} onClick={this.handleToggle} className='btn pull-left'> Cancel </button>
              </div>
            }
            {
             this.state.selectedRadio === 'replyWithMessage' &&
             <div className='col-12' style={{marginTop: '20px', marginBottom: '10px'}}>
               { this.state.isEditMessage
               ? <Link to='CreateMessage' className='btn btn-success m-btn m-btn--icon replyWithMessage' onClick={this.replyWithMessage}>
                  Edit Message
                </Link>
                : <Link to='CreateMessage' className='btn btn-success m-btn m-btn--icon replyWithMessage' onClick={this.replyWithMessage}>
                   Create Message
                </Link>
               }
             </div>
            }
          </PopoverBody>
        </Popover>
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Persistent Menu</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
                this.props.pages && this.props.pages.length === 0 &&
                <div className='alert alert-success'>
                  <h4 className='block'>0 Connected Pages</h4>
                    You do not have any connected pages. Unless you do not connect any pages, you won't be able to set Persistent Menu. PLease click <Link to='/addPages' style={{color: 'blue', cursor: 'pointer'}}> here </Link> to connect your Facebook Page.'
                  </div>
              }
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding Persistent Menu? Here is the <a href='http://kibopush.com/persistent-menu/' target='_blank'>documentation</a>.
                  Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
                </div>
              </div>
              <div className='m-portlet m-portlet--full-height '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption' style={{width: '400px'}}>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>Edit Menu</h3>
                    </div>
                  </div>
                </div>
                <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
                <div className='m-portlet__body' >
                  <div className='row align-items-center'>
                    <div className='col-xl-8 order-2 order-xl-1' />
                    <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                      {
                        this.state.showPreview &&
                        <ModalContainer style={{top: '100px'}}
                          onClose={this.closeDialog}>
                          <ModalDialog style={{top: '100px'}}
                            onClose={this.closeDialog}>
                            <h3>Persistent Menu Preview</h3>
                            <div>
                              <ViewScreen data={this.state.menuItems} page={this.state.selectPage.pageName} />
                            </div>
                          </ModalDialog>
                        </ModalContainer>
                      }
                    </div>
                  </div>
                  <div className='row'>
                    <label className='col-3 col-form-label' style={{textAlign: 'left'}}>Select a page</label>
                    <div className='col-8 input-group'>
                      <select className='form-control m-input' value={this.state.selectPage.pageId} onChange={this.pageChange}>
                        {
                          this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                            page.connected &&
                            <option key={page.pageId} value={page.pageId} selected={page.pageId === this.state.selectPage.pageId}>{page.pageName}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                  <div className='row' style={{display: 'block', marginTop: '40px', padding: '20px'}}>
                    <div className='container'>
                      {
                        this.state.menuItems.map((item, index) => {
                          return (
                            <div key={index}>
                              <div className='col-6 menuDiv m-input-icon m-input-icon--right'>
                                <input id={'item-' + index} onClick={(e) => { this.selectIndex(e, 'item-' + index); this.handleToggle() }} type='text' className='form-control m-input menuInput' onChange={(e) => this.changeLabel(e)} value={item.title} />
                                { this.state.menuItems.length > 1 &&
                                  <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeMenu(index)}>
                                    <span>
                                      <i className='fa fa-times-circle' />
                                    </span>
                                  </span>
                                }
                              </div>
                              {item.submenu.map((subItem, subindex) => {
                                return (
                                  <div key={subindex}>
                                    <div className='col-6 menuDiv m-input-icon m-input-icon--right' style={{paddingLeft: '30px'}}>
                                      <input id={'item-' + index + '-' + subindex} onClick={(e) => { this.selectIndex(e, 'item-' + index + '-' + subindex); this.handleToggle() }} onChange={(e) => this.changeLabel(e)} type='text' className='form-control m-input menuInput' value={subItem.title} />
                                      <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeSubMenu(index, subindex)}>
                                        <span>
                                          <i className='fa fa-times-circle' />
                                        </span>
                                      </span>
                                    </div>
                                    <div>
                                      {
                                        subItem.submenu.map((nestedItem, nestedIndex) => {
                                          return (
                                            <div key={nestedIndex} className='col-6 menuDiv m-input-icon m-input-icon--right' style={{paddingLeft: '60px'}}>
                                              <input id={'item-' + index + '-' + subindex + '-' + nestedIndex} onChange={(e) => this.changeLabel(e)} onClick={(e) => { this.selectIndex(e, 'item-' + index + '-' + subindex + '-' + nestedIndex); this.handleToggle() }} type='text' className='form-control m-input menuInput' value={nestedItem.title} />
                                              <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeNestedMenu(index, subindex, nestedIndex)}>
                                                <span>
                                                  <i className='fa fa-times-circle' />
                                                </span>
                                              </span>
                                            </div>
                                          )
                                        })
                                      }
                                      { subItem.submenu.length < 5 &&
                                        <div className='col-8 menuDiv' style={{paddingLeft: '60px', width: '482px'}}>
                                          <button className='addMenu'onClick={() => this.addNestedMenu(index, subindex)}>+ Add Nested Menu </button>
                                        </div>
                                      }
                                    </div>
                                  </div>
                                )
                              })
                            }
                              { item.submenu.length < 5 &&
                                <div className='col-8 menuDiv' style={{paddingLeft: '30px', width: '482px'}}>
                                  <button className='addMenu'onClick={() => this.addSubMenu(index)}>+ Add Sub Menu </button>
                                </div>
                              }
                            </div>
                          )
                        })
                     }
                      { this.state.menuItems.length === 1 &&
                        <div className='col-8 menuDiv' style={{marginLeft: '-15px', width: '498px'}}>
                          <button className='addMenu'onClick={this.addMenu}>+ Add Menu </button>
                        </div>
                      }
                      <div className='col-8 menuDiv' style={{marginLeft: '-15px', width: '498px'}}>
                        <input type='text' className='form-control m-input menuFix' value='Powered by KiboPush' readOnly />
                      </div>
                      <div className='col-12' style={{paddingTop: '30px', marginLeft: '-15px'}}>
                        <i className='flaticon-exclamation m--font-brand' />
                        <span style={{marginLeft: '5px'}}>
                          Only two more main menus can be added. Submenus are limited to 5.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit'>
                  <div style={{paddingTop: '20px', paddingBottom: '20px', marginLeft: '50px'}}>
                    <button className='btn btn-sm btn-primary' onClick={this.saveMenu} disabled={this.props.pages && this.props.pages.length < 1}>
                      Save Menu
                    </button>
                    <button className='btn btn-sm btn-primary' onClick={this.showPreview} style={{marginLeft: '15px'}}>
                      Preview
                    </button>
                    <button style={{marginLeft: '15px'}} className='btn btn-sm btn-secondary' onClick={this.removeMainMenu}>
                      Remove Main Menu
                    </button>
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
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    currentMenuItem: (state.menuInfo.currentMenuItem),
    user: (state.basicInfo.user),
    indexByPage: (state.menuInfo.menuitems)
    //  items: (state.menuInfo.menuitems)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    saveCurrentMenuItem: saveCurrentMenuItem,
    saveMenu: saveMenu,
    getIndexBypage: getIndexBypage,
    removeMenu: removeMenu
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu)
