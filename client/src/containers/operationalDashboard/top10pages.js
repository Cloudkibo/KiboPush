/* eslint-disable no-useless-constructor */
import React from 'react'
class top10pages extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div style={{boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', margin: '10px', borderRadius: '5px', border: '1px solid #ccc'}} className='card'>
        <div style={{width: '100%'}} className='card-block'>
          <div style={{display: 'inline-block', padding: '20px'}}>
            <h4 className='card-title'><i className={this.props.iconClassName} aria-hidden='true' /> {this.props.title}</h4>
          </div>
          <div className='pull-right' style={{display: 'inline-block', padding: '10px'}}>
            <div style={{width: '100%', textAlign: 'center'}}>
              <div onClick={() => this.props.hideContent(this.props.title)} style={{cursor: 'pointer', display: 'inline-block', padding: '10px'}}>
                <i className='fa fa-chevron-circle-up' aria-hidden='true' />
              </div>
              <div style={{display: 'inline-block', padding: '10px'}} />
            </div>
          </div>
          <div className='row'>
            <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  {
                    this.props.pagesData && this.props.pagesData.length > 0
                    ? <div className='table-responsive'>
                      <table className='table table-striped'>
                        <thead>
                          <tr>
                            <th>Page Pic</th>
                            <th>Page Name</th>
                            <th>Number of Subscribers</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.props.pagesData.map((page, i) => (
                              <tr>
                                <td><img alt='pic'
                                  src={(page.pagePic) ? page.pagePic : ''}
                                  className='img-circle' width='60' height='60' />
                                </td>
                                <td>{page.pageName}</td>
                                <td>{page.subscribers}</td>
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
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default top10pages
