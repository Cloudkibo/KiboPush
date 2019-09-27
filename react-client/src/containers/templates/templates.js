import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TemplateSurveys from './templateSurveys'
import TemplatePolls from './templatePolls'
import TemplateBroadcasts from './templateBroadcasts'
import { Link } from 'react-router'

class templates extends React.Component {
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentDidMount () {
    this.scrollToTop()
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Templates`
  }
  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper' style={{height: 'fit-content'}}>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />

        <div className='m-subheader '>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding templates? Here is the <a href='http://kibopush.com/templates/' target='_blank'>documentation</a>.
            </div>
          </div>
          <Link to='/categories' className='btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent pull-right'>Category
          </Link>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Templates</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <TemplateBroadcasts />
          {
            this.props.user && this.props.user.isSuperUser &&
            <TemplateSurveys />
          }
          {
            this.props.user && this.props.user.isSuperUser &&
            <TemplatePolls />
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(templates)
