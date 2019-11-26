import React from "react"
// import PropTypes from 'prop-types'
import styled from 'styled-components'

const Outer = styled.div`
  font-size: 14px;
  margin-top: 5px;
  background: white;
  cursor: grab;
  display: inline-block
`

const SidebarItem = ({ name, onDrag}) => {
  return (
    <Outer
      id='add-block'
      draggable={true}
      onDragStart={onDrag}
    >
      <i className='fa fa-plus-square'></i> {name}
    </Outer>
  )
}

export default SidebarItem
