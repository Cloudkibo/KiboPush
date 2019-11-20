import React from "react"
// import PropTypes from 'prop-types'

class ActionsArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div>
        <button
          style={{border: '1px dashed #36a3f7'}}
          type="button"
          className="btn m-btn--pill btn-outline-info btn-sm m-btn m-btn--custom"
        >
          + Add Action
        </button>
      </div>
    )
  }
}

ActionsArea.propTypes = {

}

export default ActionsArea
