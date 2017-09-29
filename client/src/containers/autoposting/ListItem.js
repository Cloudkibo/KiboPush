import React from 'react'

class ListItem extends React.Component {
  render () {
    let icon, color
    if (this.props.title === 'Facebook Page') {
      icon = 'fa fa-facebook'
      color = '#365899'
    } else if (this.props.title === 'YouTube Channel') {
      icon = 'fa fa-youtube'
      color = '#cc181e'
    } else {
      icon = 'fa fa-twitter'
      color = '#00aced'
    }
    const item = {
      title: this.props.title,
      icon: icon,
      iconColor: color,
      item: this.props.item
    }
    return (
      <div style={{cursor: 'pointer', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', margin: '10px', borderRadius: '5px', border: '1px solid #ccc'}} className='card'>
        <div>
          <i style={{padding: '10px'}} onClick={() => this.props.updateDeleteID(this.props.item._id)} className='fa fa-times pull-right' aria-hidden='true' />
          <div onClick={() => this.props.openSettings(item)} style={{width: '100%'}} className='card-block'>
            <div style={{display: 'inline-block', padding: '20px'}}>
              <h4 className='card-title'><i style={{color: color}} className={icon} aria-hidden='true' /> {this.props.title}</h4>
              <h6 className='card-subtitle mb-2 text-muted'>Account: {this.props.username}</h6>
            </div>
            <div className='pull-right' style={{display: 'inline-block', padding: '10px'}}>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '10px'}}>
                  <p className='card-text'>{this.props.item.isActive ? 'Active' : 'Disabled'}</p>
                </div>
                <div style={{display: 'inline-block', padding: '10px'}}>
                  <p className='card-text'>
                    <i className='fa fa-filter' aria-hidden='true' />
                    <br />{this.props.item.isSegmented ? 'Filtered' : 'No Filter'}
                  </p>
                </div>
                <div style={{display: 'inline-block', padding: '10px'}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ListItem
