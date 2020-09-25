import React from 'react'
import PropTypes from 'prop-types'

class MenuArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      text: ''
    }
    this.setText = this.setText.bind(this)
    this.convertToEmoji = this.convertToEmoji.bind(this)
  }

  componentDidMount () {
    this.setText(this.props.options)
  }

  convertToEmoji (num) {
    const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
    let emoji = ''
    for (let i = 0; i < num.length; i++) {
      emoji += numbers[parseInt(num.charAt(i))]
    }
    return emoji
  }


  setText (options) {
    if (options.length > 0) {
      let text = ''
      for (let i = 0; i < options.length; i++) {
        text += this.convertToEmoji(('0' + i).slice(-2))
        text += `: ${options[i].title}\n`
      }
      this.setState({text})
    } else {
      this.setState({text: ''})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.options) {
      this.setText(nextProps.options)
    }
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div
            style={{
              position: 'relative',
              background: '#f2f2f2',
              borderRadius: '10px',
              whiteSpace: 'break-spaces',
              padding: '10px'
            }}
            className="form-group m-form__group"
          >
            {this.state.text}
          </div>
        </div>
      </div>
    )
  }
}

MenuArea.propTypes = {
  'options': PropTypes.array.isRequired
}

export default MenuArea
