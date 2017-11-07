import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Select from 'react-select'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { addMenuItem, fetchMenu, saveMenu } from '../../redux/actions/menu.actions'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import Popover from 'react-simple-popover'
import { transformData, getUrl } from './utility'
import { Link } from 'react-router'
import AlertContainer from 'react-alert'
//  import RadioGroup from 'react-radio'
//  import Checkbox from 'react-checkbox'
//  import {Checkbox, CheckboxGroup} from 'react-checkbox-group'

class Menu extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.state = {
      pageOptions: [],
      pageValue: '',
      itemName: '',
      itemType: '',
      itemselected: '',
      backgroundColor: '#ffffff',
      text: '+Add Menu Item',
      openPopover: false,
      itemMenus: [{
        title: 'First Menu',
        submenu: []
      }],
      indexClicked: '',
      level: '',
      optionSelected: ''

    }
    this.option1 = 'Add submenu'
    this.option2 = 'Reply with a message'
    this.option3 = 'Open website'

    this.target = ''
    this.clickIndex = ''
    this.pageChange = this.pageChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onSelectItem = this.onSelectItem.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.changeLabel = this.changeLabel.bind(this)
    this.removeItem = this.removeItem.bind(this)
    props.fetchMenu()
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.pages) {
      console.log('Got some pages', nextProps.pages)
      var myPages = []
      nextProps.pages.map((page) => {
        if (page.connected) {
          myPages.push({value: page._id, label: page.pageName})
        }
      })
      this.setState({pageOptions: myPages})
    }
  }
  handleOption (option) {
    console.log('option selected: ', option)
    this.setState({optionSelected: option})
    if (option === 'Add submenu') {
      this.setState({itemType: 'submenu'})
    } else if (option === 'Reply with a message') {
      this.setState({itemType: 'reply'})
    } else if (option === 'Open website') {
      this.setState({itemType: 'weblink'})
    }
  }

  addSubmenu () {
    var temp = this.state.itemMenus
    console.log('Target', this.target)
    if (this.target === this.state.indexClicked + '-item') {
      if (temp[this.state.indexClicked].submenu.length >= 5) {
        this.msg.error('Sorry you can add more than 5 submenus')
        return
      }
      temp[this.state.indexClicked].submenu.push({
        title: 'Sub Menu',
        submenu: []
      })
    }
    if (this.target === this.subIndex + '-sub-item') {
      if (temp[this.state.indexClicked].submenu[this.subIndex].submenu.length >= 5) {
        this.msg.error('Sorry you can add more than 5 nested menus')
        return
      }
      temp[this.state.indexClicked].submenu[this.subIndex].submenu.push({
        title: 'Nested Menu'
      })
    }
    this.setState({itemMenus: temp})
  }

  pageChange (val) {
    console.log('Selected: ' + JSON.stringify(val))
    if (val === null) {
      this.setState({pageValue: val})
      return
    }
    console.log('Page Value', val)
    console.log('Page Value', val)
    this.setState({pageValue: val.value})
  }
  handleClick (event) {
    console.log('Handle Click Was Called')
    // this.props.history.push({
    //   pathname: `/CreateMessage`,
    //   state: {pageId: this.state.pageValue, menuItemType: this.state.itemType, title: this.state.itemName}
    // })
    // this.props.addMenuItem({pageId: this.state.pageValue, menuItemType: this.state.itemType, title: this.state.itemName})
    this.setState({openPopover: false})
  }
  handleClose (e) {
    console.log('handleClose', e)
    if (e.target.id === 'popover' ||
        document.getElementById('popover').contains(document.getElementById(e.target.id))) {
      return
    }
    this.setState({openPopover: false})
  }
  onSelectItem (index) {
    this.setState({indexClicked: index})
    this.setState({openPopover: !this.state.openPopover})
    this.setState({itemselected: true, backgroundColor: '#f2f2f2', text: 'Menu Item'})
    this.setState({openPopover: !this.state.openPopover})
  }
  addItem () {
    var temp = this.state.itemMenus
    if (temp.length >= 3) {
      return
    }
    temp.push({
      title: 'Menu Name',
      submenu: []
    })
    this.setState({itemMenus: temp})
  }

  changeLabel (event, type, indexObject) {
    var temp = this.state.itemMenus
    console.log('Type is: ', type)
    switch (type) {
      case 'item':
        temp[indexObject.itemIndex].title = event.target.value
        break
      case 'submenu':
        console.log('SubMenu CHanged')
        temp[indexObject.itemIndex].submenu[indexObject.subIndex].title = event.target.value
        break
      case 'nested':
        temp[indexObject.itemIndex].submenu[indexObject.subIndex].submenu[indexObject.nestedIndex].title = event.target.value
        break
      default:
        break
    }
    this.setState({itemMenus: temp})
  }

  removeItem (type, indexObject) {
    console.log('Remove Item', type)
    var temp = this.state.itemMenus
    switch (type) {
      case 'item':
        if (temp.length <= 1) return
        temp = temp.filter(function (x, i) {
          return i !== indexObject.itemIndex
        })
        break
      case 'submenu':
        temp[indexObject.itemIndex].submenu = temp[indexObject.itemIndex].submenu.filter(function (x, i) {
          return i !== indexObject.subIndex
        })
        break
      case 'nested':
        temp[indexObject.itemIndex].submenu[indexObject.subIndex].submenu = temp[indexObject.itemIndex].submenu[indexObject.subIndex].submenu.filter(function (x, i) {
          return i !== indexObject.nestedIndex
        })
        break
      default:
        break
    }

    this.setState({itemMenus: temp})
  }

  setUrl (event) {
    console.log('In setUrl ', event.target.value, this.clickIndex)
    var temp = this.state.itemMenus
    var index = this.clickIndex.split('-')
    switch (index[0]) {
      case 'item':
        console.log('An Item was Clicked position ', index[1])
        temp[index[1]].type = 'web_url'
        temp[index[1]].url = event.target.value
        break
      case 'submenu':
        console.log('A Submenu was Clicked position ', index[1], index[2])
        temp[index[1]].submenu[index[2]].type = 'web_url'
        temp[index[1]].submenu[index[2]].url = event.target.value
        break
      case 'nested':
        console.log('A Nested was Clicked position ', index[1], index[2], index[3])
        temp[index[1]].submenu[index[2]].submenu[index[3]].type = 'web_url'
        temp[index[1]].submenu[index[2]].submenu[index[3]].url = event.target.value
        break

      default:
        console.log('In switch', index[0])
        break
    }

    this.setState({itemMenus: temp})
  }

  save(){
    data = {}
    data.payload = transformData(this.state.itemMenus)
    data.pageId = ''
    data.userId = this.props.user._id
    this.props.saveMenu(data)
  }

  render () {
    console.log('This transform data', transformData(this.state.itemMenus))
    console.log('Target Value: ', this.target, this.target.includes('nested'))

    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    let popup = <Popover
      id='popup'
      style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, width: '300px', height: '400px'}}
      placement='right'
      target={this.refs[this.clickIndex]}
      show={this.state.openPopover}
      onHide={this.handleClose} >
      <div id='popover'>
        <div id='popover-title' className='ui-block-title' style={{marginBottom: '20px'}} >
          <h4 id='popover-heading1' >Edit Menu Item</h4>
        </div>
        <form id='popover-form' style={{marginBottom: '20px'}}>
          <h5 id='popover-heading2' >When Pressed:</h5>
        </form>
        {
          (!this.target.includes('nested')) ? <div id='popover-option1' className='container'>
            <div className='row'>
              <button id='popover-option1-button' style={{margin: 'auto', marginBottom: '20px', color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} className='btn btn-block' onClick={() => this.addSubmenu()}> Add Submenu </button>
            </div>
          </div> : ''
        }

        <div id='popover-option2' className='container'>
          <Link to='CreateMessage'>
            <div className='row'>
              <button style={{margin: 'auto', marginBottom: '20px', color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} className='btn btn-block'>+ Create New Message</button>
            </div>
          </Link>
        </div>
        {
          !getUrl(this.state.itemMenus, this.clickIndex).nested && <div id='popover-option3' className='container'>
            <div id='popover-option3-row' className='row'>
              <label id='popover-website-label'><b id='popover-bold'>Website URL to open</b></label>
              <input id='popover-website-input' style={{marginBottom: '20px'}} placeholder={getUrl(this.state.itemMenus, this.clickIndex).placeholder} onChange={this.setUrl.bind(this)} type='url' className='form-control' />
            </div>
          </div>
        }

        <button onClick={this.handleClick} className='btn btn-primary btn-sm pull-right'> Done </button>
        <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
      </div>
    </Popover>
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
        <div className='container'>
          <br /><br /><br /><br />
          <div className='ui-block'>
            <Link to='createMessage' className='pull-right'>
              <button className='btn btn-sm btn-primary'>
              SEND MESSAGE
              </button>
            </Link>

            <div className='ui-block-title'>
              <h5>Select a page to setup its Main Menu</h5>
            </div>
            <div className='ui-block-title'>
              <Select
                name='pageSelect'
                options={this.state.pageOptions}
                onChange={this.pageChange}
                placeholder='Select Page'
                value={this.state.pageValue}
                />
            </div>
            <br />
            <h4 style={{paddingLeft: '22px'}}>Edit Menu</h4>
            <ul style={{paddingLeft: '20px', width: '30%'}}>
              {
                this.state.itemMenus.map((itm, index) => {
                  // This condition limits the number of main menu to three items only
                  if (this.state.itemMenus[index + 1] || index === 2) {
                    return (<li>
                      <div ref={'item-' + index} style={{paddingTop: '5px'}} className='align-center'>
                        <form className='form-inline'>
                          <div className='form-group'><input type='text' onChange={(e) => this.changeLabel(e, 'item', {itemIndex: index})}
                            placeholder={itm.title} className='form-control'
                            onClick={() => { this.target = index + '-item'; this.clickIndex = 'item-' + index; this.onSelectItem(index) }} style={{width: '350px'}} />
                            <div onClick={() => this.removeItem('item', {itemIndex: index})} style={{margin: 10}}><i className='fa fa-times' aria-hidden='true' /></div>
                          </div>
                        </form>
                        {popup}
                      </div>
                      {itm.submenu.map((sub, subindex) => {
                        return <div style={{marginLeft: 50}}>
                          <div ref={'submenu-' + index + '-' + subindex} style={{paddingTop: '5px'}} className='align-center' >
                            <form className='form-inline'>
                              <div className='form-group'><input type='text' onChange={(e) => this.changeLabel(e, 'submenu', {itemIndex: index, subIndex: subindex})} placeholder={sub.title}
                                onClick={() => { this.target = subindex + '-sub-item'; this.clickIndex = 'submenu-' + index + '-' + subindex; this.subIndex = subindex; this.onSelectItem(index) }}
                                className='form-control' style={{width: '350px'}} />
                                <div onClick={() => this.removeItem('submenu', {itemIndex: index, subIndex: subindex})} style={{margin: 10}}><i className='fa fa-times' aria-hidden='true' /></div>
                              </div>
                            </form>
                            {popup}
                          </div>

                          { sub.submenu.map((nested, nestedindex) => {
                            return <div style={{marginLeft: 50}}>
                              <div ref={'nested-' + index + '-' + subindex + '-' + nestedindex} style={{paddingTop: '5px'}} className='align-center' >
                                <form className='form-inline'>
                                  <div className='form-group'><input type='text' onChange={(e) => this.changeLabel(e, 'nested', {itemIndex: index, subIndex: subindex, nestedIndex: nestedindex})} placeholder={nested.title} className='form-control'
                                    onClick={() => { this.target = nestedindex + '-nested-item'; this.clickIndex = 'nested-' + index + '-' + subindex + '-' + nestedindex; this.subIndex = subindex; this.onSelectItem(index) }} style={{width: '350px'}} />
                                    <div onClick={() => this.removeItem('nested', {itemIndex: index, subIndex: subindex, nestedIndex: nestedindex})} style={{margin: 10}}><i className='fa fa-times' aria-hidden='true' /></div>
                                  </div>
                                </form>
                                {popup}
                              </div>
                            </div>
                          })}
                        </div>
                      })}

                    </li>)
                  } else {
                    return <li>
                      <div ref={'item-' + index} style={{paddingTop: '5px'}} className='align-center'>
                        <form className='form-inline'>
                          <div className='form-group'><input type='text' onChange={(e) => this.changeLabel(e, 'item', {itemIndex: index})}
                            placeholder={itm.title} className='form-control'
                            onClick={() => { this.target = index + '-item'; this.clickIndex = 'item-' + index; this.onSelectItem(index) }} style={{width: '350px'}} />
                            <div onClick={this.addItem.bind(this)} style={{margin: 10}}><i className='fa fa-plus' aria-hidden='true' /></div>
                            <div onClick={() => this.removeItem('item', {itemIndex: index})} style={{margin: 10}}><i className='fa fa-times' aria-hidden='true' /></div>
                          </div>
                        </form>
                        {popup}
                      </div>

                      { itm.submenu.map((sub, subindex) => {
                        return <div style={{marginLeft: 50}}>
                          <div ref={'submenu-' + index + '-' + subindex} style={{paddingTop: '5px'}} className='align-center' >
                            <form className='form-inline'>
                              <div className='form-group'><input type='text' onChange={(e) => this.changeLabel(e, 'submenu', {itemIndex: index, subIndex: subindex})}
                                placeholder={sub.title} className='form-control'
                                onClick={() => { this.target = subindex + '-sub-item'; this.clickIndex = 'submenu-' + index + '-' + subindex; this.subIndex = subindex; this.onSelectItem(index) }}
                                style={{width: '350px'}} />
                                <div onClick={() => this.removeItem('submenu', {itemIndex: index, subIndex: subindex})} style={{margin: 10}}><i className='fa fa-times' aria-hidden='true' /></div>
                              </div>
                            </form>
                            {popup}
                          </div>
                          { sub.submenu.map((nested, nestedindex) => {
                            return <div style={{marginLeft: 50}}>
                              <div ref={'nested-' + index + '-' + subindex + '-' + nestedindex} style={{paddingTop: '5px'}} className='align-center' >
                                <form className='form-inline'>
                                  <div className='form-group'><input type='text' onChange={(e) => this.changeLabel(e, 'nested', {itemIndex: index, subIndex: subindex, nestedIndex: nestedindex})} placeholder={nested.title}
                                    className='form-control' onClick={() => { this.target = nestedindex + '-nested-item'; this.clickIndex = 'nested-' + index + '-' + subindex + '-' + nestedindex; this.subIndex = subindex; this.onSelectItem(index) }} style={{width: '350px'}} />
                                    <div onClick={() => this.removeItem('nested', {itemIndex: index, subIndex: subindex, nestedIndex: nestedindex})} style={{margin: 10}}><i className='fa fa-times' aria-hidden='true' /></div>
                                  </div>
                                </form>
                                {popup}
                              </div>
                            </div>
                          })}
                        </div>
                      })}
                    </li>
                  }
                })
              }
              <li><input style={{margin: 10, width: '350px'}} type='text' readOnly value='Powered by KiboPush' className='form-control' /></li>
              <p><b>Note: </b>Only three menu items can be added.</p>
              <button onClick={this.save.bind(this)} className='btn btn-sm btn-primary pull-right'>
                Save Menu
              </button>
            </ul>
          </div>
        </div>
      </div>

    )
  }
}
function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user)
    //  items: (state.menuInfo.menuitems)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    addMenuItem: addMenuItem,
    fetchMenu: fetchMenu,
    saveMenu: saveMenu,
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu)
