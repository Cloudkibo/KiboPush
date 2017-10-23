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
//  das
class Menu extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.state = {
      pageOptions: [],
      pageValue: '',
      itemlist: []
    }
    this.pageChange = this.pageChange.bind(this)
    this.saveItem = this.saveItem.bind(this)
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
        myPages.push({value: page.pageId, label: page.pageName})
      })
      this.setState({pageOptions: myPages})
    }
  }
  pageChange (val) {
    console.log('Selected: ' + JSON.stringify(val))
    if (val === null) {
      this.setState({pageValue: val})
      return
    }
    console.log('Page Value', val)
    this.setState({pageValue: val.value})
  }
  saveItem (event) {
    console.log('event.target.', event.target.value)
    var temp = []
    temp.push(event.target.value)
    this.setState({itemlist: temp})
    console.log('this.state.itemlist', this.state.itemlist)
    this.props.addMenuItem(event.target.value)
  }
  render () {
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
                <form className='form-inline'>
                  <div className='form-group'><input type='text' placeholder='+ Menu Item' className='form-control' onChange={this.saveItem} /></div>
                  <div className='form-group'><button className='btn btn-primary btn-sm' style={{marginLeft: '30px', marginTop: '10px'}}>Save</button></div></form>
              </li>
              <li>
                <form className='form-inline'>
                  <div className='form-group'><input type='text' placeholder='+ Menu Item' className='form-control' onChange={this.saveItem} /></div>
                  <div className='form-group'><button className='btn btn-primary btn-sm' style={{marginLeft: '30px', marginTop: '10px'}}>Save</button></div></form>
              </li>
              <li><input type='text' readOnly value='Powered by KiboPush' className='form-control' /></li>
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
