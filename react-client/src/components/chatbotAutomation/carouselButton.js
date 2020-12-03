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
      popoverTarget: this.props.id + '_button_in_chatbot',
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
      let blockTitle = ''
      if (payload[0] && payload[0].blockUniqueId) {
        const block = nextProps.blocks.find(b => ""+b.uniqueId === ""+payload[0].blockUniqueId)
        if (block) {
          blockTitle = block.title
        }
      }
      this.props.updateButtonOption({
        buttonTitle: nextProps.button.title,
        blockTitle,
        blockId: payload[0] ? payload[0].blockUniqueId : null,
        action: 'link',
        showRemove: true
      }, nextProps.cardIndex, false)
    }
  }

  showPopover () {
    this.setState({
      showPopover: true,
      popoverTarget: this.props.id + `_add_button`
    })
  }

  togglePopover () {
    this.setState({showPopover: !this.state.showPopover})
  }

  render () {
    return (
      <div id='_carousel_button' className='row' style={{marginTop: '20px', maxHeight: '30px'}}>
        <div style={{marginTop: '10px', position: 'relative', textAlign: 'left'}} className='col-2'>
            Button:
        </div>
        <div className='col-10'>
          <div className="form-group m-form__group">
            <div style={{marginLeft: '0', marginTop: '10px'}} className='row'>
              {
                this.props.buttonOption && Object.keys(this.props.buttonOption).length > 0 ?
                (<button
                style={{border: '1px solid #36a3f7', borderRadius: '5px', padding: '5px', cursor: 'pointer', background: 'none'}}
                className='m-link m-link--state m-link--info'
                onClick={() => this.showPopover()}
                id={this.props.id + '_add_button'}
              >
                {this.props.buttonOption.buttonTitle}
              </button>) :
              (<button
                style={{border: 'none', cursor: 'pointer', background: 'none'}}
                className='m-link m-link--state m-link--info'
                onClick={() => this.showPopover()}
                id={this.props.id + '_add_button'}
              >
                + Add Button
              </button>)
              }

            </div>
          </div>
        </div>
        <div id={this.props.id + '_button_in_chatbot'}>
          <Popover
            placement='right'
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
                  buttonTitle={this.props.buttonOption ? this.props.buttonOption.buttonTitle : ''}
                  blockTitle={this.props.buttonOption ? this.props.buttonOption.blockTitle : ''}
                  blockId={this.props.buttonOption ? this.props.buttonOption.blockId : ''}
                  blocks={this.props.blocks}
                  onCancel={this.togglePopover}
                  showRemove={!!this.props.button}
                  action={this.props.buttonOption ? this.props.buttonOption.action : (this.props.isCreatable ? 'create' : 'link')}
                  alertMsg={this.props.alertMsg}
                  isCreatable={this.props.isCreatable}
                  type='carouselButton'
                  updateButtonOption={this.props.updateButtonOption}
                  buttonOption={this.props.buttonOption}
                  messengerComponents={this.props.messengerComponents}
                  messengerComponentId={this.props.buttonOption ? this.props.buttonOption.messengerComponentId : ''}
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
  'button': PropTypes.object,
  'buttonOption': PropTypes.object,
  'updateButtonOption': PropTypes.func.isRequired,
  'blocks': PropTypes.array.isRequired,
  'isCreatable': PropTypes.bool
}

export default CarouselButton
