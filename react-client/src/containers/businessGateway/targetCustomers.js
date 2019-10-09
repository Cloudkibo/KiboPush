/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Footer from './footer'
import { updateCurrentCustomersInfo } from '../../redux/actions/businessGateway.actions'

class TargetCustomers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      conditions: [{condition: '', criteria: '', text: ''}]
    }
    this.addCondition = this.addCondition.bind(this)
    this.removeCondition = this.removeCondition.bind(this)
    this.changeCondition = this.changeCondition.bind(this)
    this.changeCriteria = this.changeCriteria.bind(this)
    this.changeText = this.changeText.bind(this)
    this.resetCondition = this.resetCondition.bind(this)
  }

  addCondition () {
    this.setState({errorMessages: []})
    let conditions = this.state.conditions
    conditions.push({condition: '', criteria: '', text: ''})
    this.setState({
      conditions: conditions
    })
  }
  resetCondition () {
    var conditions = [{condition: '', criteria: '', text: ''}]
    this.setState({
      conditions: conditions
    })
    if (this.props.updateConditions) {
      this.props.updateConditions([], true)
    }
    this.props.resetErrors()
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'filter', conditions)
  }
  changeCondition (e, index) {
    let conditions = this.state.conditions
    for (let i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].condition = e.target.value
        conditions[i].text = ''
      }
    }
    if (this.props.updateConditions) {
      this.props.updateConditions(conditions, true)
    }
    this.setState({conditions: conditions})
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'filter', conditions)
  }
  changeCriteria (e, index) {
    let conditions = this.state.conditions
    for (let i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].criteria = e.target.value
      }
    }
    if (this.props.updateConditions) {
      this.props.updateConditions(conditions, true)
    }
    this.setState({conditions: conditions})
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'filter', conditions)
  }
  changeText (e, index) {
    e.persist()
    var typingTimer
    var doneTypingInterval = 300
    var self = this
    e.target.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(self.props.debounce, doneTypingInterval)
    })
    let conditions = this.state.conditions
    for (let i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].text = (e.target.value).trim()
        console.log('text: ' + conditions[i].text)
      }
    }
    if (this.props.updateConditions) {
      this.props.updateConditions(conditions)
    }
    this.setState({conditions: conditions})
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'filter', conditions)
  }
  removeCondition (e, index) {
    let tempConditions = this.state.conditions
    for (let i = 0; i < tempConditions.length; i++) {
      if (i === index) {
        tempConditions.splice(i, 1)
      }
    }
    console.log('removing condition', tempConditions)
    if (this.props.updateConditions) {
      if (tempConditions.length === 1) {
        if (tempConditions[0].condition === '' || tempConditions[0].criteria === '' || tempConditions[0].text === '') {
          this.props.updateConditions([], true)
         } else {
          this.props.updateConditions(tempConditions, true)
         }
      } else {
        this.props.updateConditions(tempConditions, true)
      }
    }
    this.setState({
      conditions: tempConditions
    })
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'filter', tempConditions)
  }

  render () {
    return (
      <div style={this.props.style}>
        <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
          <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
            <table className='m-datatable__table'
              id='m-datatable--27866229129' style={{
                display: 'block',
                height: 'auto',
                overflowX: 'auto'
              }}>
              <thead className='m-datatable__head'>
                <tr className='m-datatable__row'
                  style={{height: '53px'}}>
                  <th data-field='title'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{width: '25%'}}>
                    <span>Condition</span>
                  </th>
                  <th data-field='title'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{width: '25%'}}>
                    <span>Criteria</span>
                  </th>
                  <th data-field='text'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{width: '25%'}}>
                    <span>Value</span>
                  </th>
                  <th data-field='remove'
                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{width: '25%'}}>
                    <span />
                  </th>
                </tr>
              </thead>
              <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                {
                 this.state.conditions.map((condition, i) => (
                   <tr data-row={i}
                     className='m-datatable__row m-datatable__row--even'
                     style={{height: '55px'}} key={i}>
                     <td data-field='title'
                       className='m-datatable__cell' style={{width: '25%'}}>
                       <select className='form-control m-input' value={condition.condition} onChange={(e) => this.changeCondition(e, i)}>
                         <option value=''>Select Condition</option>
                         {
                           this.props.fileColumns && this.props.fileColumns.length > 0 && this.props.fileColumns.map((column, i) => (
                             <option key={i} value={column.value}>{column.label}</option>
                           ))
                         }
                       </select>
                       <span className='m-form__help'>
                         {
                           this.props.segmentationErrors.map((m) => (
                             m.error === 'conditions' && m.message.map((msg) => {
                               return (msg.field === 'condition' && msg.index === i &&
                               <span style={{color: 'red'}}>{msg.message}</span>
                               )
                             })
                           ))
                         }
                       </span>
                     </td>
                     <td data-field='title'
                       className='m-datatable__cell' style={{width: '25%'}}>
                       <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                         value={condition.criteria}>
                         <option value=''>Select Criteria</option>
                         <option value='is'>is</option>
                         <option value='contains'>contains</option>
                         <option value='begins'>begins with</option>
                       </select>
                       <span className='m-form__help'>
                         {
                           this.props.segmentationErrors.map((m) => (
                             m.error === 'conditions' && m.message.map((msg) => {
                               return (msg.field === 'criteria' && msg.index === i &&
                               <span style={{color: 'red'}}>{msg.message}</span>
                               )
                             })
                           ))
                         }
                       </span>
                     </td>
                     <td data-field='title'
                       className='m-datatable__cell' style={{width: '25%'}}>
                       <input className='form-control m-input'
                         id = 'targetingText'
                         onChange={(e) => this.changeText(e, i)}
                         value={condition.text}
                         placeholder='Value' />
                       <span className='m-form__help'>
                         {
                              this.props.segmentationErrors.map((m) => (
                               m.error === 'conditions' && m.message.map((msg) => {
                                 return (msg.field === 'text' && msg.index === i &&
                                 <span style={{color: 'red'}}>{msg.message}</span>
                                 )
                               })
                             ))
                           }
                       </span>
                     </td>
                     <td data-field='title'
                       className='m-datatable__cell' style={{width: '25%'}}>
                       { (this.state.conditions.length > 1)
                         ? <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={(e) => this.removeCondition(e, i)} >
                          Remove
                        </button>
                        : <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' disabled >
                         Remove
                       </button>
                      }
                     </td>
                   </tr>
                 ))
               }
              </tbody>
            </table>
            <button style={{margin: '15px'}} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={this.addCondition}>
             + Add Condition
           </button>
            <button style={{marginRight: '15px'}} className='m-btn m-btn--pill m-btn--hover-success btn btn-sm btn-secondary' onClick={this.resetCondition}>
              Reset
           </button>
          </div>
        </div>
        {this.props.handleNext && this.props.handleBack &&
        <Footer tab='targetCustomers' handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    pages: state.pagesInfo.pages,
    customersInfo: state.businessGatewayInfo.customersInfo
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateCurrentCustomersInfo: updateCurrentCustomersInfo
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TargetCustomers)
