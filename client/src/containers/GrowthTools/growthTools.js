import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'


class GrowthTools extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      toolsData: [],
      totalLength: 0
    }
  }


  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <h3>Growth Tools</h3>
          <div className='row'>
            <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='table-responsive'>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>Names</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Link to={`/customerMatchingUsingPhNum`}  style = {{color : '#337ab7'}}>
                            Customer Matching Using Phone Numbers
                          </Link>
                        </td>
                        <td>Upload your csv file containing your customers phone numbers to invite them for a chat on Messenger</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default GrowthTools
