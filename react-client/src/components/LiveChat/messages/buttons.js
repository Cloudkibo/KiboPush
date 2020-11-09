import React from 'react'

export default function Buttons (props) {
  const buttons = props.buttons ? [...props.buttons] : []
  return (
    buttons.length > 0 &&
    buttons.map((b, i) => (
      <a
        key={i}
        href={b.url && b.url.startsWith('http') ? b.url : `https://${b.url}`}
        target='_blank'
        rel='noopener noreferrer'
        style={{
          pointerEvents: b.url ? '' : 'none',
          border: 'none',
          borderRadius: buttons.length === i + 1 ? '0px 0px 10px 10px' : 0,
          borderColor: '#716aca',
          backgroundColor: 'white'
        }}
        type='button'
        className='btn btn-outline-primary btn-block'
      >
        {b.title}
      </a>
    ))
  )
}
