import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Select from 'react-select'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { addMenuItem } from '../../redux/actions/menu.actions'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import Popover from 'react-simple-popover'

import { Link } from 'react-router'
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
      optionSelected: '',
      popoverHeight: '300px',
      itemMenus: [{
        label: 'First Menu',
        submenu: []
      }]
    }
    this.option1 = 'Add submenu'
    this.option2 = 'Reply with a message'
    this.option3 = 'Open website'
    this.pageChange = this.pageChange.bind(this)
    this.saveItem = this.saveItem.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onSelectItem = this.onSelectItem.bind(this)
    this.handleClose = this.handleClose.bind(this)
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
        myPages.push({value: page._id, label: page.pageName})
      })
      this.setState({pageOptions: myPages})
    }
  }
  handleOption (option) {
    console.log('option Selected: ', option)
    let popoverHeight = '300px'
    if (option === this.option2) {
      popoverHeight = '335px'
    } else if (option === this.option3) {
      popoverHeight = '365px'
    }
    this.setState({optionSelected: option, popoverHeight: popoverHeight})
    // this.setState({itemType: event.target.value})
    // console.log('item type', this.state.itemType)
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
    this.props.history.push({
      pathname: `/CreateMessage`,
      state: {pageId: this.state.pageValue, menuItemType: 'weblink', title: this.state.itemName}
    })
    this.props.addMenuItem({pageId: this.state.pageValue, menuItemType: this.state.itemType, title: this.state.itemName})
  }
  handleClose (e) {
    console.log('handleClose(e)')
    // console.log(document.getElementById('popover'))
    console.log(document.getElementById('popover').contains(e.target))
    let optionClicked = document.getElementById('popover').contains(document.getElementById(e.target.id))
    if (optionClicked) {
      return
    }
    this.setState({openPopover: false, popoverHeight: '300px', optionSelected: ''})
  }
  saveItem (event) {
    // console.log('event.target.', event.target.value)
    this.setState({itemName: event.target.value})
    console.log('this.state.itemName', this.state.itemName)
    //  this.props.addMenuItem({pageId: this.state.pageValue, menuItem: this.state.itemName, menuItemType: 'weblink'})
  }
  onSelectItem (e) {
    console.log('onSelectItem(e)')
    // this.setState({openPopover: !this.state.openPopover})
    this.setState({openPopover: !this.state.openPopover, itemselected: true, backgroundColor: '#f2f2f2', text: 'Menu Item'})
    // this.setState({openPopover: !this.state.openPopover})
  }
  addItem () {
    var temp = this.state.itemMenus

    if (temp.length >= 3) {
      return
    }

    temp.push({
      label: 'Menu Name',
      submenu: []
    })

    this.setState({itemMenus: temp})
  }

  popoverMouse (e) {
    console.log('mouse on popover')
  }
  render () {
    if (this.target) {
      console.log('this.target', this.target, this.refs[this.target])
    }
    console.log('popover', this.state.openPopover)

    let popup = <Popover
      style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, width: '300px', height: this.state.popoverHeight}}
      placement='right'
      target={this.refs['0-item']}
      show={this.state.openPopover}
      onHide={this.handleClose}
      mouseOver={this.popoverMouse.bind(this)}>
      <div id='popover'>
        <div className='ui-block-title' style={{marginBottom: '20px'}} >
          <h4>Edit Menu Item</h4>
        </div>
        <form id='menuForm' style={{marginBottom: '20px'}}>
          <h5>When Pressed:</h5>
          <div id='divOption1'>
            <label id='labelOption1' className='radio-inline'>
              <input id='option1' type='radio' checked={this.state.optionSelected === this.option1} name='menuOption' value='option1' onChange={() => this.handleOption(this.option1)} />
              {this.option1}
            </label>
          </div>
          <div id='divOption2'>
            <label id='labelOption2' className='radio-inline'>
              <input id='option2' type='radio' checked={this.state.optionSelected === this.option2} name='menuOption' value='option2' onChange={() => this.handleOption(this.option2)} />
              {this.option2}
            </label>
          </div>
          <div id='divOption3'>
            <label id='labelOption3' className='radio-inline'>
              <input id='option3' type='radio' checked={this.state.optionSelected === this.option3} name='menuOption' value='option3' onChange={() => this.handleOption(this.option3)} />
              {this.option3}
            </label>
          </div>
        </form>
        {this.state.optionSelected === this.option2 &&
        <div className='container'>

          <Link to='CreateMessage'>
            <div className='row'>
              <button style={{margin: 'auto', marginBottom: '20px', color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} className='btn btn-block'> + Create New Message </button>
            </div>
          </Link>
        </div>
    }
        {this.state.optionSelected === this.option3 &&
        <div className='container'>
          <div className='row'>
            <label><b>Website URL to open</b></label>
            <input style={{marginBottom: '20px'}} type='url' className='form-control' />
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
                  if (this.state.itemMenus[index + 1] || index === 2) {
                    return <li>
                      <div id={index} ref={index + '-item'} style={{paddingTop: '5px'}} className='align-center'>
                        <form className='form-inline'>
                          <div className='form-group'><input type='text' placeholder='Menu Item' value={itm.label} className='form-control' onChange={this.saveItem} onClick={() => { this.target = index + '-item'; this.onSelectItem(index) }} style={{width: '350px'}} /></div>
                        </form>
                        {popup}
                      </div>
                      <li style={{marginLeft: 50}}>
                        <div id={index} ref={index + '-sub-item'} style={{paddingTop: '5px'}} className='align-center' >
                          <form className='form-inline'>
                            <div className='form-group'><input type='text' placeholder='Menu Item' value={itm.label} onClick={() => { this.target = index + '-sub-item'; this.onSelectItem(index) }} className='form-control' onChange={this.saveItem} style={{width: '350px'}} /></div>
                          </form>
                          {popup}
                        </div>
                      </li>
                    </li>
                  } else {
                    return <li>
                      <div id={index} ref={index + '-item'} style={{paddingTop: '5px'}} className='align-center'>
                        <form className='form-inline'>
                          <div className='form-group'><input type='text' placeholder='Menu Item' value={itm.label} className='form-control' onChange={this.saveItem} onClick={() => { this.target = index + '-item'; this.onSelectItem(index) }} style={{width: '350px'}} /> <div onClick={this.addItem.bind(this)} style={{margin: 10}}><i className='fa fa-plus' aria-hidden='true' /></div></div>
                        </form>
                        {popup}
                      </div>
                      <li style={{marginLeft: 50}}>
                        <div id={index} ref={index + '-sub-item'} style={{paddingTop: '5px'}} className='align-center' >
                          <form className='form-inline'>
                            <div className='form-group'><input type='text' placeholder='Menu Item' value={itm.label} className='form-control' onClick={() => { this.target = index + '-sub-item'; this.onSelectItem(index) }} onChange={this.saveItem} style={{width: '350px'}} /></div>
                          </form>
                          {popup}
                        </div>
                      </li>
                    </li>
                  }
                })
              }

              <li><input style={{margin: 10}} type='text' readOnly value='Powered by KiboPush' className='form-control' style={{width: '350px'}} /></li>
              <p><b>Note: </b>Only three menu items can be added.</p>
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
    pages: (state.pagesInfo.pages)
    //  items: (state.menuInfo.menuitems)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList, addMenuItem: addMenuItem
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu)
