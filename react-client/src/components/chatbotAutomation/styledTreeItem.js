import React from 'react'
import TreeItem from '@material-ui/lab/TreeItem'

function StyledTreeItem (props) {
  const {nodeId, label, completed, selected} = props
  return (
    <TreeItem
      nodeId={nodeId}
      label={
        <div>
          <span className={`${selected && 'm--font-boldest'} ${completed && 'm--font-success'}`}>
            {label}
            {
              completed &&
              <i style={{marginLeft: '10px'}} className='fa fa-check m--font-success' />
            }
          </span>
        </div>
      }
    >
    {props.children}
    </TreeItem>
  )
}

export default StyledTreeItem
