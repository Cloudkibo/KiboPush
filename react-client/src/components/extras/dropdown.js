import React from 'react'
import PropTypes from 'prop-types'

class Dropdown extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropdown: false
    }
    this.toggleDropdown = this.toggleDropdown.bind(this)
  }

  componentDidMount () {
    document.getElementById(this.props.id).addEventListener('click', () => {
      this.close = false
    })
    document.getElementById(`${this.props.id}-dropdown-area`).addEventListener('click', () => {
      this.close = false
    })
    document.addEventListener('click', () => {
      if (this.state.showDropdown && this.close) {
        this.closeBuilderDropdown(true)
      } else if (!this.close) {
        this.close = true
      }
    })
  }

  toggleDropdown () {
    this.setState({showDropdown: !this.state.showDropdown})
  }

  closeBuilderDropdown (flag) {
    flag && this.setState({
      showDropdown: false
    })
  }

  render () {
    return (
      <>
        <div id={this.props.id}>
          <span onClick={this.toggleDropdown} className="m-subheader__daterange" id="m_dashboard_daterangepicker">
            <span className="m-subheader__daterange-label">
              <span className={`m-subheader__daterange-date m--font-${this.props.colorStyle}`}>
                {this.props.selectedText}
              </span>
            </span>
            <button style={{border: 'none'}} className={`btn btn-sm btn-${this.props.colorStyle} m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill`}>
              <i className="la la-angle-down"></i>
            </button>
          </span>
        </div>
        <div id={`${this.props.id}-dropdown-area`}>
          {
            this.state.showDropdown &&
            <div className="daterangepicker dropdown-menu ltr opensleft" style={{display: 'block', top: '150px', right: '15px', left: 'auto', padding: '0px'}}>
              <div className="ranges">
                <ul>
                  {
                    this.props.options.map((option) => (
                      <li
                        key={option.value}
                        style={this.props.builder === option.value ? {pointerEvents: 'none', fontWeight: 600} : {}}
                        onClick={() => option.action(option.value)}
                        data-range-key={option.value}
                      >
                        {
                          this.props.builder === option.value
                          ? <>
                            <i style={{marginRight: '10px'}} className='fa fa-check m--font-success' />
                            {option.text}
                          </>
                          : option.text
                        }
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          }
        </div>
      </>
    )
  }
}

Dropdown.defaultProps = {
  'style': 'brand'
}

Dropdown.propTypes = {
  'id': PropTypes.string.isRequired,
  'selectedText': PropTypes.string.isRequired,
  'colorStyle': PropTypes.oneOf([
    'brand', 'secondary', 'primary', 'success', 'info',
    'warning', 'danger', 'metal', 'accent', 'focus'
  ]),
  'options': PropTypes.arrayOf(
    PropTypes.exact({
      'action': PropTypes.func,
      'text': PropTypes.string,
      'value': PropTypes.string
    })
  ).isRequired,
  'builder': PropTypes.string.isRequired
}

export default Dropdown
