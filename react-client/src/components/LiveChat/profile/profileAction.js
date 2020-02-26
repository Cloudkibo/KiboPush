import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

class ProfileAction extends React.Component {

  render () {
    return (
      <div style={{marginTop: '20px'}} className='m-accordion m-accordion--default'>
        <div style={{overflow: 'visible'}} className='m-accordion__item'>
          {
            this.props.expanded
            ? <div className='m-accordion__item-head'>
              <span className='m-accordion__item-icon'>
                <i className={this.props.iconClass} />
              </span>
              <span className='m-accordion__item-title'>{this.props.title}</span>
              <span style={{cursor: 'pointer'}} onClick={this.props.toggle} className='m-accordion__item-icon'>
                <i className='la la-minus' />
              </span>
            </div>
            : <div className='m-accordion__item-head collapsed'>
              <span className='m-accordion__item-icon'>
                <i className={this.props.iconClass} />
              </span>
              <span className='m-accordion__item-title'>{this.props.title}</span>
              <span style={{cursor: 'pointer'}} onClick={this.props.toggle} className='m-accordion__item-icon'>
                <i className='la la-plus' />
              </span>
            </div>
          }
          {
            this.props.expanded &&
            <div className='m-accordion__item-body'>
              <div className='m-accordion__item-content' style={{textAlign: 'center'}}>
                    <Select
                        options={this.props.options}
                        onChange={this.props.onSelectChange}
                        value={this.props.currentSelected}
                        placeholder={this.props.selectPlaceholder}
                    />
                    <button disabled={!this.props.currentSelected} style={{marginTop: '10px'}} className='btn btn-primary' onClick={this.props.performAction}>
                        {this.props.actionTitle}
                    </button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

ProfileAction.propTypes = {
    'expanded': PropTypes.bool.isRequired,
    'toggle': PropTypes.func.isRequired,
    'title': PropTypes.string.isRequired,
    'options': PropTypes.array.isRequired,
    'currentSelected': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]).isRequired,
    'selectPlaceholder': PropTypes.string.isRequired,
    'performAction': PropTypes.func.isRequired,
    'actionTitle': PropTypes.string.isRequired,
    'onSelectChange': PropTypes.func.isRequired,
    'iconClass': PropTypes.string.isRequired
}
  
export default ProfileAction
