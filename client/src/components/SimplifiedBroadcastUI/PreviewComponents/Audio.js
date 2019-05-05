/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { uploadTemplate } from '../../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import AudioModal from '../AudioModal'

class Audio extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: props.file ? props.file : null,
      editing: false
    }
    this.edit = this.edit.bind(this)
    this.closeEditButton = this.closeEditButton.bind(this)
    this.openAudioModal = this.openAudioModal.bind(this)
  }

  closeEditButton () {
    this.setState({editing: false})
  }

  edit () {
    this.setState({editing: true})
  }

  openAudioModal () {
    console.log('opening TextModal for edit', this.state)
    return (<AudioModal edit file={this.state.file} id={this.props.id} pageId={this.props.pageId} closeModal={this.closeEditButton} addComponent={this.props.addComponent} hideUserOptions={this.props.hideUserOptions} />)
  }

  componentDidMount () {
    if (this.props.file && this.props.file !== '') {
      var fileInfo = {
        id: this.props.id,
        componentType: 'audio',
        name: this.props.file.fileName,
        type: this.props.file.type,
        size: this.props.file.size,
        url: ''
      }
      if (this.props.file.fileurl) {
        fileInfo.url = this.props.file.fileurl.url
      }
      this.setState({file: fileInfo})
      if (this.props.pages) {
        this.props.uploadTemplate({pages: this.props.pages,
          url: this.props.file.fileurl.url,
          componentType: 'audio',
          id: this.props.file.fileurl.id,
          name: this.props.file.fileurl.name
        }, {
          id: this.props.id,
          componentType: 'audio',
          fileName: this.props.file.fileName,
          type: this.props.file.type,
          size: this.props.file.size
        }, this.props.handleFile, this.setLoading)
      }
    }
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px', display: 'inline-block'}}>
        {
          this.state.editing && this.openAudioModal()
        }
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
