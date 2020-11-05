import React from 'react'
import PropTypes from 'prop-types'

class ComponentContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    return (
      <>
      {
        this.props.onRemove &&
        <i style={{
          cursor: 'pointer',
          float: 'right',
          top: '7px',
          right: '10px',
          position: 'relative',
          zIndex: '1',
          fontSize: '1.5rem'
          }} 
          className="flaticon-circle" 
          onClick={this.props.onRemove}
        />
      }
        <div style={{border: '1px solid lightgray', borderRadius: '5px', padding: '20px', marginRight: '20px'}}>
            {this.props.children}
        </div>
      </>
    )
  }
}

ComponentContainer.propTypes = {
    onRemove: PropTypes.func.isRequired
}

export default ComponentContainer
