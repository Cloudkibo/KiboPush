import React from "react"
// import PropTypes from 'prop-types'
import styled from 'styled-components'
import { REACT_FLOW_CHART, ISidebarItemProps } from "@mrblenny/react-flow-chart"

const Outer = styled.div`
  padding: 10px;
  font-size: 14px;
  background: white;
  cursor: grab;
  display: inline-block
`

const SidebarItem = ({ name, type, ports, properties } = ISidebarItemProps) => {
  let iconClass = type === 'component_block' ? 'flaticon-paper-plane' : type === 'action_block' && 'flaticon-interface-9'
  return (
    <Outer
      draggable={true}
      onDragStart={ (event) => {
        event.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify({ type, ports, properties }))
      } }
    >
      <i className={iconClass}></i> {name}
    </Outer>
  )
}

export default SidebarItem
