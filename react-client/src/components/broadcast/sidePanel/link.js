import React from 'react'
import PropTypes from 'prop-types'

class Link extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: props.link.url,
      errorMsg: props.link.errorMsg,
      loading: props.link.loading,
      valid: props.link.valid
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.getHelpMessageClass = this.getHelpMessageClass.bind(this)
    this.updateStateData = this.updateStateData.bind(this)
  }

  onValueChange (e) {
    this.setState({url: e.target.value, loading: true, errorMsg: this.props.retrieveMsg})
  }

  getHelpMessageClass () {
    if (this.state.loading) {
      return 'm--font-info'
    } else if (this.state.valid) {
      return 'm--font-success'
    } else {
      return 'm--font-danger'
    }
  }

  updateStateData (link) {
    this.setState({
      errorMsg: link.errorMsg,
      loading: link.loading,
      valid: link.valid
    })
  }

  componentDidMount () {
    let self = this
    let typingTimer
    let doneTypingInterval = 100
    let input = document.getElementById(`side_panel_link_component_${this.props.index}`)
    input.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(() => {
        self.setState({loading: true, errorMsg: this.props.retrieveMsg})
        self.props.handleUrlChange(self.state.url, self.props.index, self.updateStateData)
      }, doneTypingInterval)
    })
    input.addEventListener('keydown', () => {clearTimeout(typingTimer)})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of link side panel called ', nextProps)
    if (nextProps.link) {
      this.setState({
        url: nextProps.link.url,
        errorMsg: nextProps.link.errorMsg,
        loading: nextProps.link.loading,
        valid: nextProps.link.valid
      })
    }
  }

  render () {
    console.log('props in link side panel', this.props)
    return (
      <div key={this.props.index} style={{marginRight: '0px'}} className="form-group m-form__group row">
        <div className={this.props.showRemove ? 'col-11' : 'col-12'}>
          <input
            id={`side_panel_link_component_${this.props.index}`}
            className="form-control m-input"
            type="text"
            placeholder={this.props.placeholder}
            value={this.state.url}
            onChange={this.onValueChange}
            onFocus={this.props.updateActiveLink ? () => this.props.updateActiveLink(this.props.index) : () => {}}
          />
        </div>
        {
          this.props.showRemove &&
          <span
            onClick={() => {this.props.removeLink(this.props.index)}}
            className="col-1 col-form-label"
            style={{margin: 'auto', padding: '0px', cursor: 'pointer'}}
          >
            <i style={{fontSize: '25px'}} className='la la-trash' />
          </span>
        }
        <span className={`col-12 m-form__help ${this.getHelpMessageClass()}`}>
          {this.state.errorMsg}
        </span>
      </div>
    )
  }
}

Link.propTypes = {
  'link': PropTypes.object.isRequired,
  'index': PropTypes.number.isRequired,
  'removeLink': PropTypes.func,
  'showRemove': PropTypes.bool.isRequired,
  'handleUrlChange': PropTypes.func.isRequired,
  'updateActiveLink': PropTypes.func,
  'placeholder': PropTypes.string.isRequired
}

export default Link
