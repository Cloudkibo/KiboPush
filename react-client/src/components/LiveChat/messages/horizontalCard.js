import React from 'react'
import PropTypes from 'prop-types'

class Card extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <table style={{margin: '10px'}}>
        <tbody>
         <tr>
           <td>
             <div style={{width: '50px', height: '50px'}}>
               {
                 this.props.image &&
                 <img alt='' src={this.props.image} style={{width: '50px', height: '50px'}} />
               }
             </div>
           </td>
           <td>
             <div style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>
               <span style={{color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold'}}>
                {this.props.title.length > 35 ? `${this.props.title.substring(0, 35)}...` : this.props.title}
              </span>
               <br />
               {
                 this.props.description &&
                 <span style={{marginTop: '-35px'}}>
                  {this.props.description.length > 75 ? `${this.props.description.substring(0, 75)}...` : this.props.description}
                 </span>
               }
             </div>
           </td>
         </tr>
       </tbody>
      </table>
    )
  }
}

Card.propTypes = {
  'title': PropTypes.string.isRequired,
  'description': PropTypes.string,
  'image': PropTypes.string
}

export default Card
