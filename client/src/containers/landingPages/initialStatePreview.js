/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class PreviewInitialSate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      title: props.title,
      description: props.description,
      buttonText: props.button ? props.button : ''
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
  }

  handleTitleChange (e) {
    console.log('handleTitleChange', e.target.value)
    this.setState({title: e.target.value})
    this.props.setInitialStatePreview(e.target.value, this.state.description)
  }

  handleDescriptionChange (e) {
    console.log('handleDescriptionChange', e.target.value)
    this.setState({description: e.target.value})
    this.props.setInitialStatePreview(this.state.title, e.target.value)
  }

  componentWillMount () {
    console.log('in componentDidMount')
    this.props.setInitialStatePreview(this.state.title, this.state.description)
  }

  render () {
    console.log('this.props.initialState in preview', this.props.initialState)
    return (
      <div>
        <div className='row' style={{paddingLeft: '15px'}}>
          {this.props.initialState && this.props.initialState.mediaLink && this.props.initialState.mediaPlacement === 'contentLeftSide'
            ? <div className='row'>
              <div className='col-md-4 col-lg-4 col-sm-4'>
                <img style={{width: '180px', height: '200px', margin: 'auto', display: 'block', marginBottom: '10px'}} src={this.props.initialState.mediaLink} />
              </div>
              <div className='col-md-8 col-lg-8 col-sm-8 '>
                <textarea className='addMenu' value={this.state.title} rows='3' style={{fontWeight: '600', fontSize: 'xx-large', textAlign: 'center', height: 'auto', marginBottom: '10px', color: this.props.initialState ? this.props.initialState.titleColor : '#000'}} onChange={() => this.handleTitleChange()} />
                <textarea className='addMenu' value={this.state.description} rows='3' style={{fontWeight: '500', fontSize: 'large', textAlign: 'center', height: 'auto', color: this.props.initialState ? this.props.initialState.descriptionColor : '#000'}} onChange={this.handleDescriptionChange} onClick={this.handleDescriptionChange} />
              <div className='fb-send-to-messenger'
                  messenger_app_id={this.props.fbAppId}
                  page_id={this.props.pageId}
                  data-ref='send to messenger'
                  color='blue'
                  size='standard' />
              </div>
            </div>
            : this.props.initialState && this.props.initialState.mediaLink && this.props.initialState.mediaPlacement === 'contentRightSide'
            ? <div className='row'>
              <div className='col-md-8 col-lg-8 col-sm-8 '>
                <textarea className='addMenu' value={this.state.title} rows='3' style={{fontWeight: '600', fontSize: 'xx-large', textAlign: 'center', height: 'auto', marginBottom: '10px', color: this.props.initialState ? this.props.initialState.titleColor : '#000'}} onChange={() => this.handleTitleChange()} />
                <textarea className='addMenu' value={this.state.description} rows='3' style={{fontWeight: '500', fontSize: 'large', textAlign: 'center', height: 'auto', color: this.props.initialState ? this.props.initialState.descriptionColor : '#000'}} onChange={this.handleDescriptionChange} onClick={this.handleDescriptionChange} />
              <div className='fb-send-to-messenger'
                  messenger_app_id={this.props.fbAppId}
                  page_id={this.props.pageId}
                  data-ref='send to messenger'
                  color='blue'
                  size='standard' />
              </div>
                <div className='col-md-4 col-lg-4 col-sm-4'>
                  <img style={{width: '180px', height: '200px', margin: 'auto', display: 'block', marginBottom: '10px'}} src={this.props.initialState.mediaLink} />
                </div>
            </div>
            : <div>
            {this.props.initialState && this.props.initialState.mediaLink && this.props.initialState.mediaPlacement === 'aboveHeadline' &&
              <img style={{width: '300px', height: '300px', margin: '10px auto 10px auto', display: 'block'}} src={this.props.initialState.mediaLink} />
            }
            <textarea className='addMenu' value={this.state.title} rows='2' style={{fontWeight: '600', fontSize: 'xx-large', textAlign: 'center', height: 'auto', marginBottom: '10px', color: this.props.initialState ? this.props.initialState.titleColor : '#000'}} onChange={() => this.handleTitleChange()} />
            {this.props.initialState && this.props.initialState.mediaLink && this.props.initialState.mediaPlacement === 'aboveDescription' &&
              <img style={{width: '300px', height: '300px', margin: 'auto', display: 'block', marginBottom: '10px'}} src={this.props.initialState.mediaLink} />
            }
            <textarea className='addMenu' value={this.state.description} rows='2' style={{fontWeight: '500', fontSize: 'large', textAlign: 'center', height: 'auto', color: this.props.initialState ? this.props.initialState.descriptionColor : '#000'}} onChange={this.handleDescriptionChange} onClick={this.handleDescriptionChange} />
            {this.props.initialState && this.props.initialState.mediaLink && this.props.initialState.mediaPlacement === 'belowDescription' &&
              <img style={{width: '300px', height: '300px', margin: 'auto', display: 'block', marginBottom: '10px'}} src={this.props.initialState.mediaLink} />
            }
          <div className='fb-send-to-messenger'
              messenger_app_id={this.props.fbAppId}
              page_id={this.props.pageId}
              data-ref='send to messenger'
              color='blue'
              size='standard' />
            </div>
          }

        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fbAppId: state.basicInfo.fbAppId
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PreviewInitialSate)
