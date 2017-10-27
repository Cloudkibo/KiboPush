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
      openPopover: false

    }
    this.pageChange = this.pageChange.bind(this)
    this.saveItem = this.saveItem.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onSelectItem = this.onSelectItem.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleCheckbox = this.handleClose.bind(this)
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
  handleCheckbox (event) {
    console.log('checkbox Selected: ', event.target.value)
    this.setState({itemType: event.target.value})
    console.log('item type', this.state.itemType)
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
    this.props.addMenuItem({pageId: this.state.pageValue, menuItemType: this.state.itemType, title: this.state.itemName})
  }
  handleClose (e) {
    this.setState({openPopover: false})
  }
  saveItem (event) {
    console.log('event.target.', event.target.value)
    this.setState({itemName: event.target.value})
    console.log('this.state.itemName', this.state.itemName)
    //  this.props.addMenuItem({pageId: this.state.pageValue, menuItem: this.state.itemName, menuItemType: 'weblink'})
  }
  onSelectItem () {
    this.setState({openPopover: !this.state.openPopover})
    this.setState({itemselected: true, backgroundColor: '#f2f2f2', text: 'Menu Item'})
    this.setState({openPopover: !this.state.openPopover})
  }
  render () {
    let popup = <Popover
      style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, width: '300px', height: '250px'}}
      placement='right'
      target={this.target}
      show={this.state.openPopover}
      onHide={this.handleClose} >
      <div className='ui-block-title'>
        <p><b>When Pressed:</b></p>
      </div>
      <form>
        <div className='checkbox'>
          <label>
            <input type='checkbox' value='option1' onClick={this.handleCheckbox} />
            Open submenu
          </label>
        </div>
        <div className='checkbox'>
          <label>
            <input type='checkbox' value='option2' />
            Reply with a message
          </label>
        </div>
        <div className='checkbox'>
          <label>
            <input type='checkbox' value='option2' />
            Open website
          </label>
        </div>
      </form>
      <button onClick={this.handleClick} className='btn btn-primary btn-sm pull-right'> Done </button>
      <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
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
              <li>
                <div id='target' ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
                  <form className='form-inline'>
                    <div className='form-group'><input type='text' placeholder={this.state.text} className='form-control' style={{backgroundColor: this.state.backgroundColor, width: '350px'}} onChange={this.saveItem} onClick={() => this.onSelectItem()} /></div>
                  </form>
                  {popup}
                </div>
              </li>
              { this.state.itemselected !== '' &&
                <li>
                  <div id='target' ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
                    <form className='form-inline'>
                      <div className='form-group'><input type='text' placeholder='+ Add Menu Item' value='' className='form-control' onChange={this.saveItem} onClick={() => this.onSelectItem()} style={{width: '350px'}} /></div>
                    </form>
                    {popup}
                  </div>
                </li>
              }
              <li><input type='text' readOnly value='Powered by KiboPush' className='form-control' style={{width: '350px'}} /></li>
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
