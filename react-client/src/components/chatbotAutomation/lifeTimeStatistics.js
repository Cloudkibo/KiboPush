import React from 'react'
import IconStack from '../Dashboard/IconStack'

class LifeTimeStatistics extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    return (
      <div className='row'>
        <div className='col-xl-12'>
          <div className='m-portlet'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Life-Time Statistics
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='row'>
                <div className='col-md-6'>
                  <IconStack
                    icon='la la-user-plus'
                    title={this.props.newSubscribers}
                    subtitle='New Subscribers'
                    iconStyle='success'
                    id='newSubscribers'
                    iconFontSize='1.8rem'
                    titleFontSize='20px'
                    iconHeight='50px'
                    iconWidth='50px'
                  />
                </div>
                <div className='col-md-6'>
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default LifeTimeStatistics
