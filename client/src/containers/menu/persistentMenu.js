import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { Link } from 'react-router'
import AlertContainer from 'react-alert'
import { registerAction } from '../../utility/socketio'

class Menu extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.state = {
      menuItems: [{
        title: 'First Menu',
        submenu: []
      }],
      selectPage: {}
    }

    this.pageChange = this.pageChange.bind(this)
    this.selectPage = this.selectPage.bind(this)
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
                    {
                      this.state.menuItems.map((items, index) => {
                        return (
                          <div>
                            <div className='col-6 menuDiv m-input-icon m-input-icon--right'>
                              <input type='text' className='form-control m-input menuInput' value={items.title} />
                              <span className='m-input-icon__icon m-input-icon__icon--right'>
                                <span>
                                  <i className='fa fa-times-circle' />
                                </span>
                              </span>
                            </div>
                            <div className='col-6 menuDiv m-input-icon m-input-icon--right' style={{marginLeft: '30px'}}>
                              <input type='text' className='form-control m-input menuInput' value='Sub Menu' />
                              <span className='m-input-icon__icon m-input-icon__icon--right'>
                                <span>
                                  <i className='fa fa-times-circle' />
                                </span>
                              </span>
                            </div>
                            <div className='col-6 menuDiv m-input-icon m-input-icon--right' style={{marginLeft: '60px'}}>
                              <input type='text' className='form-control m-input menuInput' value='Nested Menu' />
                              <span className='m-input-icon__icon m-input-icon__icon--right'>
                                <span>
                                  <i className='fa fa-times-circle' />
                                </span>
                              </span>
                            </div>
                          </div>
                        )
                      })
                   }
                    { this.state.menuItems.length === 1 &&
                      <div className='col-6 menuDiv' style={{marginLeft: '-15px'}}>
                        <button className='addMenu' >+ Add Menu </button>
                      </div>
                    }
                    <div className='col-6 menuDiv' style={{marginLeft: '-15px'}}>
                      <input type='text' className='form-control m-input menuFix' value='Powered by KiboPush' />
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
