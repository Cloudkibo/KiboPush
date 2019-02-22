import React from 'react'
import { Link } from 'react-router'
import YouTube from 'react-youtube'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class DiscoverTabs extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showVideo: false
    }
  }
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Discover Tabs`;
  } 

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px', top: 100}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='RsIFfj7gWjI'
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
        }
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Discover Tabs</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Discover Tabs? Here is the <a href='http://kibopush.com/discoverTabs' target='_blank'>documentation</a>.
              Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Make your bot viewable in Messenger's Discover Tab
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='form-row' style={{display: 'block'}}>
                    <div className='form-group m-form__group col-md-12 col-sm-12 col-lg-12'>
                      <p> To apply to have your bot included in the Messenger's Discover Tab, click on “Discover Submission Form” below and select the page to which your bot is attached. Go to 'Discover Settings' section and fill out the form.</p>
                      <br />
                      <p> You can also check out the <a href='https://developers.facebook.com/docs/messenger-platform/discovery/discover-tab' target='_blank'>FAQ</a> from the Messenger team about the Discover tab. <a href='http://kibopush.com/discoverTabs' target='_blank'>Read More</a></p>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                  <div className='col-12'>
                    <div className='m-form__actions' style={{'float': 'right', marginTop: '20px', marginBottom: '20px'}}>
                      <Link to={'https://www.facebook.com/page_tabs/?redirection=settings%2F%3Ftab%3Dmessenger_platformm'} target='_blank' className='btn btn-primary' >Discover Submission Form
                      </Link>
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

export default DiscoverTabs
