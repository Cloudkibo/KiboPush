import React from 'react'
import PropTypes from 'prop-types'
import { Popover, PopoverBody} from 'reactstrap'
import ButtonOption from './buttonOption'

class CarouselButton extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      options: [],
      showPopover: false,
      popoverTarget: '_carousel_button_in_chatbot',
    }
    this.showPopover = this.showPopover.bind(this)
    this.togglePopover = this.togglePopover.bind(this)
  }

  componentDidMount () {
    if (this.props.button && !this.props.buttonOption) {
      const payload = JSON.parse(this.props.button.payload)
      this.props.updateButtonOption({
        title: this.props.button.title,
        blockId: payload[0] ? payload[0].blockUniqueId : null,
        action: 'link',
        showRemove: true
      }, this.props.cardIndex, false)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.button && (!nextProps.buttonOption || nextProps.buttonOption.action !== 'link')) {
      const payload = JSON.parse(nextProps.button.payload)
      this.props.updateButtonOption({
        title: nextProps.button.title,
        blockId: payload[0] ? payload[0].blockUniqueId : null,
        action: 'link',
        showRemove: true
      }, this.props.cardIndex, false)
    }
  }

  showPopover () {
    this.setState({
      showPopover: true,
      popoverTarget: `_carousel_add_button`
    })
  }

  togglePopover () {
    this.setState({showPopover: !this.state.showPopover})
  }

  render () {
    return (
      <div id='_carousel_button' className='row' style={{marginTop: '20px', maxHeight: '30px'}}>
        <div style={{marginTop: '10px', position: 'relative', textAlign: 'left'}} className='col-3'>
            Button:
        </div>
        <div className='col-9'>
          <div className="form-group m-form__group">
            <div style={{marginLeft: '0', marginTop: '10px'}} className='row'>
              {
                this.props.buttonOption && Object.keys(this.props.buttonOption).length > 0 ?
                (<button
                style={{border: '1px solid #36a3f7', borderRadius: '5px', padding: '5px', cursor: 'pointer', background: 'none'}}
                className='m-link m-link--state m-link--info'
                onClick={() => this.showPopover()}
                id='_carousel_add_button'
              >
                {this.props.buttonOption.title}
              </button>) : 
              (<button
                style={{border: 'none', cursor: 'pointer', background: 'none'}}
                className='m-link m-link--state m-link--info'
                onClick={() => this.showPopover()}
                id='_carousel_add_button'
              >
                + Add Button
              </button>)
              }

            </div>
          </div>
        </div>
        <div id='_carousel_button_in_chatbot'>
          <Popover
            placement='top'
            isOpen={this.state.showPopover}
            className='chatPopover _popover_max_width_400'
            target={this.state.popoverTarget}
            toggle={this.togglePopover}
          >
            <PopoverBody>
              {
                this.state.showPopover &&
                <ButtonOption
                  cardIndex={this.props.cardIndex}
                  title={this.props.buttonOption ? this.props.buttonOption.title : ''}
                  blockId={this.props.buttonOption ? this.props.buttonOption.blockId : ''}
                  blocks={this.props.blocks}
                  onCancel={this.togglePopover}
                  showRemove={this.props.buttonOption ? this.props.buttonOption.showRemove : false}
                  action={this.props.buttonOption ? this.props.buttonOption.action : (this.props.isCreatable ? 'create' : 'link')}
                  alertMsg={this.props.alertMsg}
                  isCreatable={this.props.isCreatable}
                  type='carouselButton'
                  updateButtonOption={this.props.updateButtonOption}
                  buttonOption={this.props.buttonOption}
                />
              }
            </PopoverBody>
          </Popover>
        </div>
      </div>
    )
  }
}

CarouselButton.defaultProps = {
  'isCreatable': true
}

CarouselButton.propTypes = {
  'showLabel': PropTypes.bool,
  'button': PropTypes.object.isRequired,
  'currentLevel': PropTypes.number.isRequired,
  'maxLevel': PropTypes.number.isRequired,
  'addOption': PropTypes.func.isRequired,
  'removeOption': PropTypes.func.isRequired,
  'updateOption': PropTypes.func.isRequired,
  'isCreatable': PropTypes.bool
}

export default CarouselButton
