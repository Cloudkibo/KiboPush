import React from 'react'

class RightArrow extends React.Component {
  render () {
    const {style, className, onClick} = this.props
    return (
      <div>
        <span
          style={{style, display: 'block'}}
          className={className}
          onClick={onClick}
        />
      </div>
    )
  }
}

export default RightArrow
