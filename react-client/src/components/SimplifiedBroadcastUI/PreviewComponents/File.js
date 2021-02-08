/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { uploadFile, uploadTemplate } from '../../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'

class File extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: this.props.file ? this.props.file : null
    }
    this.edit = this.edit.bind(this)
  }

  edit () {
    if (this.props.templateName) {
      this.props.editComponent('template', {
        edit: true,
        templateName: this.props.templateName,
        templateArguments: this.props.templateArguments,
        selectedIndex: this.props.selectedIndex,
        templateMessage: this.props.caption,
        id: this.props.id,
        templateId: this.props.templateId,
        templateCode: this.props.templateCode,
        templateType: this.props.templateType,
        fileurl: this.props.file.fileurl,
        componentType: 'file'
      })
    } else {
      this.props.editComponent('file', {
        file: this.state.file,
        id: this.props.id
      })
    }
  }

  componentDidMount () {
    // if (this.props.file && this.props.file !== '') {
    //   if (this.props.pages && this.props.file) {
    //     this.props.uploadTemplate({pages: this.props.pages,
    //       url: this.props.file.fileurl.url,
    //       componentType: 'file',
    //       componentName: 'file',
    //       id: this.props.file.fileurl.id,
    //       name: this.props.file.fileurl.name
    //     }, {
    //       id: this.props.id,
    //       componentType: 'file',
    //       componentName: 'file',
    //       fileName: this.props.file.fileName,
    //       type: this.props.file.type,
    //       size: this.props.file.size
    //     }, this.props.handleFile, this.setLoading)
    //   }
    // }
  }

  render () {
    console.log('this.props in file', this.props)
    return (
      <div className='broadcast-component' style={{marginBottom: '50px', display: 'inline-block'}}>
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', marginTop: '-20px', marginRight: '-15px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <i onClick={this.edit} style={{cursor: 'pointer', marginRight: '15px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <div className='discussion' style={{display: 'inline-block'}}>
          <div className='bubble recipient' style={{maxWidth: '100%', cursor: 'pointer', fontSize: '18px'}}>
            {/* eslint-disable */}
            📁 <a href={this.state.file ? this.state.file.fileurl.url : null} target='_blank' rel='noopener noreferrer' rel='noopener noreferrer' download>{this.state.file ? this.state.file.fileName : 'File'}</a>
            {/* eslint-enable */}
            {
              this.props.caption &&
              <div style={{marginTop: '10px', textAlign: 'left'}}>{this.props.caption}</div>
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadFile: uploadFile,
    uploadTemplate: uploadTemplate
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(File)
