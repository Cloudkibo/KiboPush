import React from 'react'
import IconStack from '../Dashboard/IconStack'

class PeriodicAnalytics extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  render() {
    return (
      <div className='row'>
        <div className='col-xl-12'>
          <div className='m-portlet'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Periodic Statistics
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <div style={{ display: 'flex', float: 'right' }}>
                  <span htmlFor='example-text-input' className='col-form-label'>
                    Show records for last:&nbsp;&nbsp;
                </span>
                  <div style={{ width: '200px' }}>
                    <input placeholder='Enter number of days' type='number' min='1' step='1' value={this.props.days} className='form-control' onChange={this.props.onDaysChange} />
                  </div>
                  <span htmlFor='example-text-input' className='col-form-label'>
                    &nbsp;&nbsp;days
                </span>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='row'>
                <div className='col-md-3'>
                  <IconStack
                    icon='la la-user-plus'
                    title={this.props.newSubscribersCount}
                    subtitle='New Subscribers'
                    iconStyle='info'
                    id='newSubscribers'
                    iconFontSize='1.8rem'
                    titleFontSize='20px'
                    iconHeight='50px'
                    iconWidth='50px'
                  />
                </div>
                <div className='col-md-3'>
                  <IconStack
                    icon='la la-user'
                    title={this.props.returningSubscribers}
                    subtitle='Returning Subscribers'
                    iconStyle='success'
                    id='triggers'
                    iconFontSize='1.8rem'
                    titleFontSize='20px'
                    iconHeight='50px'
                    iconWidth='50px'
                  />
                </div>
                <div className='col-md-3'>
                  <IconStack
                    icon='la la-send-o'
                    title={this.props.sentCount}
                    subtitle='Messages Sent'
                    iconStyle='warning'
                    id='triggers'
                    iconFontSize='1.8rem'
                    titleFontSize='20px'
                    iconHeight='50px'
                    iconWidth='50px'
                  />
                </div>
                <div className='col-md-3'>
                  <IconStack
                    icon='la la-check'
                    title={this.props.triggerWordsMatched}
                    subtitle='Times bot started using triggers'
                    iconStyle='danger'
                    id='triggers'
                    iconFontSize='1.8rem'
                    titleFontSize='20px'
                    iconHeight='50px'
                    iconWidth='50px'
                  />
                </div>
              </div>
              <div className='row' style={{ marginTop: '35px' }}>
                {
                  this.props.urlBtnClickedCount !== undefined &&
                  <div className='col-md-3'>
                    <IconStack
                      icon='la la-hand-pointer-o'
                      title={this.props.urlBtnClickedCount}
                      subtitle='Times attachment button clicked'
                      iconStyle='primary'
                      id='triggers'
                      iconFontSize='1.8rem'
                      titleFontSize='20px'
                      iconHeight='50px'
                      iconWidth='50px'
                    />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default PeriodicAnalytics
