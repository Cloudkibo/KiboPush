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
      popoverHeight: '300px'
    }
    this.option1 = 'Add submenu'
    this.option2 = 'Reply with a message'
    this.option3 = 'Open website'
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
    this.setState({openPopover: false, popoverHeight: '300px', optionSelected: ''})
  }
  saveItem (event) {
    console.log('event.target.', event.target.value)
    this.setState({itemName: event.target.value})
    console.log('this.state.itemName', this.state.itemName)
    //  this.props.addMenuItem({pageId: this.state.pageValue, menuItem: this.state.itemName, menuItemType: 'weblink'})
  }
  onSelectItem () {
    this.setState({openPopover: !this.state.openPopover})
    // this.setState({itemselected: true, backgroundColor: '#f2f2f2', text: 'Menu Item'})
    // this.setState({openPopover: !this.state.openPopover})
  }
  render () {
    let popup = <Popover
      style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, width: '300px', height: this.state.popoverHeight}}
      placement='right'
      target={this.target}
      show={this.state.openPopover}
      onHide={this.handleClose} >
      <div className='ui-block-title' style={{marginBottom: '20px'}} >
        <h4>Edit Menu Item</h4>
      </div>
      <form style={{marginBottom: '20px'}}>
        <h5>When Pressed:</h5>
        <div>
          <label className='radio-inline'>
            <input type='radio' checked={this.state.optionSelected === this.option1} name='menuOption' value='option1' onChange={() => this.handleOption(this.option1)} />
            {this.option1}
          </label>
        </div>
        <div>
          <label className='radio-inline'>
            <input type='radio' checked={this.state.optionSelected === this.option2} name='menuOption' value='option2' onChange={() => this.handleOption(this.option2)} />
            {this.option2}
          </label>
        </div>
        <div>
          <label className='radio-inline'>
            <input type='radio' checked={this.state.optionSelected === this.option3} name='menuOption' value='option3' onChange={() => this.handleOption(this.option3)} />
            {this.option3}
          </label>
        </div>
      </form>
      {this.state.optionSelected === this.option2 &&
      <div className='container'>
        <div className='row'>
          <Link to='CreateMessage' className='pull-right'>
            <button style={{margin: 'auto', marginBottom: '20px', color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={() => this.goToCreateMessage()} className='btn btn-block'> + Create New Message </button>
          </Link>
        </div>
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
