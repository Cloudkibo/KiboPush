import React from 'react'
import PropTypes from 'prop-types'

class DropdownItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      typingInterval: 1000,
      filterSearch: this.props.filterSearch
    }
    console.log('DropdownItem constructor')
  }

  componentDidMount () {
    let typingTimer
    let doneTypingInterval = this.state.typingInterval
    let input = document.getElementById(`generalSearch`)
    input.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(() => {
          this.props.updateFilterSearch(this.state.filterSearch)
      }, doneTypingInterval)
    })
    input.addEventListener('keydown', () => {clearTimeout(typingTimer)})
  }

  render () {
    return (
        <li className='m-nav__item'>
            <span onClick={() => this.props.action()} className='m-nav__link' style={{cursor: 'pointer'}}>
            {
                this.props.selected
                ? 
                <span style={{fontWeight: 600}} className='m-nav__link-text'>
                    <i className='la la-check' /> {this.props.option}
                </span>
                : 
                <span className='m-nav__link-text'>
                    {this.props.option}
                </span>
            }
            </span>
        </li>
    )
  }
}

DropdownItem.propTypes = {
    'action': PropTypes.func.isRequired,
    'option': PropTypes.string.isRequired,
    'selected': PropTypes.bool.isRequired
}

export default DropdownItem
