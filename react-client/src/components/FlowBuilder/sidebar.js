import React from "react"
// import PropTypes from 'prop-types'
import SIDEBARITEM from './sidebarItem'

class Sidebar extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className='card'>
        <div style={{background: '#716aca', color: 'white'}} className='card-header'>
          <h6 style={{lineHeight: 1.5}}>
            Drag and drop items to add
          </h6>
        </div>
        <div style={{padding: '0px', border: '1px solid #716aca'}} className='card-body'>
          <SIDEBARITEM
            name='Message Block'
            type='component_block'
            ports={{}}
            properties={{}}
          />
          <SIDEBARITEM
            name='Actions Block'
            type='action_block'
            ports={{}}
            properties={{}}
          />
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {

}

export default Sidebar
