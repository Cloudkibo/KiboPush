import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import TemplateSurveys from './templateSurveys'
import TemplatePolls from './templatePolls'
import TemplateBroadcasts from './templateBroadcasts'
import { Link } from 'react-router'
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
              <Link to='/categories' className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill pull-right' style={{marginRight: '60px'}}>Category
              </Link>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Templates</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <TemplateBroadcasts />
              <TemplateSurveys />
              <TemplatePolls />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default templates
