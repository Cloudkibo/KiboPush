import React from 'react'

class ListItem extends React.Component {
  render () {
    return (
      <div style={{boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', margin: '10px', borderRadius: '5px', border: '1px solid #ccc'}} className='card'>
        <div style={{width: '100%', padding: '1rem'}} className='card-block'>
          <div style={{display: 'inline-block', padding: '20px'}}>
            <h4 className='card-title'><i className={this.props.iconClassName} aria-hidden='true' /> anisha</h4>
          </div>
          <div className='pull-right' style={{display: 'inline-block', padding: '10px'}}>
            <div style={{width: '100%', textAlign: 'center'}}>
              <div onClick={() => this.props.showContent(this.props.title)} style={{cursor: 'pointer', display: 'inline-block', padding: '10px'}}>
                <h4><i className='fa fa-chevron-circle-down' aria-hidden='true' /></h4>
              </div>
              <div style={{display: 'inline-block', padding: '10px'}} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ListItem
