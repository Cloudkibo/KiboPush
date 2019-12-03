import React from 'react'
import DragSortableList from 'react-drag-sortable'
import GenericMessageComponents from './GenericMessageComponents'
import PropTypes from 'prop-types'

class GenericMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='row'>
                <div className='col-12'>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                      <div style={{marginBottom: '30px', border: '1px solid #ccc', borderRadius: '0px', zIndex: 1}} className='ui-block'>
                        <div style={{padding: '5px'}}>
                          {
                            !this.props.titleEditable
                            ? <h3> {this.props.convoTitle} </h3>
                            : <h3>{this.props.convoTitle} <i onClick={this.props.showDialog} id='convoTitle' style={{cursor: 'pointer'}} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
                          }
                        </div>
                      </div>
                      <GenericMessageComponents
                        hiddenComponents={this.props.hiddenComponents}
                        addComponent={this.props.showAddComponentModal}
                        addedComponents={this.props.list.length}
                        module={this.props.module}
                      />
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                      <div className='iphone-x' style={{height: !this.props.noDefaultHeight ? 90 + 'vh' : null, marginTop: '15px', paddingRight: '10%', paddingLeft: '10%', paddingTop: 100}}>
                        <DragSortableList
                          style={{overflowY: 'scroll', height: '75vh'}}
                          items={this.props.getItems()}
                          dropBackTransitionDuration={0.3}
                          type='vertical'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

GenericMessage.propTypes = {
  'titleEditable': PropTypes.bool,
  'convoTitle': PropTypes.string.isRequired,
  'showDialog': PropTypes.func.isRequired,
  'hiddenComponents': PropTypes.array.isRequired,
  'showAddComponentModal': PropTypes.func.isRequired,
  'list': PropTypes.array.isRequired,
  'module': PropTypes.string,
  'noDefaultHeight': PropTypes.bool,
  'getItems': PropTypes.func.isRequired,
}

export default GenericMessage
