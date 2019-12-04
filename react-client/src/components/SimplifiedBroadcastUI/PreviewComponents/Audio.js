/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { uploadTemplate } from '../../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'

class Audio extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: props.file ? props.file : null
    }
    this.edit = this.edit.bind(this)
  }

  edit () {
    this.props.editComponent('audio', {
      file: this.state.file,
      id: this.props.id
    })
  }

  componentDidMount () {
    // if (this.props.file && this.props.file !== '') {
    //   if (this.props.pages) {
    //     this.props.uploadTemplate({pages: this.props.pages,
    //       url: this.props.file.fileurl.url,
    //       componentType: 'audio',
    //       id: this.props.file.fileurl.id,
    //       name: this.props.file.fileurl.name
    //     }, {
    //       id: this.props.id,
    //       componentType: 'audio',
    //       fileName: this.props.file.fileName,
    //       type: this.props.file.type,
    //       size: this.props.file.size
    //     }, this.props.handleFile, this.setLoading)
    //   }
    // }
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px', display: 'inline-block'}}>
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', marginTop: '-20px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <i onClick={this.edit} style={{cursor: 'pointer', marginLeft: '-20px', float: 'left', height: '20px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <audio style={{width: '250px', height: '50px'}} controls name='media'>
          <source src={this.state.file ? this.state.file.fileurl.url : ''} type='audio/mpeg' />
        </audio>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadTemplate: uploadTemplate
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Audio)
