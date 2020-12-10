import React from 'react'

export default function QuickReplies (props) {
  const buttons = props.buttons ? [...props.buttons] : []
  if (buttons.find(b => !!b.skipAllowed)) {
    buttons.push({title: 'skip'})
  }
  return (
    buttons.length > 0 &&
    buttons.map((b, x) => (
      <button key={x} style={{margin: '3px', border: '1px solid #5867dd', pointerEvents: 'none'}} type='button' className='btn m-btn--pill btn-outline-primary m-btn m-btn--bolder btn-sm'>
        {b.title}
      </button>
    ))
  )
}
