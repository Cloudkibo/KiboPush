import React from 'react'
import { loadPollDetails } from '../../redux/actions/templates.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class viewPoll extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pollDetailsData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.backToUserDetails = this.backToUserDetails.bind(this)
  }

  displayData (n, pageSubscribers) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > pageSubscribers.length) {
      limit = pageSubscribers.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageSubscribers[i]
      index++
    }
    this.setState({pollDetailsData: data})
  }

  componentWillReceiveProps (nextProps) {
  }

  backToUserDetails () {
    this.props.history.push({
      pathname: `/showTemplatePolls`
    })
  }

  componentDidMount () {
    if (this.props.currentPoll) {
      const id = this.props.currentPoll._id
      this.props.loadPollDetails(id)
    }
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | View Template`;
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              {this.props.pollDetails &&
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
                      <h3 className='m-subheader__title' style={{marginTop: '15px'}}>{this.props.pollDetails.title}</h3>
                      <p><b>Category: </b>{this.props.pollDetails.category.join(',')}</p>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='col-xl-12'>
                    <p><strong>Statement: </strong>{this.props.pollDetails.statement}</p>
                    {this.props.pollDetails.options.map((d) => (
                      <div className='m-section__content'>
                        <div data-code-preview='true' data-code-html='true' data-code-js='false'>
                          <div className='m-demo__preview'>
                            <div className='m-list-timeline' style={{marginTop: '10px', marginLeft: '30px'}}>
                              <div className='m-list-timeline__items'>
                                <div className='m-list-timeline__item'>
                                  <span className='m-list-timeline__badge m-list-timeline__badge--success' />
                                  <span className='m-list-timeline__text'>
                                    {d}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              }
              <div style={{'overflow': 'auto'}}>
                <button className='btn btn-primary btn-sm' onClick={() => this.backToUserDetails()} style={{ float: 'right', margin: '20px' }}>Back
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
  return {
    pollDetails: (state.templatesInfo.pollDetails),
    currentPoll: (state.backdoorInfo.currentPoll)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPollDetails: loadPollDetails},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(viewPoll)
