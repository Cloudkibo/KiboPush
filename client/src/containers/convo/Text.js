/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'
import EditButton from './EditButton'
import { Picker } from 'emoji-mart'
import Popover from 'react-simple-popover'

const styles = {
  iconclass: {
    height: 24,
    padding: '0 15px',
    width: 24,
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer'
  },
  inputf: {
    display: 'none'
  }
}

class Text extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleChange = this.handleChange.bind(this)
    this.addButton = this.addButton.bind(this)
    this.editButton = this.editButton.bind(this)
    this.removeButton = this.removeButton.bind(this)
    this.state = {
      button: [],
      text: '',
      showEmojiPicker: false
    }
    this.showEmojiPicker = this.showEmojiPicker.bind(this)
    this.closeEmojiPicker = this.closeEmojiPicker.bind(this)
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

  showEmojiPicker () {
    this.setState({showEmojiPicker: true})
  }

  closeEmojiPicker () {
    this.setState({showEmojiPicker: false})
  }

  setEmoji (emoji) {
    console.log('selected emoji', emoji)
    this.setState({
      text: this.state.text + emoji.native

    })
  }

  handleChange (event) {
    this.props.handleText({id: this.props.id, text: event.target.value, button: this.state.button})
    this.setState({text: event.target.value})
  }

  addButton (obj) {
    var temp = this.state.button
    temp.push(obj)
    this.setState({button: temp})
    this.props.handleText({id: this.props.id, text: this.state.text, button: this.state.button})
  }
  editButton (obj) {
    var temp = this.state.button.map((elm, index) => {
      if (index === obj.id) {
        elm.title = obj.title
        elm.url = obj.url
      }
      return elm
    })
    this.setState({button: temp})
  }
  removeButton (obj) {
    console.log(obj)
    var temp = this.state.button.filter((elm, index) => { return index !== obj.id })
    console.log('Filter', temp)
    this.setState({button: temp})
  }

  render () {
    return (
      <div>
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{position: 'absolute', right: '-10px', top: '-5px', zIndex: '2', marginTop: '-5px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i style={{color: '#ccc'}} className='fa fa-circle fa-stack-2x' />
            <i className='fa fa-times fa-stack-1x fa-inverse' />
          </span>
        </div>
        <div style={{marginBottom: '-7px'}}>
          <textarea value={this.state.text} className='hoverbordersolid' onChange={this.handleChange} rows='2' style={{maxHeight: 25, width: 100 + '%'}} placeholder='Enter your text...' />
          <div ref={(c) => { this.target = c }} style={{display: 'inline-block'}} data-tip='emoticons'>
            <i onClick={this.showEmojiPicker} style={styles.iconclass}>
              <i style={{
                fontSize: '20px',
                position: 'absolute',
                left: '0',
                width: '100%',
                height: '2em',
                margin: '5px',
                textAlign: 'center',
                color: '#787878'
              }} className='fa fa-smile-o' />
            </i>
          </div>

          <Popover
            style={{paddingBottom: '100px', width: '280px', height: '390px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
            placement='bottom'
            target={this.target}
            show={this.state.showEmojiPicker}
            onHide={this.closeEmojiPicker}
        >
            <div>
              <Picker
                style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
                emojiSize={24}
                perLine={7}
                skin={1}
                set='facebook'
                custom={[]}
                autoFocus={false}
                showPreview={false}
                onClick={(emoji, event) => this.setEmoji(emoji)}
            />
            </div>
          </Popover>
        </div>
        {(this.state.button) ? this.state.button.map((obj, index) => {
          return <EditButton data={{id: index, title: obj.title, url: obj.url}} onEdit={this.editButton} onRemove={this.removeButton} />
        }) : ''}
        <div className='ui-block hoverborder' style={{minHeight: 30, width: 100 + '%'}}>
          <Button onAdd={this.addButton} />

        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Text)
