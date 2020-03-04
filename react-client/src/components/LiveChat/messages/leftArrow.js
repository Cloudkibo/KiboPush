import React from 'react'

class LeftArrow extends React.Component {
  render () {
    const {style, className, onClick} = this.props
    return (
      <div>
        <span
          className={className}
          style={{style, display: 'block'}}
          onClick={onClick}
        />
      </div>
    )
  }
}

export default LeftArrow
