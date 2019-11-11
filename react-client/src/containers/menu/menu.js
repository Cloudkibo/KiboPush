import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { addMenuItem, fetchMenu, saveMenu, getIndexBypage, saveCurrentMenuItem, removeMenu } from '../../redux/actions/menu.actions'
import Popover from 'react-simple-popover'
import { transformData, getUrl, removeMenuPayload } from './utility'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'
import { isWebURL } from './../../utility/utils'
import YouTube from 'react-youtube'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import ViewScreen from './viewScreen'
import { registerAction } from '../../utility/socketio'
import AlertMessage from '../../components/alertMessages/alertMessage'

class Menu extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.state = {
      pageOptions: [],
      setWebUrl: false,
      pageValue: '',
      pageName: '',
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
      optionSelected: '',
      disabled: true,
      savedisabled: true,
      selecteditem: null,
      isShowingModal: false,
      showVideo: true
    }

    this.option1 = 'Add submenu'
    this.option2 = 'Reply with a message'
    this.option3 = 'Open website'

    this.target = ''
    this.clickIndex = ''
    this.clickedValue = ''
    this.pageChange = this.pageChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onSelectItem = this.onSelectItem.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.changeLabel = this.changeLabel.bind(this)
    this.removeItem = this.removeItem.bind(this)
    this.setCreateMessage = this.setCreateMessage.bind(this)
    this.handleIndexByPage = this.handleIndexByPage.bind(this)
    this.initializeItemMenus = this.initializeItemMenus.bind(this)
    this.handleSaveMenu = this.handleSaveMenu.bind(this)
    this.getItemClicked = this.getItemClicked.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.reset = this.reset.bind(this)
    this.handleReset = this.handleReset.bind(this)
    props.fetchMenu()
    if (!(this.props.currentMenuItem && this.props.currentMenuItem.itemMenus) && this.props.pages && this.props.pages.length > 0) {
      props.getIndexBypage(this.props.pages[0].pageId, this.handleIndexByPage)
    }
  }

  componentDidMount () {
    document.title = 'KiboPush | Menu'

    var compProp = this.props
    var self = this
    registerAction({
      event: 'menu_updated',
      action: function (data) {
        compProp.getIndexBypage(compProp.pages[0].pageId, self.handleIndexByPage)
      }
    })
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }
  closeDialog () {
    this.setState({isShowingModal: false})
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.pages) {
      var myPages = []
      nextProps.pages.map((page) => {
        if (page.connected) {
          myPages.push({value: page.pageId, label: page.pageName})
        }
      })
      this.setState({pageOptions: myPages})
      if (this.state.pageValue === '') {
        this.setState({ pageValue: nextProps.pages[0].pageId, pageName: nextProps.pages[0].pageName })
      }
      if (nextProps.currentMenuItem && nextProps.currentMenuItem.itemMenus) {
        this.setState({itemMenus: nextProps.currentMenuItem.itemMenus})
        this.setState({pageValue: nextProps.currentMenuItem.currentPage})
        this.clickedIndex = nextProps.currentMenuItem.clickedIndex
        this.setState({savedisabled: false})
      }
    }
    if (nextProps.successMessage) {
    } else if (nextProps.errorMessage) {
    }
  }

  handleOption (option) {
    this.setState({optionSelected: option})
    if (option === 'Add submenu') {
      this.setState({itemType: 'submenu'})
    } else if (option === 'Reply with a message') {
      this.setState({itemType: 'reply'})
    } else if (option === 'Open website') {
      this.setState({itemType: 'weblink'})
    }
  }
  initializeItemMenus () {
    var tempItemMenus = [{
      title: 'First Menu',
      submenu: []
    }]
    this.setState({
      itemMenus: tempItemMenus
    })
  }
  handleIndexByPage () {
    if (this.props.indexByPage && this.props.indexByPage.length > 0) {
      this.setState({itemMenus: this.props.indexByPage[0].jsonStructure})
    } else {
      this.initializeItemMenus()
    }
  }
  setCreateMessage (event) {
    var temp = this.state.itemMenus
    var index = this.clickIndex.split('-')
    var payload = []
    switch (index[0]) {
      case 'item':
        //  console.log('An Item was Clicked position ', index[1])
        if (temp[index[1]].payload && temp[index[1]].payload !== '') {
          payload = temp[index[1]].payload
        }
        if (temp[index[1]].url) {
          delete temp[index[1]].url
        }
        temp[index[1]].type = 'postback'
        temp[index[1]].title = this.clickedValue
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
        temp[index[1]].submenu[index[2]].title = this.clickedValue
        temp[index[1]].submenu[index[2]].payload = payload
        break
      case 'nested':
        //  console.log('A Nested was Clicked position ', index[1], index[2], index[3])
        if (temp[index[1]].submenu[index[2]].submenu[index[3]].payload && temp[index[1]].submenu[index[2]].submenu[index[3]].payload !== '') {
          payload = temp[index[1]].submenu[index[2]].submenu[index[3]].payload
        }
        if (temp[index[1]].submenu[index[2]].submenu[index[3]].url) {
          delete temp[index[1]].submenu[index[2]].submenu[index[3]].url
        }

        temp[index[1]].submenu[index[2]].submenu[index[3]].type = 'postback'
        temp[index[1]].submenu[index[2]].submenu[index[3]].title = this.clickedValue
        temp[index[1]].submenu[index[2]].submenu[index[3]].payload = payload
        break

      default:
        break
    }

    this.setState({itemMenus: temp})
    var currentState = { itemMenus: this.state.itemMenus, clickedIndex: this.clickIndex, currentPage: this.state.pageValue }
    this.props.saveCurrentMenuItem(currentState)
  }
  addSubmenu () {
    this.setState({openPopover: false})
    var temp = this.state.itemMenus
    if (this.target === this.state.indexClicked + '-item') {
      if (temp[this.state.indexClicked].submenu.length >= 5) {
        this.msg.error('Sorry you can add more than 5 submenus')
        return
      }
      if (temp[this.state.indexClicked].payload) {
        delete temp[this.state.indexClicked].payload
      }
      if (temp[this.state.indexClicked].url) {
        delete temp[this.state.indexClicked].url
      }
      temp[this.state.indexClicked].type = 'nested'
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
      if (temp[this.state.indexClicked].submenu[this.subIndex].payload) {
        delete temp[this.state.indexClicked].submenu[this.subIndex].payload
      }
      if (temp[this.state.indexClicked].submenu[this.subIndex].url) {
        delete temp[this.state.indexClicked].submenu[this.subIndex].url
      }
      temp[this.state.indexClicked].submenu[this.subIndex].type = 'nested'
      temp[this.state.indexClicked].submenu[this.subIndex].submenu.push({
        title: 'Nested Menu'
      })
    }
    this.setState({itemMenus: temp})
  }
