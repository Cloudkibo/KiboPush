/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class TextModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: 'Test Message',
      showingButtons: [false, false, false]
    }
    this.handleTextChange = this.handleTextChange.bind(this)
    this.addButton = this.addButton.bind(this)
  }

  handleTextChange (e) {
    this.setState({text: e.target.value})
  }

  addButton () {
    let showingButtons = this.state.showingButtons
    for (let i = 0; i < this.state.showingButtons.length; i++) {
      if (!this.state.showingButtons[i]) {
        showingButtons[i] = true
        this.setState({showingButtons})
        return
      }
    }
  }

  render () {
    return (
      <ModalContainer style={{width: '900px', left: '45vh', top: '82px'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '45vh', top: '82px'}}
          onClose={this.props.closeModal}>
          <h3>Add Text Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h4>Text:</h4>
              <textarea value={this.state.text} style={{marginBottom: '30px', maxWidth: '100%', minHeight: '100px'}} onChange={this.handleTextChange} className='form-control' />
              <h4>Buttons (Optional):</h4>
              {
                  this.state.showingButtons.map((buttonData) => {
                    if (buttonData) {
                      return (
                        <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', height: '300px', marginTop: '30px'}} >
                          <div style={{whiteSpace: 'nowrap', marginTop: '10px'}}>
                            <h5 style={{display: 'inline'}}>title:</h5>
                            <input type='text' id='id1' className='form-control col-6 pull-right' style={{marginRight: '130px', height: '25px'}} />
                          </div>
                        </div>
                      )
                    }
                  })
              }
              <div className='ui-block hoverborder' style={{minHeight: '30px', width: '100%', marginLeft: '0px', marginTop: '30px', marginBottom: '30px'}} onClick={this.addButton}>
                <div id={'buttonTarget-' + this.props.button_id} ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
                  <h6> + Add Button </h6>
                </div>
              </div>
            </div>
            <div className='col-1'>
              <div style={{height: '500px', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', height: '490px', marginLeft: '-50px'}} >
                <section className='discussion'>
                  <div className='bubble recipient' style={{marginRight: '120px', marginTop: '100px', fontSize: '20px'}}>{this.state.text}</div>
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
