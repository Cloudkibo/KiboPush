import React from "react"
// import PropTypes from 'prop-types'
import styled from 'styled-components'

const Outer = styled.div`
  padding: 10px;
  font-size: 14px;
  background: white;
  cursor: grab;
  display: inline-block
`

const SidebarItem = ({ name, type, onDrag}) => {
  let iconClass = type === 'component_block' ? 'flaticon-paper-plane' : type === 'action_block' && 'flaticon-interface-9'
  return (
    <Outer
      draggable={true}
      onDragStart={onDrag}
    >
      <i className={iconClass}></i> {name}
    </Outer>
  )
}

export default SidebarItem
