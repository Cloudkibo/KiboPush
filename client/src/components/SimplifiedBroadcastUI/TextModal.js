/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class TextModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: 'Test Message'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.setState({text: e.target.value})
  }

  render () {
    return (
      <ModalContainer style={{width: '900px', left: '45vh', top: '100px'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '45vh', top: '100px'}}
          onClose={this.props.closeModal}>
          <h3>Add Text Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h4>Text:</h4>
              <textarea value={this.state.text} style={{marginBottom: '30px', maxWidth: '100%', minHeight: '100px'}} onChange={this.handleChange} className='form-control' />
              <h4>Buttons:</h4>
            </div>
            <div className='col-1'>
              <div style={{height: '500px', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', height: '490px', marginLeft: '-50px'}} >
                <section className='discussion'>
                  <div className='bubble recipient' style={{marginRight: '100px', marginTop: '100px'}}>{this.state.text}</div>
                </section>
              </div>
            </div>

            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.props.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button onClick={() => this.props.addComponent({componentType: 'text',
                  text: this.state.text})} className='btn btn-primary'>
                    Add
                </button>
              </div>
            </div>
          </div>
        </ModalDialog>
      </ModalContainer>

    )
  }
}

export default TextModal
