/* eslint-disable no-undef */

import React from 'react'

class UserInput extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      questions: props.questions ? props.questions : [],
      showEmojiPicker: false,
      count: 0,
      showUserOptions: false,
      styling: {
        minHeight: 30, width: 100 + '%', marginLeft: 0 + 'px'
      }
    }
    console.log('UserInput Preview state', this.state)
    this.edit = this.edit.bind(this)
  }

  componentDidMount () {
    if (this.props.message && this.props.message !== '') {
      this.setState({text: this.props.message})
    }
  }

  edit () {
    this.props.editComponent('userInput', {
        id: this.props.id,
        questions: this.state.questions
    })
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: '50px', display: 'inline-block'}}>
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', marginTop: '-20px', marginRight: '-15px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <i onClick={this.edit} style={{cursor: 'pointer', float: 'left', marginLeft: '-15px', height: '20px', marginRight: '15px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        {
            this.state.questions.map((question, index) => {
                return (
                    <div>
                        <div className='discussion' style={{ display: 'inline-block'}} >
                            <div style={{marginLeft: index > 0 ? '15px' : '0', maxWidth: '100%', fontSize: '16px', textAlign: 'center'}} className='bubble recipient broadcastContent'>{question.question}</div>
                        </div>
                        <div style={{marginLeft: '-15%', marginTop: '30px', marginBottom: '50px', width: '120%', height: '12px', borderBottom: '1px solid lightgray', textAlign: 'center'}}>
                            <span style={{color: 'dimgray', backgroundColor: 'white', padding: '0 5px'}}>
                                Waiting for a reply from the user
                            </span>
                        </div>
                    </div>
                )
            })
        }
      </div>
    )
  }
}

export default (UserInput)
