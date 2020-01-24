import React from 'react'
import PropTypes from 'prop-types'

class Mapping extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('Mapping constructor called')
    this.showMappingData = this.showMappingData.bind(this)
  }

  showMappingData () {
    let content = []
    content.push(
      <div className='row'>
        <div className={this.props.deleteRow ? 'col-5' : 'col-6'}>
          <label style={{fontWeight: 'normal'}}>{this.props.leftLabel}</label>
        </div>
        <div className='col-1'>
        </div>
        <div className={this.props.deleteRow ? 'col-6' : 'col-5'}>
          <label style={{fontWeight: 'normal'}}>{this.props.rightLabel}</label>
        </div>
      </div>
    )
    for (let i = 0; i < this.props.mappingData.length; i++) {
      content.push(
        <div>
        <div className='row'>
          <div className={this.props.deleteRow ? 'col-5' : 'col-6'} style={{display: 'inherit', paddingRight: (this.props.isFirstRequired && i === 0) ? 'none' : '22px'}}>
              {
                  this.props.updateLeftColumn ?
                  <select value={this.props.mappingData[i].leftColumn ? this.props.mappingData[i].leftColumn : ''} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}} onChange={(e) => this.props.updateLeftColumn(e, i)}>
                    <option key='' value='' disabled>{this.props.defaultLeftOption}</option>
                    {
                        !this.props.leftColumns.groups ? 
                            this.props.leftColumns.data.map((column, index) => 
                                <option key={index} value={column.value}>{column.title}</option>
                            )
                        : 
                            Object.keys(this.props.leftColumns.data).map((group, groupIndex) => 
                                <optgroup key={groupIndex} label={group}>
                                {
                                    this.props.leftColumns.data[group].map((column, columnIndex) => 
                                        <option key={columnIndex} value={column.value}>{column.title}</option>
                                    )
                                }
                            </optgroup>
                            )
                    }
                  </select>
                  : 
                  <div>
                      {
                        <input style={{height: '40px'}} type='text' className='form-control' value={this.props.leftColumns.data[i].value} disabled />
                      }             
                  </div>
              }
            {(this.props.isFirstRequired && i === 0) && <span style={{ color: 'red' }}> * </span> }
          </div>
          <div className='col-1'>
            <center>
            <i className='fa fa-long-arrow-right' style={{paddingTop: '5px', fontSize: 'x-large', color: (this.props.mappingData[i].leftColumn && this.props.mappingData[i].rightColumn) ?  '#419600':'#bfe6c0'}} />
            </center>
          </div>
          <div className={this.props.deleteRow ? 'col-6' : 'col-5'}>
            {
                <div className='row'>
                    <div className={this.props.deleteRow ? 'col-8' : 'col-12'}>
                    {
                        this.props.updateRightColumn ?
                        <select value={this.props.mappingData[i].rightColumn ? this.props.mappingData[i].rightColumn : ''} className='form-control m-bootstrap-select m_selectpicker' style={{height: '40px', opacity: '1'}} onChange={(e) => this.props.updateRightColumn(e, i)}>
                            <option key='' value='' disabled>{this.props.defaultRightOption}</option>
                            {
                                !this.props.rightColumns.groups ? 
                                    this.props.rightColumns.data.map((column, index) => 
                                        <option key={index} value={column.value}>{column.title}</option>
                                    )
                                : 
                                    Object.keys(this.props.rightColumns.data).map((group, groupIndex) => 
                                        <optgroup key={groupIndex} label={group}>
                                        {
                                            this.props.rightColumns.data[group].map((column, columnIndex) => 
                                                <option key={columnIndex} value={column.value}>{column.title}</option>
                                            )
                                        }
                                    </optgroup>
                                    )
                            }
                        </select>
                        :
                        <div>
                        {
                            <input style={{height: '40px'}} type='text' className='form-control' value={this.props.rightColumns.data[i].value} disabled />
                            
                        }             
                        </div>
                    }
                    </div>
                    {
                        this.props.deleteRow && 
                        <div className='col-4'>
                            {
                            (this.props.mappingData.length > 1)
                            ? 
                            <button className='btn-sm btn btn-danger m-btn m-btn--icon m-btn--pill' onClick={(e) => this.props.deleteRow(e, i)} >
                                <span>
                                    <i className="la la-trash-o"></i>
                                    <span>Delete</span>
                                </span>
                            </button>
                            : 
                            <button className='btn-sm btn btn-danger m-btn m-btn--icon m-btn--pill' disabled >
                                <span>
                                    <i className="la la-trash-o"></i>
                                    <span>Delete</span>
                                </span>
                            </button>
                            }
                        </div>
                    }
                </div>
            }
          </div>
        </div>
        <br />
        </div>
      )
    }
    if (this.props.addRow) {
        content.push(
            <div className='row'>
              <div className='col-6'>
              <button style={{ margin: '15px' }} className= 'btn btn btn-sm btn-brand m-btn m-btn--icon m-btn--pill m-btn--wide' onClick={this.props.addRow}>
              <span>
                <i className="la la-plus"></i>
                <span>
                  Add
                </span>
              </span>          
              </button>          
              </div>
              <div className='col-1'>
              </div>
            </div>
        )
    }
    return content
  }

  render () {
    console.log('this.props in mapping', this.props)
    return this.showMappingData()
  }
}

Mapping.propTypes = {
    'leftColumns': PropTypes.object.isRequired,
    'rightColumns': PropTypes.object.isRequired,
    'defaultLeftOption': PropTypes.string.isRequired,
    'defaultRightOption': PropTypes.string.isRequired,
    'leftLabel': PropTypes.string.isRequired,
    'rightLabel': PropTypes.string.isRequired,
    'mappingData': PropTypes.array.isRequired,
    'updateLeftColumn': PropTypes.func,
    'updateRightColumn': PropTypes.func
}

export default Mapping
