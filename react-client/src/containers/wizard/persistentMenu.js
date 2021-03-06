import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { saveCurrentMenuItem, saveMenu, getIndexBypage } from '../../redux/actions/menu.actions'
import Sidebar from './sidebar'
import Header from './header'
import { transformData, removeMenuPayload } from '../menu/utility'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'
import { registerAction } from '../../utility/socketio'
import { isWebURL } from './../../utility/utils'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import ViewScreen from '../menu/viewScreen'
import {getCurrentProduct} from '../../utility/utils'

class Menu extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.state = {
      openPopover: false,
      menuItems: [],
      selectPage: '',
      selectedIndex: 'menuPopoverWizard',
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
    this.messageDisplay = this.messageDisplay.bind(this)

    if (!this.props.currentMenuItem) {
      if (this.props.pages && this.props.pages.length > 0) {
        this.props.getIndexBypage(this.props.pages[0].pageId, this.handleIndexByPage)
      }
    }
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Persistent Menu`
    var compProp = this.props
    var self = this
    registerAction({
      event: 'menu_updated',
      action: function (data) {
        compProp.getIndexBypage(compProp.pages[0].pageId, self.handleIndexByPage)
      }
    })
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
    var tempItemMenus = []
    this.setState({
      menuItems: tempItemMenus
    })
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.pages && nextProps.pages.length > 0 && this.state.selectPage === '') {
      this.setState({selectPage: nextProps.pages[0]})
    }
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
      if(res.payload[0].jsonStructure[0].type) {
        this.setState({
          menuItems: res.payload[0].jsonStructure
        })
        for (var i = 0; i < this.props.pages.length; i++) {
          if (this.props.pages[i].pageId === res.payload.pageId) {
            this.setState({ selectPage: this.props.pages[i] })
          }
        }
      } else {
        this.setState({
          menuItems: []
        })
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
    else {
      this.msg.error('Please add at least one Main menu')
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

  messageDisplay () {
    if (this.state.menuItems.length === 0) {
        return 'Only two more main menus can be added.'
    } else if (this.state.menuItems.length === 1) {
      return 'Only one more main menu can be added.'
    } else {
      return 'No more main menus can be added.'
    }
  }

  addMenuElement () {
    let element = []
    for (let j = this.state.menuItems.length; j < 2; j++) {
     element.push(<div className='col-6 menuDiv m-input-icon m-input-icon--right'>
          <button className='addMenu'onClick={this.addMenu}>+ Add Menu </button>
          </div>)
    }
    return element
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
      <div style={{marginLeft: '-255px'}} className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div id='menuPopoverWizard' />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="preview" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Persistent Menu Preview
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <ViewScreen data={this.state.menuItems} page={this.state.selectPage.pageName} />
              </div>
            </div>
          </div>
        </div>
        <Popover placement='right-end' isOpen={this.state.openPopover} className='menuPopover' target={this.state.selectedIndex} toggle={this.handleToggle}>
          <PopoverHeader><strong>Edit Menu Item</strong></PopoverHeader>
          <PopoverBody>
            <h6>Choose an action for the menu item:</h6>
            <div className='radio-buttons' style={{marginLeft: '37px'}}>
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
              this.state.selectedRadio === 'openWebsite' &&
              <div style={{marginTop: '20px'}}>
                <label>Website URL to open</label>
                <input placeholder='Enter URL' style={{marginBottom: '20px'}} value={this.state.webUrl} onChange={this.setWebUrl} type='url' className='form-control' />
                <button onClick={this.saveWebUrl} className='btn btn-success pull-right' disabled={(this.state.disabledWebUrl)}> Done </button>
                <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc', marginBottom: '10px'}} onClick={this.handleToggle} className='btn pull-left'> Cancel </button>
              </div>
            }
          </PopoverBody>
        </Popover>
        <div className='m-content'>
          <div className='m-portlet m-portlet--full-height'>
            <div className='m-portlet__body m-portlet__body--no-padding'>
              <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                  <Sidebar history={this.props.history} step='5' stepNumber={getCurrentProduct() === 'KiboEngage' ? 5 : 4} user={this.props.user} />
                  <div className='col-md-9 col-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Step {getCurrentProduct() === 'KiboEngage' ? 5 : 4}: Persistent Menu
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        <div className='col-xl-8 order-2 order-xl-1' />
                        <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                        </div>
                      </div>
                      <div className='m-portlet__body'>
                        <div className='row align-items-center'>
                          <div className='col-xl-8 order-2 order-xl-1' />
                          <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                          </div>
                        </div>
                        <div className='form-group m-form__group row'>
                          <label style={{ fontWeight: 'normal' }}>This page will help you setup persistent menu for your page. Persistent Menu will help people discover and more easily access your functionality throughout the conversation. Here you can add just the website to open at the menu click. Later, you can set the message to be sent when a menu is tapped.</label>
                        </div>
                        <div className='form-group m-form__group row'>
                          <label className='col-3 col-form-label' style={{ textAlign: 'left' }}>Select a page</label>
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
                        <div className='row' style={{ display: 'block', marginTop: '40px', padding: '20px' }}>
                          <div className='container'>
                            {
                              this.state.menuItems.map((item, index) => {
                                return (
                                  <div key={index}>
                                    <div className='col-8 menuDiv m-input-icon m-input-icon--right' style={{ width: '466px' }}>
                                      <input id={'item-' + index} onClick={(e) => { this.selectIndex(e, 'item-' + index); this.handleToggle() }} type='text' className='form-control m-input menuInput' onChange={(e) => this.changeLabel(e)} value={item.title} />
                                      {this.state.menuItems.length > 1 &&
                                        <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeMenu(index)}>
                                          <span>
                                            <i className='fa fa-times-circle' />
                                          </span>
                                        </span>
                                      }
                                    </div>
                                  </div>
                                )
                              })
                            }
                            {
                              this.addMenuElement()
                            }
                            <div className='col-8 menuDiv' style={{ marginLeft: '-15px', width: '498px' }}>
                              <input type='text' className='form-control m-input menuFix' value='Powered by KiboPush' readOnly />
                            </div>
                            <div className='col-12' style={{ paddingTop: '30px', marginLeft: '-15px' }}>
                              <i className='flaticon-exclamation m--font-brand' />
                              <span style={{ marginLeft: '5px' }}>
                                {this.messageDisplay()}
                                </span>
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-lg-6 m--align-left' />
                          <div className='col-lg-6 m--align-right'>
                            <button className='btn btn-sm btn-primary' onClick={this.saveMenu} disabled={this.props.pages && this.props.pages.length < 1}>
                                Save Menu
                              </button>
                            <button className='btn btn-sm btn-primary' data-toggle="modal" data-target="#preview" onClick={this.showPreview} style={{marginLeft: '15px'}}>
                                Preview
                              </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                      <div className='m-form__actions'>
                        <div className='row'>
                          <div className='col-lg-6 m--align-left' >
                            <Link to={ getCurrentProduct() === 'KiboChat' ? '/welcomeMessageWizard' : '/autopostingWizard'} className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                              <span>
                                <i className='la la-arrow-left' />
                                <span>Back</span>&nbsp;&nbsp;
                              </span>
                            </Link>
                          </div>
                          <div className='col-lg-6 m--align-right'>
                            <Link to={getCurrentProduct() === 'KiboEngage' || getCurrentProduct() === 'KiboLite' || getCurrentProduct() === 'localhost' ? '/finish' : '/responseMethods'} className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                              <span>
                                <span>Next</span>&nbsp;&nbsp;
                                <i className='la la-arrow-right' />
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
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
    getIndexBypage: getIndexBypage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu)
