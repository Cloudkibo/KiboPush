import React from 'react'
import { Link } from 'react-router'
import Select from 'react-select'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Popover, PopoverHeader, PopoverBody, UncontrolledTooltip } from 'reactstrap'


class SequencePopover extends React.Component {
    constructor (props,context){
        super(props,context)
        this.state = {
            optionNumber: this.props.optionNumber,
            isSubscribe : false,
            sequenceValue:'',
            sequenceValueUnsub:'',
            showModal: false,
            sequenceOptions: [],
            mappedSequence: false,
            mappedSequenceUnsub: false
        }   

        this.toggleSequenceModal = this.toggleSequenceModal.bind(this)
        this.openSequenceModel = this.openSequenceModel.bind(this)
        this.handleSubscribeSequence = this.handleSubscribeSequence.bind(this)
        this.handleUnsubscribeSequence = this.handleUnsubscribeSequence.bind(this)
        this.toggleAttachSubscribe = this.toggleAttachSubscribe.bind(this)
        this.toggleAttachUnSubscribe = this.toggleAttachUnSubscribe.bind(this)
}

componentWillReceiveProps(nextProps){
    if (nextProps.sequences) {
        let sequenceOptions = []
        let unsubSequenceOptions = []
        for (let a = 0; a < nextProps.sequences.length; a++) {
            sequenceOptions.push({ 'value': nextProps.sequences[a].sequence._id, 'label': nextProps.sequences[a].sequence.name })
        }
        this.setState({ sequenceOptions: sequenceOptions})
      }
}


 toggleSequenceModal(){
     this.setState({showModal: !this.state.showModal})
 }

 openSequenceModel(){
    this.setState({showModal: true})
 }

 handleSubscribeSequence(obj){
     this.setState({sequenceValue: obj.value, sequenceValueUnsub:'' })
 }
 
 handleUnsubscribeSequence(obj){
    this.setState({sequenceValueUnsub: obj.value, sequenceValue:''})
 }

 toggleAttachSubscribe () {
    this.setState({mappedSequence: !this.state.mappedSequence, isSubscribe: !this.state.mappedSequence? true : false,  mappedSequenceUnsub: this.state.mappedSequence ? !this.state.mappedSequence : this.state.mappedSequence })
  }

  toggleAttachUnSubscribe () {
    this.setState({mappedSequenceUnsub: !this.state.mappedSequenceUnsub,  isSubscribe: !this.state.mappedSequenceUnsub? false : true, mappedSequence: this.state.mappedSequenceUnsub ? !this.state.mappedSequenceUnsub : this.state.mappedSequenceUnsub })
  }

  render () {
    console.log('sequence state', this.state)

    return (
      <div>
          <button id='openSequencePopover' onClick={this.openSequenceModel} className='btn btn-outline-primary btn-sm m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
            <span>
                <i className='la la-plus' />
                <span>
                Set Action
                </span>
            </span>
        </button>

        {this.state.showModal &&
        <Popover placement='left' className='subscriberPopover' isOpen={this.state.showModal} target='openSequencePopover' toggle={this.toggleSequenceModal}>
            <PopoverHeader>Set Action</PopoverHeader>
            <PopoverBody>
                <div className='row' style={{ minWidth: '250px' }}>
                <div className='col-12'>
                    When subscriber selects this option
                    <br/>
                    
                <div style={{marginTop: '20px'}} className='m-accordion m-accordion--default'>
                <div style={{overflow: 'visible'}} className='m-accordion__item'>
                    {
                        this.state.mappedSequence
                        ? <div className='m-accordion__item-head'>
                        <span className='m-accordion__item-title'>Subscribe to Sequence</span>
                        <span style={{cursor: 'pointer'}} onClick={this.toggleAttachSubscribe} className='m-accordion__item-icon'>
                            <i className='la la-minus' />
                        </span>
                        </div>
                        : <div className='m-accordion__item-head collapsed'>
                        <span className='m-accordion__item-title'>Subscribe to Sequence</span>
                        <span style={{cursor: 'pointer'}} onClick={this.toggleAttachSubscribe} className='m-accordion__item-icon'>
                            <i className='la la-plus' />
                        </span>
                        </div>
                    }
                    {
                        this.state.mappedSequence &&
                        <div className='m-accordion__item-body'>
                        <div className='m-accordion__item-content'>
                            <Select
                            options={this.state.sequenceOptions}
                            onChange={this.handleSubscribeSequence}
                            value={this.state.sequenceValue}
                            placeholder='Subscribe to Sequence'
                            />
                        </div>
                        </div>
                    }
                    </div>
                    <div style={{overflow: 'visible'}} className='m-accordion__item'>
                    {
                        this.state.mappedSequenceUnsub
                        ? <div className='m-accordion__item-head'>
                        <span className='m-accordion__item-title'>Unsubscribe to Sequence</span>
                        <span style={{cursor: 'pointer'}} onClick={this.toggleAttachUnSubscribe} className='m-accordion__item-icon'>
                            <i className='la la-minus' />
                        </span>
                        </div>
                        : <div className='m-accordion__item-head collapsed'>
                        <span className='m-accordion__item-title'>Unsubscribe to Sequence</span>
                        <span style={{cursor: 'pointer'}} onClick={this.toggleAttachUnSubscribe} className='m-accordion__item-icon'>
                            <i className='la la-plus' />
                        </span>
                        </div>
                    }
                    {
                        this.state.mappedSequenceUnsub &&
                        <div className='m-accordion__item-body'>
                        <div className='m-accordion__item-content'>
                            <Select
                            options={this.state.sequenceOptions}
                            onChange={this.handleUnsubscribeSequence}
                            value={this.state.sequenceValueUnsub}
                            placeholder='Unsubscribe to Sequence'
                            />
                        </div>
                        </div>
                    }
                    </div>
                </div>
                </div>
                </div>
                <div className='row' style={{ minWidth: '250px' }}>
                <div className='col-12'>
                    <button style={{ float: 'right', margin: '3px' }}
                    className='btn btn-primary btn-sm'
                    onClick={() => {
                        if(this.state.isSubscribe){
                            if(this.state.sequenceValue !== ''){
                                this.props.onSave(this.state.sequenceValue,'subscribe', this.state.optionNumber)
                                this.setState({showModal:false})
                            }
                        }else{
                            if(this.state.sequenceValueUnsub !== ''){
                                this.props.onSave(this.state.sequenceValueUnsub,'unsubscribe', this.state.optionNumber)
                                this.setState({showModal:false})
                            }
                        }    
                    }}
                    >Save
                    </button>
                </div>
                </div>
            </PopoverBody>
        </Popover>}
      </div>
    )
  }
}

export default SequencePopover 
