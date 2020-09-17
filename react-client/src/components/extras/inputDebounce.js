import React from 'react'
class inputDebounce extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.debounce = this.debounce.bind(this)
    }

componentDidMount () {
    console.log('compenet did mount called in input')
    var typingTimer
    var doneTypingInterval = 300
    var self = this
    let myInput = document.getElementById(this.props.inputId)
    myInput.addEventListener('keyup', () => {
        clearTimeout(typingTimer)
        typingTimer = setTimeout(self.debounce, doneTypingInterval)
    })
    }
debounce () {
   console.log('called debounce function in subscriber')
   this.props.callback(document.getElementById(this.props.inputId).value)
 }

 render() {
    return (
        <input id= {this.props.inputId} placeholder={this.props.placeholder}  className='form-control' />
    )
 }
}

export default inputDebounce