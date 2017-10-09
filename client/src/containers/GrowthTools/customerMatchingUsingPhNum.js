import React from 'react'
import Dropzone from 'react-dropzone'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  saveFileForPhoneNumbers
} from '../../redux/actions/growthTools.actions'

class CustomerMatching extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { files: [],
      textAreaValue: '' }

    this.onTextChange = this.onTextChange.bind(this)
    this.renderTextField = this.renderTextField.bind(this)
  }

  onSubmit(values) {
    console.log('onsubmit', values)
    saveFileForPhoneNumbers(this.state.files, this.state.textAreaValue)
  }

  onTextChange(e) {
    console.log('text change' , e.target.value);
    this.setState({textAreaValue : e.target.value})
  }

  onDrop (files) {
    this.setState({
      files
    })
  }

  renderTextField(field) {
      const className = `form-group ${field.meta.touched && field.meta.error ? 'has-danger' : ''}`;
      return (
          <div className = {className}>
              <textarea className='textArea form-control'  placeholder='Enter Invitation Message' value={this.state.textAreaValue}  onChange={this.onTextChange} />
              <span className = 'text-help' style = {{color : 'red'}}>{field.meta.touched ? field.meta.error : '' }</span>
          </div>
      );
  }

  render () {
    const { handleSubmit } = this.props;
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
                  <form onSubmit = {handleSubmit(this.onSubmit.bind(this))}>
                    <Dropzone className='file-upload-area' onDrop={this.onDrop.bind(this)} accept='.csv'>
                      <p>Try dropping some files here, or click to select files to upload. Only '.csv' files are accepted</p>
                      <h6>File Selected</h6>
                      <span>
                        {
                         this.state.files.map(f => <span>{f.name} - {f.size} bytes</span>)
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
                        <Field name = 'invitationMessage' className = 'textArea' component = {this.renderTextField} value={this.state.textAreaValue} onChange={this.onTextChange} />
                      </div>
                      <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                        <button className='btn btn-primary' type = 'submit'>Submit</button>
                      </div>
                    </div>
                  </form>
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

function validate(values) {
    const errors = {};
    console.log('validate',values)
    if(!values.invitationMessage) {
      errors.invitationMessage = 'Enter an invitation message';
  }
    return errors;
}

function mapStateToProps (state) {
  console.log('in mapStateToProps', state)
  return {
    uploadResponse: state.getFileUploadResponse.fileUploadResponse
  //  usersData: state.usersData
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({saveFileForPhoneNumbers: saveFileForPhoneNumbers},
    dispatch)
}
export default reduxForm({
    validate : validate,
    form : 'CustomerMappingForm'
})(
    connect(mapStateToProps,mapDispatchToProps)(CustomerMatching)
);