//  275303122985641
  pageChange (event) {
    if (event === null) {
      this.setState({pageValue: event})
      return
    }
    this.setState({pageValue: event.target.value, pageName: event.target.name})
    this.initializeItemMenus()
    this.props.saveCurrentMenuItem({})
    this.props.getIndexBypage(event.target.value, this.handleIndexByPage)
  }
  handleClick (event) {
    var currentState = { itemMenus: this.state.itemMenus, clickedIndex: this.clickIndex, currentPage: this.state.pageValue }
    this.props.saveCurrentMenuItem(currentState)
    // this.props.history.push({
    //   pathname: `/CreateMessage`,
    //   state: {pageId: this.state.pageValue, menuItemType: this.state.itemType, title: this.state.itemName}
    // })
    // this.props.addMenuItem({pageId: this.state.pageValue, menuItemType: this.state.itemType, title: this.state.itemName})
    this.setState({openPopover: false})
  }
  handleClose (e) {
    if (e.target.id === 'popover' ||
        document.getElementById('popover').contains(document.getElementById(e.target.id))) {
      return
    }
    this.setState({openPopover: false, setWebUrl: false})
  }
  onSelectItem (e, index) {
    this.clickedValue = e.target.value
    this.setState({indexClicked: index})
    this.setState({openPopover: !this.state.openPopover})
    this.setState({itemselected: true, backgroundColor: '#f2f2f2', text: 'Menu Item'})
    this.setState({openPopover: !this.state.openPopover, setWebUrl: false})
    var selecteditem = this.getItemClicked()
    this.setState({selecteditem: selecteditem})
  }
  addItem () {
    var temp = this.state.itemMenus
    if (temp.length >= 3) {
      return
    }
    temp.push({
      title: 'Second Menu',
      submenu: []
    })
    this.setState({itemMenus: temp})
  }

  changeLabel (event, type, indexObject) {
    var temp = this.state.itemMenus
    this.clickedValue = event.target.value
    switch (type) {
      case 'item':
        temp[indexObject.itemIndex].title = event.target.value
        break
      case 'submenu':
        temp[indexObject.itemIndex].submenu[indexObject.subIndex].title = event.target.value
        break
      case 'nested':
        temp[indexObject.itemIndex].submenu[indexObject.subIndex].submenu[indexObject.nestedIndex].title = event.target.value
        break
      default:
        break
    }
    this.setState({itemMenus: temp})
    var currentState = { itemMenus: temp, clickedIndex: this.clickIndex, currentPage: this.state.pageValue }
    this.props.saveCurrentMenuItem(currentState)
  }

  removeItem (type, indexObject) {
    var temp = { itemMenus: this.state.itemMenus, clickedIndex: this.clickIndex, currentPage: this.state.pageValue }
    switch (type) {
      case 'item':
        if (temp.itemMenus.length <= 1) {
          temp = { itemMenus: [{title: 'First Menu', submenu: []}], clickedIndex: this.clickIndex, currentPage: this.state.pageValue }
          break
        }
        temp.itemMenus = temp.itemMenus.filter(function (x, i) {
          return i !== indexObject.itemIndex
        })
        break
      case 'submenu':
        temp.itemMenus[indexObject.itemIndex].submenu = temp.itemMenus[indexObject.itemIndex].submenu.filter(function (x, i) {
          return i !== indexObject.subIndex
        })
        break
      case 'nested':
        temp.itemMenus[indexObject.itemIndex].submenu[indexObject.subIndex].submenu = temp.itemMenus[indexObject.itemIndex].submenu[indexObject.subIndex].submenu.filter(function (x, i) {
          return i !== indexObject.nestedIndex
        })
        break
      default:
        break
    }
    this.setState({itemMenus: temp.itemMenus})
    var currentState = { itemMenus: temp.itemMenus, clickedIndex: this.clickIndex, currentPage: this.state.pageValue }
    this.props.saveCurrentMenuItem(currentState)
  }
  getItemClicked () {
    //  console.log('In get clicked Item ', this.clickIndex)
    var temp = this.state.itemMenus
    var index = this.clickIndex.split('-')
    switch (index[0]) {
      case 'item':
        //  console.log('An Item was Clicked position ', index[1])
        return temp[index[1]]
      case 'submenu':
        //  console.log('A Submenu was Clicked position ', index[1], index[2])
        return temp[index[1]].submenu[index[2]]
      case 'nested':
        //  console.log('A Nested was Clicked position ', index[1], index[2], index[3])
        return temp[index[1]].submenu[index[2]].submenu[index[3]]
      default:
        return null
    }
  }
  isSubmenu () {
    var index = this.clickIndex.split('-')
    var temp = this.state.itemMenus
    switch (index[0]) {
      case 'submenu':
        //  console.log('A Submenu was Clicked position ', index[1], index[2])
        return temp[index[1]].submenu[index[2]]
      default:
        return false
    }
  }
  isNested () {
    var index = this.clickIndex.split('-')
    switch (index[0]) {
      case 'nested':
        return true
      default:
        return false
    }
  }

  setUrl (event) {
    //  console.log('In setUrl ', event.target.value, 'in', this.clickIndex)
    var temp = this.state.itemMenus
    var index = this.clickIndex.split('-')
    if (isWebURL(event.target.value)) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    switch (index[0]) {
      case 'item':
        //  console.log('An Item was Clicked position ', index[1])
        if (temp[index[1]].payload) {
          delete temp[index[1]].payload
        }
        temp[index[1]].type = 'web_url'
        temp[index[1]].url = event.target.value
        break
      case 'submenu':
        //  console.log('A Submenu was Clicked position ', index[1], index[2])
        if (temp[index[1]].submenu[index[2]].payload) {
          delete temp[index[1]].submenu[index[2]].payload
        }
        temp[index[1]].submenu[index[2]].type = 'web_url'
        temp[index[1]].submenu[index[2]].url = event.target.value
        break
      case 'nested':
        //  console.log('A Nested was Clicked position ', index[1], index[2], index[3])
        if (temp[index[1]].submenu[index[2]].submenu[index[3]].payload) {
          delete temp[index[1]].submenu[index[2]].submenu[index[3]].payload
        }
        temp[index[1]].submenu[index[2]].submenu[index[3]].type = 'web_url'
        temp[index[1]].submenu[index[2]].submenu[index[3]].url = event.target.value
        break

      default:
        break
    }
    this.setState({itemMenus: temp})
  }
  handleReset () {
    this.props.getIndexBypage(this.state.pageValue, this.handleIndexByPage)
  }
  reset () {
    var data = {}
    data.payload = removeMenuPayload()
    data.pageId = this.state.pageValue
    data.userId = this.props.user._id
    var tempItemMenus = [{
      title: 'First Menu',
      submenu: []
    }]
    data.jsonStructure = tempItemMenus
    var currentState = { itemMenus: tempItemMenus, clickedIndex: this.clickIndex, currentPage: this.state.pageValue }
    this.props.saveCurrentMenuItem(currentState)
    this.props.removeMenu(data, this.handleReset, this.msg)
  }
  save () {
    if (this.props.currentMenuItem && this.props.currentMenuItem.itemMenus && this.props.currentMenuItem.itemMenus.length > 0) {
      for (var j = 0; j < this.props.currentMenuItem.itemMenus.length; j++) {
        if (!this.props.currentMenuItem.itemMenus[j].type && this.props.currentMenuItem.itemMenus[j].submenu.length === 0) {
          return this.msg.error('Please select the type of the menu')
        }
      }
      this.setState({
        itemMenus: this.props.currentMenuItem.itemMenus
      })
      var temp = []
      for (var k = 0; k < this.props.currentMenuItem.itemMenus.length; k++) {
        temp.push(this.props.currentMenuItem.itemMenus[k])
      }
      temp.push({url: 'www.kibopush.com', type: 'web_url', submenu: [], title: 'Powered by KiboPush'})
      var data = {}
      if (this.state.pageValue === '') {
        this.msg.error('Please select a page')
        return
      }
      data.payload = transformData(temp)
      data.pageId = this.state.pageValue
      data.userId = this.props.user._id
      data.jsonStructure = this.props.currentMenuItem.itemMenus
      this.props.saveMenu(data, this.handleSaveMenu, this.msg)
    } else {
      this.msg.error('Please select the type of the menu')
    }
  }
  handleSaveMenu () {
    this.props.getIndexBypage(this.state.pageValue, this.handleIndexByPage)
  }
  setWebUrl () {
    this.setState({setWebUrl: !this.state.setWebUrl})
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    let popup = <Popover
      style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25, width: '300px', height: '410px', marginTop: '40px'}}
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
          <p>Please select one of the following </p>
        </form>
        {
          (!this.target.includes('nested'))
          ? <div id='popover-option1' className='container'>
            <div className='row'>
              { this.isSubmenu()
              ? <button id='popover-option1-button' className='btn m-btn--pill btn-secondary' style={{width: '400px'}} onClick={() => this.addSubmenu()}> Add Nested Menu </button>
              : <button id='popover-option1-button' className='btn m-btn--pill btn-secondary' style={{width: '400px'}} onClick={() => this.addSubmenu()}> Add Sub Menu </button>
            }
            </div>
          </div> : ''
        }
        <br />
        {(this.getItemClicked() && this.getItemClicked().submenu && this.getItemClicked().submenu.length === 0) || this.isNested()
        ? <div id='popover-option2' className='container'>
          { (this.getItemClicked() && this.getItemClicked().payload && this.getItemClicked().payload.length > 0)
          ? <Link to='CreateMessage'>
            <div className='row'>
              <button onClick={(e) => { this.setCreateMessage(e) }} className='btn m-btn--pill btn-primary' style={{width: '400px'}}> Edit Message</button>
            </div>
          </Link>
          : <Link to='CreateMessage'>
            <div className='row'>
              <button onClick={(e) => { this.setCreateMessage(e) }} className='btn m-btn--pill btn-secondary' style={{width: '400px'}}>+ Create New Message</button>
            </div>
          </Link>
        }
        </div>
        : ''
        }
        <br />
        {
          getUrl(this.state.itemMenus, this.clickIndex) && !getUrl(this.state.itemMenus, this.clickIndex).nested &&
          <div className='container' id='popover-option3'>
            <div className='row'>
              { (this.getItemClicked() && this.getItemClicked().url && this.getItemClicked().url !== '')
              ? <button onClick={this.setWebUrl.bind(this)} id='popover-option3-button' className='btn m-btn--pill btn-primary' style={{width: '400px'}}>Set Web Url</button>
              : <button onClick={this.setWebUrl.bind(this)} id='popover-option3-button' className='btn m-btn--pill btn-secondary' style={{width: '400px'}}>Set Web Url</button>
              }
            </div>
            <br />
            {
              (this.state.setWebUrl) && <div id='popover-option3' className='container'>
                <div id='popover-option3-row' className='row'>
                  <label id='popover-website-label'><b id='popover-bold'>Website URL to open</b></label>
                  <input id='popover-website-input' placeholder='Enter URL' style={{marginBottom: '20px'}} value={getUrl(this.state.itemMenus, this.clickIndex).placeholder} onChange={this.setUrl.bind(this)} type='url' className='form-control' />
                </div>
                <button onClick={this.handleClick} className='btn btn-primary pull-right' disabled={(this.state.disabled)}> Done </button>
                <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
              </div>
            }

          </div>
        }
      </div>
    </Popover>
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {/* {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='2I7qnG03zVs'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                />
              </div>
            </ModalDialog>
          </ModalContainer>
        } */}
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
            <AlertMessage type='page' />
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Persistent Menu? Here is the <a href='http://kibopush.com/persistent-menu/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
            </div>
          </div>
          <div className='col-xl-12 col-md-12 col-lg-12 col-sm-12 col-xs-12'>
            <div className='m-portlet m-portlet--full-height '>
              <div className='m-portlet__head'>
                <div className='m-portlet__head-caption' style={{width: '400px'}}>
                  <div className='m-portlet__head-title'>
                    <h3 className='m-portlet__head-text'>Select a page to setup its Menu </h3>
                  </div>
                </div>
                <div className='m-portlet__head-tools'>
                  <ul className='nav nav-pills nav-pills--brand m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                    <li className='nav-item m-tabs__item'>
                      <select
                        className='custom-select'
                        placeholder='Select a page...'
                        onChange={this.pageChange}>
                        { this.props.pages.map((page, i) => (
                        (
                          page.connected &&
                          <option
                            value={page.pageId} name={page.pageName} key={page.pageId} selected={page.pageId === this.state.pageValue}>{page.pageName}</option>
                        )
                      ))
                      }
                      </select>
                    </li>
                    <li className='nav-item m-tabs__item' />
                    <li className='nav-item m-tabs__item' />
                  </ul>
                </div>
              </div>
              <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
              <div className='m-portlet__body'>
                <div className='row align-items-center'>
                  <div className='col-xl-8 order-2 order-xl-1' />
                  <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                    {/* {
                      this.state.isShowingModal &&
                      <ModalContainer style={{top: '100px'}}
                        onClose={this.closeDialog}>
                        <ModalDialog style={{top: '100px'}}
                          onClose={this.closeDialog}>
                          <h3>Persistent Menu Preview</h3>
                          { !(this.props.currentMenuItem && this.props.currentMenuItem.itemMenus) && this.props.pages && this.state.itemMenus
                              ? <div><ViewScreen data={this.state.itemMenus} page={this.state.pageName} /></div>
                            : <div><ViewScreen data={this.props.currentMenuItem.itemMenus} page={this.state.pageName} /></div>
                          }
                        </ModalDialog>
                      </ModalContainer>
                    } */}
                  </div>
                </div>
                <div className='tab-content'>
                  <h4 style={{paddingLeft: '22px'}}>Edit Menu</h4> <br /><br />
                  <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' style={{width: '30%'}}>
                    {
            this.state.itemMenus && this.state.itemMenus.map((itm, index) => {
              // This condition limits the number of main menu to three items only
              if (this.state.itemMenus[index + 1] || index === 1) {
                return (<li className='nav-item m-tabs__item'>
                  <div ref={'item-' + index} className='align-center' style={{marginTop: '-50px', marginLeft: '-11px'}}>
                    <form className='m-form m-form--fit m-form--label-align-right'>
                      <div className='m-portlet__body'>
                        <div className='form-group m-form__group'>
                          <div className='input-group m-input-group'>
                            <input type='text' onChange={(e) => this.changeLabel(e, 'item', {itemIndex: index})}
                              value={itm.title} className='form-control m-input'
                              onClick={(e) => { this.target = index + '-item'; this.clickIndex = 'item-' + index; this.onSelectItem(e, index) }} style={{width: '350px'}} />
                            <span className='input-group-addon' id='basic-addon1' onClick={() => this.removeItem('item', {itemIndex: index})}>
                              <i className='fa fa-times' aria-hidden='true' />
                            </span>
                          </div>
                        </div>
                      </div>
                    </form>
                    {popup}
                  </div>
                  {itm.submenu.map((sub, subindex) => {
                    return <div style={{marginLeft: '50px', marginTop: '-50px'}}>
                      <div ref={'submenu-' + index + '-' + subindex} style={{paddingTop: '5px'}} className='align-center' >
                        <form className='m-form m-form--fit m-form--label-align-right'>
                          <div className='m-portlet__body'>
                            <div className='form-group m-form__group'>
                              <div className='input-group m-input-group'>
                                <input type='text' onChange={(e) => this.changeLabel(e, 'submenu', {itemIndex: index, subIndex: subindex})} value={sub.title}
                                  onClick={(e) => { this.target = subindex + '-sub-item'; this.clickIndex = 'submenu-' + index + '-' + subindex; this.subIndex = subindex; this.onSelectItem(e, index) }}
                                  className='form-control m-input' style={{width: '350px'}} />
                                <span className='input-group-addon' id='basic-addon1' onClick={() => this.removeItem('submenu', {itemIndex: index, subIndex: subindex})}>
                                  <i className='fa fa-times' aria-hidden='true' />
                                </span>
                              </div>
                            </div>
                          </div>
                        </form>
                        {popup}
                      </div>

                      { sub.submenu.map((nested, nestedindex) => {
                        return <div style={{marginLeft: '50px', marginTop: '-50px'}}>
                          <div ref={'nested-' + index + '-' + subindex + '-' + nestedindex} style={{paddingTop: '5px'}} className='align-center' >
                            <form className='m-form m-form--fit m-form--label-align-right'>
                              <div className='m-portlet__body'>
                                <div className='form-group m-form__group'>
                                  <div className='input-group m-input-group'>
                                    <input type='text' onChange={(e) => this.changeLabel(e, 'nested', {itemIndex: index, subIndex: subindex, nestedIndex: nestedindex})} value={nested.title} className='form-control m-input'
                                      onClick={(e) => { this.target = nestedindex + '-nested-item'; this.clickIndex = 'nested-' + index + '-' + subindex + '-' + nestedindex; this.subIndex = subindex; this.onSelectItem(e, index) }} style={{width: '350px'}} />
                                    <span className='input-group-addon' id='basic-addon1' onClick={() => this.removeItem('nested', {itemIndex: index, subIndex: subindex, nestedIndex: nestedindex})}>
                                      <i className='fa fa-times' aria-hidden='true' />
                                    </span>
                                  </div>
                                </div>
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
                return <li className='nav-item m-tabs__item'>
                  <div ref={'item-' + index} className='align-center' style={{marginTop: '-50px', marginLeft: '-11px'}}>
                    <form className='m-form m-form--fit m-form--label-align-right'>
                      <div className='m-portlet__body'>
                        <div className='form-group m-form__group'>
                          <div className='input-group m-input-group'>
                            <input type='text' className='form-control m-input' onChange={(e) => this.changeLabel(e, 'item', {itemIndex: index})}
                              value={itm.title} onClick={(e) => { this.target = index + '-item'; this.clickIndex = 'item-' + index; this.onSelectItem(e, index) }} style={{width: '350px'}} />
                            <span className='input-group-addon' id='basic-addon1' onClick={this.addItem.bind(this)}>
                              <i className='fa fa-plus' aria-hidden='true' />
                            </span>
                            <span className='input-group-addon' id='basic-addon1' onClick={() => this.removeItem('item', {itemIndex: index})}>
                              <i className='fa fa-times' aria-hidden='true' />
                            </span>
                          </div>
                        </div>
                      </div>
                    </form>
                    {popup}
                  </div>
                  { itm.submenu.map((sub, subindex) => {
                    return <div style={{marginLeft: '50px', marginTop: '-50px'}}>
                      <div ref={'submenu-' + index + '-' + subindex} style={{paddingTop: '5px'}} className='align-center' >
                        <form className='m-form m-form--fit m-form--label-align-right'>
                          <div className='m-portlet__body'>
                            <div className='form-group m-form__group'>
                              <div className='input-group m-input-group'>
                                <input type='text' className='form-control m-input' onChange={(e) => this.changeLabel(e, 'submenu', {itemIndex: index, subIndex: subindex})}
                                  value={sub.title}
                                  onClick={(e) => { this.target = subindex + '-sub-item'; this.clickIndex = 'submenu-' + index + '-' + subindex; this.subIndex = subindex; this.onSelectItem(e, index) }}
                                  style={{width: '350px'}} />
                                <span className='input-group-addon' id='basic-addon1' onClick={() => this.removeItem('submenu', {itemIndex: index, subIndex: subindex})}>
                                  <i className='fa fa-times' aria-hidden='true' />
                                </span>
                              </div>
                            </div>
                          </div>
                        </form>
                        {popup}
                      </div>
                      { sub.submenu.map((nested, nestedindex) => {
                        return <div style={{marginLeft: '50px', marginTop: '-50px'}}>
                          <div ref={'nested-' + index + '-' + subindex + '-' + nestedindex} style={{paddingTop: '5px'}} className='align-center' >
                            <form className='m-form m-form--fit m-form--label-align-right'>
                              <div className='m-portlet__body'>
                                <div className='form-group m-form__group'>
                                  <div className='input-group m-input-group'>
                                    <input type='text' onChange={(e) => this.changeLabel(e, 'nested', {itemIndex: index, subIndex: subindex, nestedIndex: nestedindex})} value={nested.title}
                                      className='form-control m-input' onClick={(e) => { this.target = nestedindex + '-nested-item'; this.clickIndex = 'nested-' + index + '-' + subindex + '-' + nestedindex; this.subIndex = subindex; this.onSelectItem(e, index) }} style={{width: '350px'}} />
                                    <span className='input-group-addon' id='basic-addon1' onClick={() => this.removeItem('nested', {itemIndex: index, subIndex: subindex, nestedIndex: nestedindex})}>
                                      <i className='fa fa-times' aria-hidden='true' />
                                    </span>
                                  </div>
                                </div>
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
                    <li className='nav-item m-tabs__item'>
                      <div className='align-center' style={{marginTop: '-30px', marginLeft: '-13px'}}>
                        <form className='m-form m-form--fit m-form--label-align-right'>
                          <div className='m-portlet__body'>
                            <div className='form-group m-form__group'>
                              <div className='input-group m-input-group'>
                                <input type='text' readOnly value='Powered by KiboPush'
                                  className='form-control m-input' style={{width: '350px'}} />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </li>
                    <p><b>Note: </b>Only two menu items can be added.</p>
                  </ul>
                </div>
                <div className='row' style={{marginLeft: '5px'}}>
                  <div className='col-lg-6 m--align-left' >
                    <button onClick={this.save.bind(this)} className='btn btn-sm btn-primary'>
                      Save Menu
                    </button>
                    { !(this.props.currentMenuItem && this.props.currentMenuItem.itemMenus) && (!this.props.indexByPage)
                      ? <button onClick={this.showDialog} className='btn btn-sm btn-primary' disabled style={{marginLeft: '15px'}}>
                        Preview
                      </button>
                      : <button onClick={this.showDialog} className='btn btn-sm btn-primary' style={{marginLeft: '15px'}}>
                        Preview
                      </button>
                    }
                    <button style={{marginLeft: '15px'}} onClick={this.reset.bind(this)} className='btn btn-sm btn-secondary'>
                      Reset Menu
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
    user: (state.basicInfo.user),
    indexByPage: (state.menuInfo.menuitems),
    currentMenuItem: (state.menuInfo.currentMenuItem),
    successMessage: (state.menuInfo.successMessage),
    errorMessage: (state.menuInfo.errorMessage)
    //  items: (state.menuInfo.menuitems)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    addMenuItem: addMenuItem,
    fetchMenu: fetchMenu,
    saveMenu: saveMenu,
    getIndexBypage: getIndexBypage,
    saveCurrentMenuItem: saveCurrentMenuItem,
    removeMenu: removeMenu
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu)
