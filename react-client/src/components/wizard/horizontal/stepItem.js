import React from 'react'

class StepItem extends React.Component {
  render () {
    return (
      <div id='horizontal_wizard_step' style={{display: 'inline-block'}}>
        {
          this.props.showLine &&
          <div style={{display: 'inline-block', verticalAlign: 'middle', width: '100px'}}>
            <hr style={{border: this.props.active ? '3px solid #34bfa3': '3px solid rgb(244, 245, 248)' }}/>
          </div>
        }
        <div style={{display: 'inline-block'}}>
          <button style={{cursor: 'pointer', textAlign: 'center', border: 'none'}}>
            <span style={{backgroundColor: this.props.active ? '#34bfa3' : 'rgb(244, 245, 248)', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', margin: 'auto'}}>
              <span style={{color: this.props.active ? '#fff' : 'rgb(164, 166, 174)', fontSize: '1.5rem', fontWeight: '500'}}>{this.props.number}</span>
            </span>
            <span style={{color: this.props.active ? '#34bfa3' : 'rgb(164, 166, 174)'}}>{this.props.title}</span>
          </button>
        </div>
      </div>
    )
  }
}

export default StepItem
