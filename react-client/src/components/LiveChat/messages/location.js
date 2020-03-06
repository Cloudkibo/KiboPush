import React from 'react'
import PropTypes from 'prop-types'

class Location extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getUrl = this.getUrl.bind(this)
    this.getMainUrl = this.getMainUrl.bind(this)
  }

  getUrl () {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${this.props.data.payload.coordinates.lat},${this.props.data.payload.coordinates.long}&zoom=13&scale=false&size=400x200&maptype=roadmap&format=png&key=AIzaSyDDTb4NWqigQmW_qCVmSAkmZIIs3tp1x8Q&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${this.props.data.payload.coordinates.lat},${this.props.data.payload.coordinates.long}`
  }

  getMainUrl () {
    return `https://www.google.com/maps/place/${this.props.data.payload.coordinates.lat},${this.props.data.payload.coordinates.long}/`
  }

  render() {
    return (
      <table style={{border: '1px solid #ccc', borderRadius: '15px', borderCollapse: 'separate', padding: '5px'}}>
        <tbody>
          <tr>
            <td>
              <a href={this.getMainUrl()} target='_blank' rel='noopener noreferrer'>
                <img alt='' style={{width: '200px'}} src={this.getUrl()} />
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <p style={{fontWeight: 'bold'}}> {this.props.data.title} </p>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

Location.propTypes = {
  'data': PropTypes.object.isRequired
}

export default Location
