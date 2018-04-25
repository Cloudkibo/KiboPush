/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllSequence, createSequence } from '../../redux/actions/sequence.action'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class CreateSequence extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      sequencesData: [],
      totalLength: 0,
      filterValue: '',
      searchValue: '',
      isShowingModalDelete: false,
      isShowingModal: false,
      deleteid: '',
      name: '',
      error: false
    }
    props.fetchAllSequence()
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSequence = this.searchSequence.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.goToEdit = this.goToEdit.bind(this)
    this.goToView = this.goToView.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.updateName = this.updateName.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.initializeSwitch = this.initializeSwitch.bind(this)
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  gotoCreate () {
    if (this.state.name === '') {
      this.setState({error: true})
    } else {
      this.props.createSequence({name: this.state.name})
      browserHistory.push({
        pathname: `/createSequence`
      })
    }
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  componentDidMount () {
    this.scrollToTop()
    document.title = 'KiboPush | Sequence Messaging'
  }
  updateName (e) {
    this.setState({name: e.target.value, error: false})
  }
  displayData (n, sequences) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > sequences.length) {
      limit = sequences.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = sequences[i]
      index++
    }
    this.setState({sequencesData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.sequences)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.sequences) {
      this.displayData(0, nextProps.sequences)
      this.setState({ totalLength: nextProps.sequences.length })
    }
  }

  searchSequence (event) {
    this.setState({searchValue: event.target.value})
    var filtered = []
    if (event.target.value !== '' && this.state.filterValue === '') {
      for (let i = 0; i < this.props.sequences.length; i++) {
        if (this.props.sequences[i].name && this.props.sequences[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
          filtered.push(this.props.sequences[i])
        }
      }
    } else if (event.target.value !== '' && this.state.filterValue !== '') {
      for (let i = 0; i < this.props.sequences.length; i++) {
        if (this.props.sequences[i].name && this.props.sequences[i].name.toLowerCase().includes(event.target.value.toLowerCase()) && this.props.sequences[i].teamPagesIds.indexOf(this.state.filterValue) !== -1) {
          filtered.push(this.props.sequences[i])
        }
      }
    } else {
      filtered = this.props.sequences
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    this.setState({filterValue: e.target.value})
    var filtered = []
    if (e.target.value !== '' && this.state.searchValue === '') {
      for (let i = 0; i < this.props.teams.length; i++) {
        if (this.props.teams[i].teamPagesIds.indexOf(e.target.value) !== -1) {
          filtered.push(this.props.teams[i])
        }
      }
    } else if (e.target.value !== '' && this.state.searchValue !== '') {
      for (let i = 0; i < this.props.teams.length; i++) {
        if (this.props.teams[i].name && this.props.teams[i].name.toLowerCase().includes(this.state.searchValue.toLowerCase()) && this.props.teams[i].teamPagesIds.indexOf(e.target.value) !== -1) {
          filtered.push(this.props.teams[i])
        }
      }
    } else {
      filtered = this.props.teams
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }
  goToEdit (sequence) {
    // var agents = []
    // var pages = []
    // for (var i = 0; i < this.props.teamUniqueAgents.length; i++) {
    //   if (team._id === this.props.teamUniqueAgents[i].teamId) {
    //     agents.push(this.props.teamUniqueAgents[i])
    //   }
    // }
    // for (var j = 0; j < this.props.teamUniquePages.length; j++) {
    //   if (team._id === this.props.teamUniquePages[j].teamId) {
    //     pages.push(this.props.teamUniquePages[j])
    //   }
    // }
    // console.log('agents', agents)
    // console.log('pages', pages)
    browserHistory.push({
      pathname: `/editSequence`,
      state: {module: 'edit', name: sequence.name, _id: sequence._id}
    })
  }
  goToView (sequence) {
    // var agents = []
    // var pages = []
    // for (var i = 0; i < this.props.teamUniqueAgents.length; i++) {
    //   if (team._id === this.props.teamUniqueAgents[i].teamId) {
    //     agents.push(this.props.teamUniqueAgents[i])
    //   }
    // }
    // for (var j = 0; j < this.props.teamUniquePages.length; j++) {
    //   if (team._id === this.props.teamUniquePages[j].teamId) {
    //     pages.push(this.props.teamUniquePages[j])
    //   }
    // }
    browserHistory.push({
      pathname: `/viewSequence`,
      state: {module: 'view', name: sequence.name, _id: sequence._id}
    })
  }
  initializeSwitch (state, id) {
    var self = this
    var temp = '#' + id
    /* eslint-disable */
    $(temp).bootstrapSwitch({
      /* eslint-enable */
      state: state
    })
    /* eslint-disable */
    $(temp).on('switchChange.bootstrapSwitch', function (event, state) {
      // if (state === true) {
      //   self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: true})
      // } else {
      //   self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: false})
      // }
    })
  }
  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-portlet  m-portlet--full-height '>
	<div className='m-portlet__head'>
		<div className='m-portlet__head-caption'>
			<div className='m-portlet__head-title'>
				<h3 className='m-portlet__head-text'>
				     {this.props.location.state.name}
				</h3>
			</div>
		</div>
	</div>
	<div className='m-portlet__body'>
    <div className='row'>
      <div className='col-xl-2'>
        <div className='m-list-timeline'>
          <div style={{float: 'right', textAlign: 'right'}}>
            <div className='m-list-timeline__time'>
              <div className='row' style={{padding: '5px', width: 'max-content'}}>
              <span className='m-list-timeline__text' style={{ width: '100px', marginTop: '6px', verticalAlign: 'middle', lineHeight: '50px'}}>Message 1</span>
              </div>
            </div>
            <div className='m-list-timeline__time'>
              <div className='row' style={{padding: '5px', width: 'max-content'}}>
              <span className='m-list-timeline__text' style={{ width: '100px', marginTop: '6px', verticalAlign: 'middle', lineHeight: '50px'}}>Message 1</span>
              </div>
            </div>
            <div className='m-list-timeline__time'>
              <div className='row' style={{padding: '5px', width: 'max-content'}}>
              <span className='m-list-timeline__text' style={{ width: '100px', marginTop: '6px', verticalAlign: 'middle', lineHeight: '50px'}}>Message 1</span>
              </div>
            </div>
            <div className='m-list-timeline__time'>
              <div className='row' style={{padding: '5px', width: 'max-content'}}>
              <span className='m-list-timeline__text' style={{ width: '100px', marginTop: '6px', verticalAlign: 'middle', lineHeight: '50px'}}>Message 1</span>
              </div>
            </div>
            <div className='m-list-timeline__time'>
              <div className='row' style={{padding: '5px', width: 'max-content', height: '57px'}}>
              <span className='m-list-timeline__text' style={{ width: '100px', marginTop: '6px', verticalAlign: 'middle', lineHeight: '50px'}}>Message 1</span>
              </div>
            </div>
          </div>
    </div>
  </div>
      <div className='col-xl-10'>
        <div className='m-list-timeline'>
          <div className='m-list-timeline__items'>
            <div className='m-list-timeline__item'>
                <span className='m-list-timeline__badge m-list-timeline__badge--success' style={{position: 'initial'}}></span>
                <div className='row' style = {{padding: '5px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '2px 5px #ccc', width: 'max-content', marginLeft: '-420px'}}>
                  <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                    <label>
                      <input typeName='checkbox' checked name='' />
                      <span></span>
                    </label>
                  </span>
                  <span className='m-list-timeline__text' style={{width: '300px', marginTop: '6px', marginLeft: '10px'}}>Message 1</span>
                  <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>10</span>
                  <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>5</span>
                  <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>2</span>
                  <span className='m-list-timeline__text flaticon flaticon-delete-2' style={{width: '100', marginTop: '6px'}} />
              </div>
            </div>
            <div className='m-list-timeline__item'>
                <span className='m-list-timeline__badge m-list-timeline__badge--success' style={{position: 'initial'}}></span>
                <div className='row' style = {{padding: '5px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '2px 5px #ccc', width: 'max-content', marginLeft: '-420px'}}>
                <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                  <label>
                    <input typeName='checkbox' checked name='' />
                    <span></span>
                  </label>
                </span>
                <span className='m-list-timeline__text' style={{width: '300px', marginTop: '6px', marginLeft: '10px'}}>Message 1</span>
                <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>10</span>
                <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>5</span>
                <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>2</span>
                <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>Delete</span>
            </div>
          </div>
            <div className='m-list-timeline__item'>
                <span className='m-list-timeline__badge m-list-timeline__badge--success' style={{position: 'initial'}}></span>
                <div className='row' style = {{padding: '5px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '2px 5px #ccc', width: 'max-content', marginLeft: '-420px'}}>
                <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                  <label>
                    <input typeName='checkbox' checked name='' />
                    <span></span>
                  </label>
                </span>
                <span className='m-list-timeline__text' style={{width: '300px', marginTop: '6px', marginLeft: '10px'}}>Message 1</span>
                <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>10</span>
                <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>5</span>
                <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>2</span>
                <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>Delete</span>
            </div>
          </div>
          <div className='m-list-timeline__item'>
              <span className='m-list-timeline__badge m-list-timeline__badge--success' style={{position: 'initial'}}></span>
              <div className='row' style = {{padding: '5px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '2px 5px #ccc', width: 'max-content', marginLeft: '-420px'}}>
              <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                <label>
                  <input typeName='checkbox' checked name='' />
                  <span></span>
                </label>
              </span>
              <span className='m-list-timeline__text' style={{width: '300px', marginTop: '6px', marginLeft: '10px'}}>Message 1</span>
              <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>10</span>
              <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>5</span>
              <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>2</span>
              <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>Delete</span>
          </div>
        </div>
        <div className='m-list-timeline__item'>
            <span className='m-list-timeline__badge m-list-timeline__badge--success' style={{position: 'initial'}}></span>
            <div className='row' style = {{padding: '5px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '2px 5px #ccc', width: 'max-content', marginLeft: '-420px'}}>
            <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
              <label>
                <input typeName='checkbox' checked name='' />
                <span></span>
              </label>
            </span>
            <span className='m-list-timeline__text' style={{width: '300px', marginTop: '6px', marginLeft: '10px'}}>Message 1</span>
            <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>10</span>
            <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>5</span>
            <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>2</span>
            <span className='m-list-timeline__text' style={{width: '100', marginTop: '6px'}}>Delete</span>
        </div>
      </div>
    </div>
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

function mapStateToProps (state) {
  console.log(state)
  return {
    sequences: (state.sequenceInfo.sequences)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllSequence: fetchAllSequence,
    createSequence: createSequence
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSequence)
