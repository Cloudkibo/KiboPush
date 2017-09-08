/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddChannel from './addChannel'
import ListItem from './ListItem'

class Autoposting extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isShowingModal: false,
      showListItems: true
    }
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.gotoSettings = this.gotoSettings.bind(this)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  gotoSettings (item) {
    this.props.history.push({
      pathname: `/autoposting-itemsettings`,
      state: item
    })
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h3>Autoposting</h3>
                  <Link onClick={this.showDialog} className='btn btn-primary btn-sm'
                    style={{float: 'right'}}>Add Channel</Link>

                    {
                      this.state.isShowingModal &&
                      <ModalContainer style={{width: '500px'}}
                        onClose={this.closeDialog}>
                        <ModalDialog style={{width: '500px'}}
                          onClose={this.closeDialog}>
                          <AddChannel />
                        </ModalDialog>
                      </ModalContainer>
                    }

                  <div className='table-responsive'>
                    <br /><br />
                    { this.state.showListItems
                      ? <div>
                        <ListItem openSettings={this.gotoSettings} title='Facebook Page' username='kibopush' />
                        <ListItem openSettings={this.gotoSettings} title='YouTube Channel' username='cloudkibo' />
                        <ListItem openSettings={this.gotoSettings} title='Twitter Account' username='jekram' />
                      </div>
                      : <p>Currently, you do not have any channels. Click on Add Channel button to add new channels. </p>
                    }
                  </div>
                </div>
              </div>

            </main>

          </div>
        </div>
      </div>

    )
  }
}

export default Autoposting
