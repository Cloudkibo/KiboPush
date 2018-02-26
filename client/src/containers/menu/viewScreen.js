import React from 'react'

class ViewScreen extends React.Component {
  componentDidMount () {
  }

  render () {
    console.log('View Message Component', this.props.data)
    return (
      <div style={{position: 'relative', display: 'inline-block', boxSizing: 'content-box', width: '317px', height: '550px', padding: '85px 18px', borderRadius: '48px', background: 'white', border: '5px solid #f9fafc'}}>
        <div style={{border: '1px solid #f2f2f2', borderRadius: '2px', display: 'block', height: '100%', position: 'relative', width: '100%', textAlign: 'center', zIndex: 2, overflow: 'hidden'}}>
          <div style={{background: '#f7f7f8', borderBottom: '1px solid #c8c7cc', zIndex: 10, position: 'relative'}}>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h6 style={{color: '#007aff'}}><i className='fa fa-chevron-left' />Back</h6>
            </div>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h7>{this.props.page}</h7>
              <p style={{color: '#ccc'}}>Typically replies instantly</p>
            </div>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h6 style={{color: '#007aff'}}>Manage</h6>
            </div>
          </div>
          <div style={{position: 'absolute', top: '41px', right: '0', bottom: '0', left: '0', boxSizing: 'border-box'}}>
            <div style={{position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', display: 'flex', WebkitBoxOrient: 'vertical', WebkitBoxDirection: 'normal', flexDirection: 'column'}}>
              <div style={{position: 'relative', overflow: 'hidden', width: '100%', height: '100%'}}>
                <div style={{position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', overflow: 'scroll', marginRight: '0px', marginBottom: '0px'}}>
                  <div className='p-a-sm' />
                </div>
                <div style={{position: 'absolute', height: '6px', transition: 'opacity 200ms', opacity: '0', display: 'none', right: '2px', bottom: '2px', left: '2px', borderRadius: '3px'}}>
                  <div style={{position: 'relative', display: 'block', height: '100%', cursor: 'pointer', borderRadius: 'inherit', backgroundColor: 'rgba(0, 0, 0, 0.2)'}} />
                </div>
                <div style={{position: 'absolute', width: '6px', transition: 'opacity 200ms', opacity: '0', display: 'none', right: '2px', bottom: '2px', top: '2px', borderRadius: '3px'}}>
                  <div style={{position: 'relative', display: 'block', width: '100%', cursor: 'pointer', borderRadius: 'inherit', backgroundColor: 'rgba(0, 0, 0, 0.2)'}} />
                </div>
              </div>
              <div className='m-portlet__body' style={{minHeight: '225px', flexShrink: '0', position: 'relative', textAlign: 'start'}}>
                <div style={{position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', overflow: 'hidden', background: '#fafafa', borderTop: '1px solid #e0e6ed', 'transition': 'min-height .3s ease-in-out', zIndex: '10'}}>
                  <div style={{position: 'absolute', right: '0', bottom: '0', left: '0'}}>
                    <div className='row'>
                      <div className='m-widget4 col-12' style={{ marginRight: 'auto' }}>
                        <div className='m-widget4__item'>
                          <div className='m-widget4__info'>
                            <center>
                              <span className='m-widget4__title'>
                                <i className='la la-minus' style={{marginLeft: '130px'}} />
                              </span>
                            </center>
                            <span className='m-widget4__sub'>
                              Send a message...
                            </span>
                          </div>
                        </div>
                        {
                         this.props.data.map((menuItem, i) => (
                           <div className='m-widget4__item' key={i}>
                             <div className='m-widget4__info'>
                               <span className='m-widget4__title'>
                                 {menuItem.title}
                               </span>
                             </div>
                           </div>
                         ))
                      }
                        <div className='m-widget4__item'>
                          <div className='m-widget4__info'>
                            <span className='m-widget4__title'>
                              Powered By KiboPush
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ViewScreen
