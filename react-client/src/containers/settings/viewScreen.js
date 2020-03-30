import React from 'react'
// import RightArrow from '../../containers/convo/RightArrow'
// import LeftArrow from '../../containers/convo/LeftArrow'

class ViewScreen extends React.Component {
  componentDidMount () {
  }

  render () {
    console.log('View Message Component', this.props.payload)
    // var settings = {
    //   arrows: true,
    //   dots: false,
    //   infinite: false,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   nextArrow: <RightArrow />,
    //   prevArrow: <LeftArrow />
    // }
    return (
      <div style={{position: 'relative', display: 'inline-block', boxSizing: 'content-box', width: '317px', height: '550px', padding: '85px 18px', borderRadius: '48px', background: 'white', border: '5px solid #f9fafc'}}>
        <div style={{border: '1px solid #f2f2f2', borderRadius: '2px', display: 'block', height: '100%', position: 'relative', width: '100%', textAlign: 'center', zIndex: 2, overflow: 'hidden'}}>
          <div style={{background: '#f7f7f8', borderBottom: '1px solid #c8c7cc', zIndex: 10, position: 'relative'}}>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h6 style={{color: '#007aff'}}><i className='fa fa-chevron-left' />Back</h6>
            </div>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h7>{this.props.page.pageName}</h7>
              <p style={{color: '#ccc'}}>Typically replies instantly</p>
            </div>
            <div style={{display: 'inline-block', margin: '5px'}}>
              <h6 style={{color: '#007aff'}}>Manage</h6>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='row'>
              <div className='m-widget4' style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '35px' }}>
                <div className='m-widget4__item'>
                  <div className='col-12'>
                    <div className='m-widget4__img m-widget4__img--pic'>
                      <img alt='pic' src={(this.props.page.pagePic) ? this.props.page.pagePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} />
                    </div>
                  </div>
                  <div className='col-12'>
                    <div className='m-widget4__info previewInfo'>
                      <span className='m-widget4__title'>
                        {this.props.page.pageName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-12 msgPreview'>
                <i className='flaticon-speech-bubble-1 msgPreviewLeft' style={{color: 'blue'}} />
                <p className='msgPreviewRight'>Typically replies instantly</p>
              </div>
              <div className='col-12 msgPreview' >
                <i className='flaticon-exclamation msgPreviewLeft' style={{color: 'blue'}} />
                <p className='msgPreviewRight'>{this.props.previewMessage}</p>
              </div>
            </div>
          </div>
          <div className='m-portlet__foot footerPreview'>
            <div className='footerInfo'>When you tap Get Started, {this.props.page.pageName} will see your public info</div>
            <button className='buttonPreview'>Get Started</button>
          </div>
        </div>
      </div>
    )
  }
}
export default ViewScreen
