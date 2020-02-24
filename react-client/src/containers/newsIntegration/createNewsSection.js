import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import { createNewsFeed, updateNewsFeed } from '../../redux/actions/rssIntegration.actions'
import { RingLoader } from 'halogenium'

class CreateFeed extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      isActive: true,
      sectionTitle: '',
      isDefault: false,
      selectedPage: '',
      saveEnabled: false,
      inValidUrlMsg: '',
      defaultMessage: '', 
      fbPageId: '',
      loading: false
    }
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.sectionTitleChange = this.sectionTitleChange.bind(this)
    this.defaultFeedChange = this.defaultFeedChange.bind(this)
    this.isValidIntegration = this.isValidIntegration.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.resetFields = this.resetFields.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.pageHasDefaultFeed = this.pageHasDefaultFeed.bind(this)
  }

  pageHasDefaultFeed (pageId) {
    var defaultFeed = true
    if (this.props.defaultFeeds) {
      for (var i = 0; i < this.props.defaultFeeds.length; i++) {
        if (this.props.defaultFeeds[i].pageIds[0] === pageId && this.props.defaultFeeds[i].defaultFeed) {
          defaultFeed = false
          break
        }
      }
    }
    return defaultFeed
  }
  pageChange (event) {
    if (event.target.value !== -1) {
        if(!this.props.currentFeed) {
          var defaultFeed = this.pageHasDefaultFeed(event.target.value)
          this.setState({
            isDefault: defaultFeed,
            defaultMessage: defaultFeed ? `Currently you have no default news sections for the selected page: ${event.target.selectedOptions[0].label}`: `You already have a default news section for the selected page: ${event.target.selectedOptions[0].label}. Click on the checkbox if you want to make this news section as default`,
          })
        }
        this.setState({
          selectedPage: event.target.value,
          fbPageId: this.props.newsPages.filter((page) => page._id === event.target.value)[0].pageId
        })
      } else {
        this.setState({
          selectedPage: ''
        })
      }
  }

  resetFields () {
    this.setState({
      isActive: true,
      sectionTitle: '',
      isDefault: false,
      saveEnabled: false,
      inValidUrlMsg: '',
      selectedPage: '',
      defaultMessage: '', 
      loading: false
    })

    var pageSelected = ''
    for (let i = 0; i < this.props.newsPages.length; i++) {
        pageSelected = this.props.newsPages[i]
        break
    }
    this.setState({
      selectedPage: pageSelected._id,
    })
  }
  handleSave () {
    this.setState({
      loading: true
    })
    var rssPayload = {
	    title: this.state.sectionTitle,
	    defaultFeed: this.state.isDefault,
	    isActive: this.state.isActive,
      pageIds: [this.state.selectedPage],
      integrationType: 'manual'
    }
    if (!this.props.currentFeed) {
      this.props.createNewsFeed(rssPayload, this.msg, this.resetFields, () => {this.setState({ loading: false})})
    } else {
      var data = {
        feedId: this.props.currentFeed._id,
        updatedObject: rssPayload
      }
      this.props.updateNewsFeed(data, this.msg, true, () => {this.setState({ loading: false})})
    }
  }

  isValidIntegration (title, selectedPage) {
    var isValid = false
    if (title !== '' && selectedPage !== '') {
      isValid = true
    } else {
      isValid = false
    }
    this.setState({
      saveEnabled: isValid
    })
  }
  defaultFeedChange (e) {
    this.isValidIntegration(this.state.sectionTitle, this.state.selectedPage)
    this.setState({
      isDefault: e.target.checked
    })
  }
  handleStatusChange (e) {
    this.isValidIntegration(this.state.sectionTitle, this.state.selectedPage)
    this.setState({
      isActive: e.target.value === 'true' ? true : false
    })
  }

  sectionTitleChange (e) {
    this.isValidIntegration(this.state.sectionUrl, e.target.value, this.state.selectedPage)
    this.setState({
      sectionTitle: e.target.value
    })
  }

  componentDidMount () {
    let title = ''
    document.title = `${title} | News Section`
    if (this.props.currentFeed) {
      this.setCurrentFeed(this.props.currentFeed)
    } else {
      var pageSelected = ''
      for (let i = 0; i < this.props.newsPages.length; i++) {
        pageSelected = this.props.newsPages[i]
        break
      }
      var defaultFeed = this.pageHasDefaultFeed(pageSelected._id)
      this.setState({
        isDefault: defaultFeed,
        fbPageId: pageSelected.pageId,
        defaultMessage: defaultFeed ? `Currently you have no default news section for the selected page: ${pageSelected.pageName}`: `You already have a default news section for the selected page: ${pageSelected.pageName}. Click on the checkbox if you want to make this news section as default`,
        selectedPage: pageSelected._id
      })
    }
  }

  setCurrentFeed (feed) {
    this.setState({
      isActive: feed.isActive,
      sectionTitle: feed.title,
      isDefault: feed.defaultFeed,
      selectedPage: feed.pageIds[0],
      saveEnabled: true,
      inValidUrlMsg: ''
    })
    var selectedPage = ''
    for (let i = 0; i < this.props.newsPages.length; i++) {
      if (feed.pageIds[0] === this.props.newsPages[i]._id) {
        selectedPage = this.props.newsPages[i]
        break
      }
    }
    this.setState({
      fbPageId: selectedPage.pageId,
      selectedPage: selectedPage._id
    })
  }

  UNSAFE_componentWillReceiveProps () {
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        { this.state.loading && 
        <div style={{ width: '100vw', height: '100vh', background: 'rgba(33, 37, 41, 0.6)', position: 'fixed', zIndex: '99999', top: '0px' }}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
              className='align-center'>
              <center><RingLoader color='#716aca' /></center>
            </div>
          </div>

        }
        <div className='m-content'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    News Section
                  </h3>
                </div>
              </div>
            </div>
            <form className='m-form m-form--label-align-right'>
              <div className='m-portlet__body'>
                <div className='m-form__section m-form__section--first'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Info
                    </h3>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Section Title
                    </label>
                    <div className='col-lg-6'>
                      <input className='form-control m-input' placeholder='title'
                        onChange={this.sectionTitleChange}
                        defaultValue=''
                        value={this.state.sectionTitle} />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Status
                    </label>
                    <div className='col-lg-6' id='rules'>
                      <select className='form-control m-input' onChange={this.handleStatusChange} value={this.state.isActive}>
                        <option value='true'>Enable</option>
                        <option value='false'>Disable</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='m-form__section m-form__section--last'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Settings
                    </h3>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Select Pages
                    </label>
                    <div className='col-lg-6'>
                      <select className='form-control m-input' value={this.state.selectedPage} onChange={this.pageChange}>
                      {
                        this.props.newsPages && this.props.newsPages.length > 0 && this.props.newsPages.map((page, i) => (
                          <option key={page._id} value={page._id} selected={page._id === this.state.selectedPage}>{page.pageName}</option>
                        ))
                      }
                    </select>
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-8' style={{marginLeft: '50px', textAlign:'left'}}>
                      <input name='defaultFeed' value={this.state.isDefault} type='checkbox' checked={this.state.isDefault} onChange={this.defaultFeedChange} />
                      <span>&nbsp;&nbsp;Set Default News Section</span>
                    </label>                  
                    <p className='col-8' style={{fontSize:'0.85rem', marginLeft: '50px'}}>Subscribers will receive daily news updates from the default news section. There can be only one default news section for a single news page. {this.state.defaultMessage}</p>
                  </div>
                </div>
              </div>
            </form>
            <div className='m-portlet__foot m-portlet__foot--fit'>
              <div className='col-11' style={{textAlign: 'right', paddingTop: '30px', paddingBottom: '30px'}}>
                <Link to='/newsIntegration'>
                  <button className='btn btn-secondary'>
                    Back
                  </button>
                </Link>
                <span>&nbsp;&nbsp;</span>
                <span>&nbsp;&nbsp;</span>
                <button className='btn btn-primary' type='button' disabled={!this.state.saveEnabled} onClick={this.handleSave} >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state from news section', state)
  return {
    pages: (state.pagesInfo.pages),
    rssFeeds: (state.feedsInfo.rssFeeds),
    count: (state.feedsInfo.count),
    currentFeed: (state.feedsInfo.currentFeed),
    newsPages: (state.feedsInfo.newsPages),
    defaultFeeds: (state.feedsInfo.defaultFeeds)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      createNewsFeed: createNewsFeed,
      updateNewsFeed: updateNewsFeed
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateFeed)
