import React from 'react'
import PropTypes from 'prop-types'
import TEXT from './text'

class Preview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.getComponent = this.getComponent.bind(this)
  }

  getComponent (item, lastItem) {
    const type = item.componentName
    switch (type) {
      case 'text':
        return <TEXT
          lastItem={lastItem}
          itemPayload={item}
          profilePic={this.props.profilePic}
        />
      default:
        return null
    }
  }

  render () {
     return (
      <div className="m-messenger m-messenger--message-arrow m-messenger--skin-light">
        <div className="m-messenger__messages mCustomScrollbar _mCS_7 mCS-autoHide">
          {
            this.props.items.map((item, index) => (
              this.getComponent(item, (this.props.items.length - 1) === index)
            ))
          }
        </div>
      </div>
    )
  }
}

Preview.propTypes = {
  'items': PropTypes.array.isRequired,
  'profilePic': PropTypes.string.isRequired
}

export default Preview
