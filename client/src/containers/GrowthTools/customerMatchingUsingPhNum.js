import React from 'react'
import Dropzone from 'react-dropzone'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'

class CustomerMatching extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { files: [],
      textAreaValue: 'Enter Invitation Message' }
  }

  onDrop (files) {
    this.setState({
      files
    })
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
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h3>Customer Matching Using Phone Numbers</h3>
                  <br />
                  <h7>Upload a file with .csv extension containing phone numbers of your customers to invite them for a chat on messenger. The
              file should contain a column with the name 'phone_numbers'. This column should list all the customers&#39; phone numbers. The phone number will be used to send him
              an invitation on Facebook Messenger.</h7>
                  <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12 dropzone'>
                    <Dropzone className='file-upload-area' onDrop={this.onDrop.bind(this)} accept='.csv'>
                      <p>Try dropping some files here, or click to select files to upload. Only '.csv' files are accepted</p>
                      <h6>File Selected</h6>
                      <span>
                        {
                         this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                       }
                      </span>
                    </Dropzone>
                    <div className='row'>
                      <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                        <span>Selected File :
                      {
                        this.state.files.map(f => <span>{f.name} - {f.size} bytes</span>)
                      }
                        </span>
                      </div>
                      <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                        <textarea className='textArea' value={this.state.textAreaValue} />
                      </div>
                      <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                        <button className='btn btn-primary'>Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomerMatching
