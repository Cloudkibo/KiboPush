import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { Link } from 'react-router'
import AlertContainer from 'react-alert'
import { registerAction } from '../../utility/socketio'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'

class Menu extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.state = {
      openPopover: false,
      menuItems: [{
        title: 'Menu Item',
        submenu: [{
          title: 'Sub Menu',
          nestedMenu: [{
            title: 'Nested Menu'
          }]
        }]
      }],
      selectPage: {},
      selectedIndex: 'item-0'
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
  }

  componentDidMount () {
    document.title = 'KiboPush | Menu'
    this.selectPage()
    var compProp = this.props
    var self = this
    registerAction({
      event: 'menu_updated',
      action: function (data) {
        compProp.getIndexBypage(compProp.pages[0].pageId, self.handleIndexByPage)
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.pages) {
      // write logic to select page
    }
  }
  selectIndex (e, index) {
    this.setState({
      selectedIndex: index
    })
    console.log('Selected Index', this.state.selectedIndex)
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
  addSubMenu (index) {
    var menuItems = this.state.menuItems
    var newSubmenu = {
      title: 'Sub Menu',
      nestedMenu: []
    }
    for (let i = 0; i < menuItems.length; i++) {
      if (i === index) {
        var submenu = menuItems[i].submenu
        submenu.push(newSubmenu)
      }
    }
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
    this.setState({
      menuItems: menuItems
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
  addNestedMenu (index, subIndex) {
    var menuItems = this.state.menuItems
    var newNestedMenu = {
      title: 'Nested Menu',
      nestedMenu: []
    }
    menuItems[index].submenu[subIndex].nestedMenu.push(newNestedMenu)
    this.setState({
      menuItems: this.state.menuItems
    })
  }
  removeNestedMenu (index, subIndex, nestedIndex) {
    var nestedItems = []
    for (let i = 0; i < this.state.menuItems[index].submenu[subIndex].nestedMenu.length; i++) {
      if (subIndex !== i) {
        nestedItems.push(this.state.menuItems[index].submenu[subIndex].nestedMenu[i])
      }
    }

    var menuItems = this.state.menuItems
    menuItems[index].submenu[subIndex].nestedMenu = nestedItems
    this.setState({
      menuItems: menuItems
    })
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
        <Popover placement='right-end' isOpen={this.state.openPopover} className='buttonPopover' target={this.state.selectedIndex} toggle={this.handleToggle}>
          <PopoverHeader><strong>Add Button</strong></PopoverHeader>
          <PopoverBody>
            <div>
              PopoverBody
            </div>
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
                  <div className='row'>
                    <label className='col-3 col-form-label' style={{textAlign: 'left'}}>Select a page</label>
                    <div className='col-8 input-group'>
                      <select className='form-control m-input' value={this.state.pageValue} onChange={this.pageChange}>
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
                            <div>
                              <div className='col-6 menuDiv m-input-icon m-input-icon--right'>
                                <input id={'item-' + index} onClick={(e) => { this.selectIndex(e, 'item-' + index); this.handleToggle() }} type='text' className='form-control m-input menuInput' value={item.title} />
                                <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeMenu(index)}>
                                  <span>
                                    <i className='fa fa-times-circle' />
                                  </span>
                                </span>
                              </div>
                              {item.submenu.map((subItem, subindex) => {
                                return (
                                  <div>
                                    <div className='col-6 menuDiv m-input-icon m-input-icon--right' style={{paddingLeft: '30px'}}>
                                      <input id={'item-' + index + '-' + subindex} onClick={(e) => { this.selectIndex(e, 'item-' + index + '-' + subindex); this.handleToggle() }} type='text' className='form-control m-input menuInput' value={subItem.title} />
                                      <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeSubMenu(index, subindex)}>
                                        <span>
                                          <i className='fa fa-times-circle' />
                                        </span>
                                      </span>
                                    </div>
                                    {
                                      subItem.nestedMenu.map((nestedItem, nestedIndex) => {
                                        return (
                                          <div className='col-6 menuDiv m-input-icon m-input-icon--right' style={{paddingLeft: '60px'}}>
                                            <input id={'item-' + index + '-' + subindex + '-' + nestedIndex} onClick={(e) => { this.selectIndex(e, 'item-' + index + '-' + subindex + '-' + nestedIndex); this.handleToggle() }} type='text' className='form-control m-input menuInput' value={nestedItem.title} />
                                            <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeNestedMenu(index, subindex, nestedIndex)}>
                                              <span>
                                                <i className='fa fa-times-circle' />
                                              </span>
                                            </span>
                                          </div>
                                        )
                                      })
                                    }
                                    { subItem.nestedMenu.length < 5 &&
                                      <div className='col-8 menuDiv' style={{paddingLeft: '60px', width: '482px'}}>
                                        <button className='addMenu'onClick={() => this.addNestedMenu(index, subindex)}>+ Add Nested Menu </button>
                                      </div>
                                    }
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
                        <input type='text' className='form-control m-input menuFix' value='Powered by KiboPush' />
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
    pages: (state.pagesInfo.pages)
    //  items: (state.menuInfo.menuitems)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu)
