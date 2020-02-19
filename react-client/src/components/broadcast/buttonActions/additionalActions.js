import React from 'react'
import PropTypes from 'prop-types'
import { Popover, PopoverBody } from 'reactstrap'
import BUTTONITEM from '../sidePanel/buttonItem'

class AdditionalActions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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
                  onButtonClick={() => {}}
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
  'target': PropTypes.string.isRequired
}

export default AdditionalActions
