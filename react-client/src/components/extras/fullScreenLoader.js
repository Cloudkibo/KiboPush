import React from 'react'
import { RingLoader } from 'halogenium'

class Loader extends React.Component {
  render () {
    return (
      <div style={{ width: '100vw', height: '100vh', background: 'rgba(33, 37, 41, 0.6)', position: 'fixed', zIndex: '99999', top: '0px' }}>
        <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
          className='align-center'>
          <center><RingLoader color='#716aca' /></center>
        </div>
      </div>
    )
  }
}

export default Loader
