import React from 'react'
import PropTypes from 'prop-types'

class List extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getStyle = this.getStyle.bind(this)
    this.isLarge = this.isLarge.bind(this)
  }

  isLarge (index) {
    const isLarge = (this.props.list.top_element_style === 'large' && index === 0)
    return isLarge
  }

  getStyle (index, list) {
    let largeStyle = {
      border: '1px solid #ccc'
    }
    if (this.isLarge(index)) {
      largeStyle = {
        backgroundImage: list.image_url && `url(${list.image_url})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        border: '1px solid #ccc'
      }
    }
    return largeStyle
  }

  render() {
    return (
      <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px'}} >
        {
          this.props.list.elements.map((list, index) => (
            <div style={this.getStyle(index, list)}>
              <div className='row' style={{padding: '10px'}}>
                <div className={this.isLarge(index) ? 'col-12' : 'col-6'} style={{minHeight: '75px'}}>
                  <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '15px'}}>{list.title}</h6>
                  {
                    list.subtitle &&
                    <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '12px'}}>{list.subtitle}</p>
                  }
                </div>
                {
                  !this.isLarge(index) &&
                  <div className='col-6'>
                    {
                      list.image_url &&
                      <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '80%', minWidth: '80%', marginLeft: '20%'}} >
                        <img alt='' src={list.image_url} style={{maxWidth: '100%', maxHeight: '100%'}} />
                      </div>
                    }
                  </div>
                }
                {
                  list.buttons && list.buttons.map(button => (
                    <div className='ui-block' style={{border: '1px solid rgb(7, 130, 255)', borderRadius: '5px', minHeight: '50%', minWidth: '25%', marginLeft: '10%', marginTop: '-10px'}} >
                      <h5 style={{color: '#0782FF', fontSize: '12px'}}>{button.type === 'element_share' ? 'Share' : button.title}</h5>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
        {
          this.props.list.buttons &&
          this.props.list.buttons.length > 0 &&
          this.props.list.buttons.map(button =>(
            <div>
              <h7 style={{color: '#0782FF'}}>{button.type === 'element_share' ? 'Share' : button.title}</h7>
            </div>
          ))
        }
      </div>
    )
  }
}

List.propTypes = {
  'list': PropTypes.object.isRequired
}

export default List
