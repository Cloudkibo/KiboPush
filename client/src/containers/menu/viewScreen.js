import React from 'react'
import RightArrow from '../../containers/convo/RightArrow'
import LeftArrow from '../../containers/convo/LeftArrow'

class ViewScreen extends React.Component {
  componentDidMount () {
  }

  render () {
    console.log('View Message Component', this.props.data)
    var settings = {
      arrows: true,
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <RightArrow />,
      prevArrow: <LeftArrow />
    }
    return (
      <div style={{position: 'relative', display: 'inline-block', boxSizing: 'content-box', width: '317px', height: '550px', padding: '85px 18px', borderRadius: '48px', background: 'white', border: '5px solid #f9fafc'}}>
        <div style={{border: '1px solid #f2f2f2', borderRadius: '2px', display: 'block', height: '100%', position: 'relative', width: '100%', textAlign: 'center', zIndex: 2, overflow: 'hidden'}}>
          <div style={{background: '#f7f7f8', borderBottom: '1px solid #c8c7cc', zIndex: 10, position: 'relative'}}>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h6 style={{color: '#007aff'}}><i className='fa fa-chevron-left' />Back</h6>
            </div>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <p style={{color: '#ccc'}}>Typically replies instantly</p>
            </div>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h6 style={{color: '#007aff'}}>Manage</h6>
            </div>
          </div>
          <div className='m-portlet__foot footerPreview'>
            <div style={{'min-height': '149px'}}>
              <div>
                <div>
                  <div>
                    <div>Send a message...
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className='text-ellipsis'>anisha
                      </div>
                    </div>
                  </div></div></div></div>
            <div className='footerInfo'>When you tap Get Started, will see your public info</div>
            <button className='buttonPreview'>Get Started</button>
          </div>
        </div>
      </div>
    )
  }
}
export default ViewScreen
