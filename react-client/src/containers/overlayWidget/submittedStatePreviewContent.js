/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class PreviewContentSubmittedState extends React.Component {
  render () {
    return (
     <div style={{width:'100%', height:'100%'}}>
        { this.props.widgetType !== 'bar' &&
        <span>
          <i className='la la-close' style={{float: 'right', marginTop:'5px', marginRight:'5px'}} />
        </span>
        }
        <div className='col-12' style={{width: '100%',height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <div style={{marginBottom: `${this.props.widgetType !== 'bar'? '75px': '0px'}`}}>
            <textarea value={this.props.submittedState.message} rows='2' style={{resize: 'none', fontWeight: '600', border:'none', fontSize: 'large', textAlign: 'center', height: 'auto', width: `${this.props.widgetType === 'page_takeover' ? '400px': '300px'}`, margin: '10px', background: this.props.submittedState.background_color, color: this.props.submittedState ? this.props.submittedState.headline_color : '#000'}} maxLength='100' onChange={this.props.handleHeadlineChange} />
            <br />
            { this.props.widgetType !== 'bar' &&
            <textarea value={this.props.submittedState.description} rows='2' style={{fontWeight: '300', fontSize: 'small', border:'none', textAlign: 'center', height: 'auto', width: `${this.props.widgetType === 'page_takeover' ? '400px': '320px'}`, margin: '10px', background: this.props.submittedState.background_color, color: this.props.submittedState.description_color}} maxLength='100' onChange={this.props.handleDescriptionChange} />
            }
            <div className='btn' style={{marginTop: '10px', backgroundColor: `${this.props.submittedState.button_background}`, padding: '5px'}}>
              <textarea style={{ margin: '1px 1px -4px 1px', padding: '5px',resize: 'none', width: '180px', border:'none', textAlign: 'center',height: '32px', 'background': `${this.props.submittedState.button_background}`, 'color': `${this.props.submittedState.button_text_color}`}} value={this.props.submittedState.button_text} maxLength='25' onChange={this.props.changeButtonText} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PreviewContentSubmittedState
