import React from 'react'
import PropTypes from 'prop-types'
import { Popover, PopoverBody } from 'reactstrap'
import BUTTONITEM from '../sidePanel/buttonItem'

class AdditionalActions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onActionClick = this.onActionClick.bind(this)
  }

  onActionClick (action) {
    this.props.onActionClick(action)
    this.props.updateAdditionalActions(action, 'Reply with a message')
    this.props.togglePopover()
  }

  render () {
    console.log('props in additional actions side panel', this.props)
    return (
      <Popover
        trigger='click hover'
        placement='left'
        isOpen={this.props.showPopover}
        toggle={this.props.togglePopover}
        target={this.props.target}
      >
        <PopoverBody>
          {
            this.props.actions.map((action) => (
              <div style={{border: 'none', marginTop: '10px'}} className='card'>
                <BUTTONITEM
                  title={action}
                  onButtonClick={this.onActionClick}
                />
              </div>
            ))
          }
        </PopoverBody>
      </Popover>
    )
  }
}

AdditionalActions.propTypes = {
  'actions': PropTypes.array.isRequired,
  'showPopover': PropTypes.bool.isRequired,
  'togglePopover': PropTypes.func.isRequired,
  'target': PropTypes.string.isRequired,
  'onActionClick': PropTypes.func.isRequired,
  'updateAdditionalActions': PropTypes.func.isRequired
}

export default AdditionalActions
