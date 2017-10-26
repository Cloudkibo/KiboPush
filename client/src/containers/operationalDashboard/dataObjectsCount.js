/* eslint-disable no-useless-constructor */
import React from 'react'
class dataObjectsCount extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              { this.props.objectsData !== null && this.props.length > 0
              ? <div className='table-responsive'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Data Item</th>
                      <th>Total Count</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {
                      <tr>
                        <td>Users</td>
                        <td>{this.props.objectsData.UsersCount}</td>
                      </tr>
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
    )
  }
}

export default dataObjectsCount
