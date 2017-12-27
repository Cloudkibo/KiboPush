import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
//  import templatePolls from './templatePolls'
import TemplateSurveys from './templateSurveys'

class templates extends React.Component {
  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper' style={{height: 'fit-content'}}>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Templates</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <TemplateSurveys />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default templates
