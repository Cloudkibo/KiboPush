/* eslint-disable no-useless-constructor */
import React from 'react'
class top10pages extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div style={{boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', margin: '10px', borderRadius: '5px', border: '1px solid #ccc'}} className='card'>
        <div style={{width: '100%', padding: '1rem'}} className='card-block'>
          <div style={{display: 'inline-block', padding: '20px'}}>
            <h4 className='card-title'><i className={this.props.iconClassName} aria-hidden='true' /> {this.props.title}</h4>
          </div>
          <div className='pull-right' style={{display: 'inline-block', padding: '10px'}}>
            <div style={{width: '100%', textAlign: 'center'}}>
              <div onClick={() => this.props.hideContent(this.props.title)} style={{cursor: 'pointer', display: 'inline-block', padding: '10px'}}>
                <h4><i className='fa fa-chevron-circle-up' aria-hidden='true' /></h4>
              </div>
              <div style={{display: 'inline-block', padding: '10px'}} />
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
              <div className='row align-items-center'>
                <div className='col-xl-12 order-2 order-xl-1'>
              {
                this.props.pagesData && this.props.pagesData.length > 0
                ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                  <table className='m-datatable__table'
                    id='m-datatable--27866229129' style={{
                      display: 'block',
                      height: 'auto',
                      overflowX: 'auto'
                    }}>
                    <thead className='m-datatable__head'>
                      <tr className='m-datatable__row' style={{height: '53px'}}>
                        <th className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                          <span style={{width: '150px'}}>Page Pic</span></th>
                        <th className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                          <span style={{width: '150px'}}>Page Name</span>
                        </th>
                        <th className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                          <span style={{width: '150px'}}>Number of Subscribers</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.props.pagesData.map((page, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td className='m-datatable__cell'>
                              <span
                                style={{width: '150px'}}>
                                <img alt='pic' src={(page.pagePic) ? page.pagePic : ''} className='img-circle' width='60' height='60' />
                              </span>
                            </td>
                            <td className='m-datatable__cell'>
                              <span
                                style={{width: '150px'}}>{page.pageName}</span></td>
                            <td className='m-datatable__cell'>
                              <span
                                style={{width: '150px'}}>{page.subscribers}</span></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
                : <div className='table-responsive'>
                  <p> No data to display </p>
                </div>
              }
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
    )
  }
}

export default top10pages
