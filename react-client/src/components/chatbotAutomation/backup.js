import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import MODAL from '../extras/modal'
import CONFIRMATIONMODAL from '../extras/confirmationModal'

class Backup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      waitingForCreate: false,
      waitingForRestore: false
    }
    this.getModalContent = this.getModalContent.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.onRestore = this.onRestore.bind(this)
    this.getTime = this.getTime.bind(this)
  }

  onCreate () {
    this.setState({waitingForCreate: true})
    this.props.createBackup(() => {this.setState({waitingForCreate: false})})
  }

  onRestore () {
    this.setState({waitingForRestore: true})
    this.props.restoreBackup(() => {this.setState({waitingForRestore: false})})
  }

  getTime (datetime) {
    let d = new Date(datetime)
    let dayofweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
    let date = d.getDate()
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
    let year = d.getFullYear()

    let value = [dayofweek, date, month, year, d.toLocaleTimeString()].join(' ')
    value = `${value}\n(${moment(datetime).fromNow()})`
    return value
  }

  getModalContent () {
    if (this.props.data) {
      return (
        <div className='row'>
          <div style={{padding: '10px 15px'}} className='col-md-6'>
            <div className="form-group m-form__group">
              <span className='m--font-boldest'>
                Last backup created at:
              </span>
              <br />
              <span className="m-form__help">
                {this.getTime(this.props.data.datetime)}
              </span>
            </div>
          </div>
          <div style={{textAlign: 'center'}} className='col-md-6'>
            <button
              type="button"
              className={`btn m-btn--pill m-btn--air btn-outline-primary ${this.state.waitingForCreate && 'm-loader m-loader--light m-loader--left'}`}
              style={{border: '1px solid #5867dd', margin: '5px'}}
              onClick={this.onCreate}
            >
              Create New Backup
            </button>
            <button
              type="button"
              className={`btn m-btn--pill m-btn--air btn-outline-primary ${this.state.waitingForRestore && 'm-loader m-loader--light m-loader--left'}`}
              style={{border: '1px solid #5867dd', margin: '5px'}}
              onClick={() => this.refs.restoreBackup.click()}
            >
  						Restore Backup
  					</button>
          </div>
        </div>
      )
    } else {
      return (
        <div style={{textAlign: 'center'}}>
          <p>You have not created the backup yet</p>
          <button
            type="button"
            className={`btn m-btn--pill m-btn--air btn-outline-primary ${this.state.waitingForCreate && 'm-loader m-loader--light m-loader--left'}`}
            style={{border: '1px solid #5867dd'}}
            onClick={this.onCreate}
          >
						Create Backup Now
					</button>
        </div>
      )
    }
  }

  render () {
    return (
			<div id='_chatbot_backup'>
        <MODAL
          id='_chatbot_backup_modal'
          title='Chatbot Backup'
          content={this.getModalContent()}
          onClose={this.props.toggleBackupModal}
        />
        <button style={{display: 'none'}} ref='restoreBackup' data-toggle='modal' data-target='#_confirm_restore_backup' />
        <CONFIRMATIONMODAL
          id='_confirm_restore_backup'
          title='Restore Backup'
          description='This will restore the last backup and current progress will be overriden. Are you sure you want to continue?'
          onConfirm={this.onRestore}
        />
      </div>
    )
  }
}

Backup.propTypes = {
  'data': PropTypes.any,
  'createBackup': PropTypes.func.isRequired,
  'restoreBackup': PropTypes.func.isRequired,
  'toggleBackupModal': PropTypes.func.isRequired
}

export default Backup
