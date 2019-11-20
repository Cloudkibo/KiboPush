import React from "react"
// import PropTypes from 'prop-types'

class ComponentsArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{marginTop: '-35px'}}>
        <button
          style={{border: '1px dashed #36a3f7'}}
          type="button"
          className="btn m-btn--pill btn-outline-info btn-sm m-btn m-btn--custom"
        >
          + Add Component
        </button>
      </div>
    )
  }
}

ComponentsArea.propTypes = {

}

export default ComponentsArea
