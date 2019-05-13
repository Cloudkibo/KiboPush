/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ListModal from '../ListModal'

class List extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.edit = this.edit.bind(this)
    this.closeEdit = this.closeEdit.bind(this)
    this.state = {
      listItems: this.props.listItems ? this.props.listItems : [],
      showPlus: false,
      pageNumber: 2,
      buttons: props.buttons ? props.buttons : [],
      topElementStyle: this.props.topElementStyle ? this.props.topElementStyle : 'compact',
      styling: {minHeight: 30, maxWidth: 400},
      editing: false
    }
  }

  edit () {
    this.setState({editing: true})
  }

  closeEdit () {
    this.setState({editing: false})
  }

  componentDidMount () {
    if (this.props.listItems && this.props.listItems.length > 0) {
      console.log('this.props.listItems', this.props)
      var tmp = []
      let cardLength = this.props.listItems.length
      if (cardLength < 2) {
        cardLength = 2
      }
      for (var k = 0; k < cardLength; k++) {
        if (this.props.listItems[k] && this.props.listItems[k].id === k + 1) {
          let card = this.props.listItems[k]
          tmp.push({id: card.id,
            fileurl: card.file ? card.file.fileurl : '',
            image_url: card.file ? card.file.image_url : '',
            fileName: card.file ? card.file.fileName : '',
            type: card.file ? card.file.type : '',
            size: card.file ? card.file.size : '',
            title: card.title,
            subtitile: card.subtitle,
            webviewurl: card.webviewurl,
            elementUrl: card.elementUrl,
            webviewsize: card.webviewsize,
            buttons: card.buttons})
        } else {
          tmp.push({id: (k + 1),
            fileurl: '',
            image_url: '',
            fileName: '',
            type: '',
            size: '',
            title: `Element #{k+1} Title`,
            subtitle: `Element #{k+1} Subtitle`,
            webviewurl: '',
            elementUrl: '',
            webviewsize: 'FULL',
            buttons: []})
        }
      }
      console.log('list is', this.props)
      this.setState({listItems: tmp, broadcast: this.props.listItems})
    }
    console.log('this.props componentDidMount List', this.props)
    if (this.props.list.topElementStyle && this.props.list.buttons) {
      this.setState({topElementStyle: this.props.list.topElementStyle, buttons: this.props.list.buttons})
    }
  }

  openListModal () {
    console.log('opening CardModal for edit', this.state)
    return (<ListModal edit
      topElementStyle={this.state.topElementStyle}
      id={this.props.id}
      cards={this.props.listItems}
      buttons={this.state.buttons}
      replyWithMessage={this.props.replyWithMessage}
      pageId={this.props.pageId}
      closeModal={this.closeEdit}
      addComponent={this.props.addComponent}
      hideUserOptions={this.props.hideUserOptions} />)
  }

  render () {
    let buttonPayloads = this.state.buttons.map((button) => button.payload)
    return (
      <div className='broadcast-component' style={{marginBottom: '50px'}}>
        {
          this.state.editing && this.openListModal()
        }
        <div onClick={() => { this.props.onRemove({id: this.props.id, deletePayload: buttonPayloads}) }} style={{float: 'right', height: 20 + 'px', zIndex: 6, right: this.props.sequence ? 0 + 'px' : '100px', marginTop: '-20px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <i onClick={this.edit} style={{cursor: 'pointer', marginLeft: '-15px', float: 'left', height: '20px'}} className='fa fa-pencil-square-o' aria-hidden='true' />
        <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '175px', maxWidth: '225px', marginLeft: '15px'}} >
          {
            this.props.listItems.map((card, index) => {
              let largeStyle = null
              if (index === 0 && this.state.topElementStyle === 'LARGE') {
                largeStyle = {
                  backgroundImage: `url(${card.image_url})`,
                  backgroundSize: '100%',
                  backgroundRepeat: 'no-repeat'
                }
              }
              return (
                <div style={largeStyle}>
                  <div className='row' style={{padding: '10px'}}>
                    <div className={largeStyle ? 'col-12' : 'col-6'} style={{minHeight: '75px'}}>
                      <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '15px'}}>{card.title}</h6>
                      <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '12px'}}>{card.subtitle}</p>
                    </div>
                    {!largeStyle && <div className='col-6'>
                      <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '80%', minWidth: '80%', marginLeft: '20%'}} >
                        {
                            card.image_url &&
                            <img src={card.image_url} style={{maxWidth: '100%', maxHeight: '100%'}} />
                            }
                      </div>
                      </div>
                      }
                    {
                        card.buttons && card.buttons.map(button => {
                          return (
                            <div className='ui-block' style={{border: '1px solid rgb(7, 130, 255)', borderRadius: '3px', minHeight: '50%', minWidth: '25%', marginLeft: '10%'}} >
                              <h6 style={{color: '#0782FF', fontSize: '12px'}}>{button.type === 'element_share' ? 'Share' : button.title}</h6>
                            </div>
                          )
                        })
                        }
                  </div>
                  {
                        index !== this.props.listItems.length - 1 && <hr />
                  }
                </div>)
            })
          }
          {
            this.state.buttons.map(button => {
              return (
                <div>
                  <hr />
                  <h5 style={{color: '#0782FF'}}>{button.type === 'element_share' ? 'Share' : button.title}</h5>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(List)
