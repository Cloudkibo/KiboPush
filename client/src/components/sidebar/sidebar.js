/* eslint-disable camelcase */
/**
 * Created by sojharo on 20/07/2017.
 */

import React, {Component} from 'react'
import Joyride from 'react-joyride'
import { Link } from 'react-router'
import ReactTooltip from 'react-tooltip'
import Icon from 'react-icons-kit'
import {ModalContainer, ModalDialog} from 'react-modal-dialog'
import UserGuide from '../../containers/userGuide/userGuide'
import { question } from 'react-icons-kit/icomoon'   // userGuide
import { dashboard } from 'react-icons-kit/fa/dashboard'  // dashboard
import { bullhorn } from 'react-icons-kit/fa/bullhorn'  // broadcats
import { listAlt } from 'react-icons-kit/fa/listAlt'  // poll
import { facebook } from 'react-icons-kit/fa/facebook'  // pages
import { ic_replay_30 } from 'react-icons-kit/md/ic_replay_30' // workflows
import { facebookSquare } from 'react-icons-kit/fa/facebookSquare' // subscribe
import { pencilSquareO } from 'react-icons-kit/fa/pencilSquareO'   // Autoposting
import { connect } from 'react-redux'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'

class Sidebar extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      steps: []
    }
    this.openUserGuide = this.openUserGuide.bind(this)
    this.closeUserGuide = this.closeUserGuide.bind(this)
    this.showOperationalDashboard = this.showOperationalDashboard.bind(this)
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
  }
  componentWillMount () {
    this.props.getuserdetails()
  }
  componentDidMount () {
    this.addSteps([
      {
        title: 'Dashboard',
        text: 'The Dashboard provides you with a summary of information regarding your pages',
        selector: 'li#dashboard',
        position: 'top-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Growth Tools',
        text: 'The growth tools allow you to upload csv files of customers, to integrate with messenger',
        selector: 'li#growthTools',
        position: 'left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Subscribers',
        text: 'It allows you to see the list of subscribers',
        selector: 'li#subscribers',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Conversation',
        text: 'Allow you to broadcast a totally customizable message to your subscribers',
        selector: 'li#convos',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},

      {
        title: 'Auto-Posting',
        text: 'Details of Auto-Posting',
        selector: 'li#autoposting',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Polls',
        text: 'Allows you to send Polls to your subscribers',
        selector: 'li#polls',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},

      {
        title: 'Surveys',
        text: 'Allows you to send multiple polls',
        selector: 'li#surveys',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Workflows',
        text: 'Workflows allow you to auto-reply to certain keywords or messages to your page',
        selector: 'li#workflows',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},

      {
        title: 'Pages',
        text: 'Allows you to connect or disconnect pages',
        selector: 'li#pages',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},

      {
        title: 'UserGuide',
        text: 'Still confused? Check our User Guide',
        selector: 'li#userguide',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true}

    ])
  }
  openUserGuide () {
    this.setState({isShowingModal: true})
  }

  closeUserGuide () {
    this.setState({isShowingModal: false})
  }
  showOperationalDashboard1 () {
    //  abc
    if (this.props.user) {
      if (this.props.user.isSuperUser) {
        return (
          <li>
            <Link to='/operationalDashboard'>
              <div data-toggle='tooltip' data-placement='right' title='' data-original-title='operationalDashboard' style={{paddingRight: 20}}>
                <img class='icon icons8-Home' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFl0lEQVRoQ+2Za0xTZxjHn95bLqe1lGKBUkQ0azFiqejcNEE3iRi6iGYzmjFjMLrNacyi2ZZlW7It2RK3uLkZI84Zpwv6RTSgDIRJpsuG4yIOq2IZrfRKL7SlUM5p6VlODcReLG1tjWztx57n9nuf//s+50KC/8iPlGiOW5s2fe3Fcc+S8+ffS2SuhIF0y+UVFBrt+2yxeB6QSLhWoVB53e53ShoamhIBFHeQnrIyDrDZ9UhWlixbLE6fKtrrdoNBqRx1GI1dYLdXSdvbbfEEiivIzaqqd8k02vui4uJMekpKyDqx8XFQ9/aa3Cj6hezixUPxgokLSFd5uYyKIMf5BQVFHIGAHklxNr0eM/T3K73j42/IWlq6IvEJZ/NEIISMcASpTeVyX8qVSLhkGs0vl9NiAZ3Z6vsvm8eFtIwMv+uE3DQKhXXMam0jORw7n0RuMYN0b9hQTWcwPs4RiwuZbLZfgYR8tA+GwFv6AjBeq/Zdmzh5FCi3b0GOSAiBspuw2XDt3bsDGIp+WnLhwulYuhM1yB9lZfkMBKnnCoULswoLgzbCsEYDdgodGDv3Apk/178DwwZAaw8D24MBX5gbVK9RqRy3DA3dwxyOjSva21XRAEUF0i2XH2YhyOa84mJ+KBnph81Af70GKEuWhq1h8mYnYGdOgIDPCym3B729wy6H41xJQ8PeSGEiAumsrCwnZkKuRFKQxuNRHg1O6FytHIBJ8WJg1rwdaV7Ax5yAnv0JKIpeEC0ohKCFMZsntQrFgMft3rO0sbFlpsBhQXwySk+v5QgEywRisf9GAACLwQDmMRew9n0QJKOZEk/PF6MeXN9+CbwUFmQI/KVI2Ojv3LGP6HR/Yk7nm+Hk9liQ7oqKjxgcTk3uokWioM1pt8OQVg+0qs1AXbk60prD2nmuXwV3/TkQ5ggg1OGh6etToTbbjyVNTZ+FChQE0lFevobGYn2TW1RUmJ6ZyQqUkUatBlQgBGbNbiClpsUFYioIIbeJE0eAoRuC3HxRkNxGTSaX5vZtpdvl2re8peXXR5NPgxAzwctinWLn5CwXLFyYFajZEZMZLKgbaNU7gFKwIK4AgcG8A/cBO3McMug0mMPPDJo9+v5+o12r7SC7XNumZo8PpLOyciuVwfh8nlQqoqemkh/19N1SDKqBvLIMGBu3JBQgMDh6vg6816+CaF5+0OzBxsa8qu5uFYaiH5ZeunTWB9Illysla9bMDwykU6nBmYoAa8+BuMso0hUh5Ob67iCkjTkgO18U5PbPjRvNRXV160KCOG020JnMQN9aA9TF0khzJtTOc6sHsJ9PQDYxezic6VwhQQgZDQ6qcXKxjMTatjOhhcUa3HWqFsh/93iFIiGZOE2DQHh5eRkGo2VQXb1fIl0tY8Sa6Gn46frujTMOfdIv4PPynVZrx7S0OtevrydRqcfqKg5MSCXCpmVSEfNpFBRrDq3B5mxs65NvaTrIxD2eXUsvX67ymyP7j14rm00gX721qn1qMZIgscoiHn5T0kp2JB6rGY8YCeuIpaMRzH/9ElONvNJ1kLG8MirfhIEYLh+DQtoIzM3yv8GLpLrrGg/MXb8rEtNpmyTITMuV7AgAJKXV1ieP+xxJSisprYd3v0lpPe4Y/l/uEYPRBBjmhjxhtm9dZu3x29z6G1hHbLDl1VdmNwgBQfy4cx6+CZm1HQncZ0mQ5PEb5hb4mTx+S0vmN4tEvIg+MU+xOVt/gCKWPaYHqzYVBmkv75jpScHv+ujoBNrc2rsu7GRf8fxzLUwkxf878wxp8GsnQZY+GhPIJeUEkFZtjwqEguOe1is9a5Mgj1u2Z64jB478viRHyD3NRlIno+k1a+BKJuK4z6FQmXg0foTtSIrQ7pq/1hSNH4qi+IByePvB3S/eDPnKNJpgz5rtv18IxmAHP13mAAAAAElFTkSuQmCC' />
              </div>
              <span className='left-menu-title'>Operational Dashboard</span>
            </Link>
          </li>
        )
      } else {
        return (null)
      }
    }
  }
  addSteps (steps) {
    // let joyride = this.refs.joyride

    if (!Array.isArray(steps)) {
      steps = [steps]
    }

    if (!steps.length) {
      return false
    }
    var temp = this.state.steps
    this.setState({
      steps: temp.concat(steps)
    })
  }

  addTooltip (data) {
    this.refs.joyride.addTooltip(data)
  }

  showOperationalDashboard () {
    if (this.props.user) {
      if (this.props.user.isSuperUser) {
        return (
          <li>
            <Link to='/operationalDashboard' data-toggle='tooltip' data-for='operationalDashboard' data-tip>
              <div style={{paddingRight: 20}}>
                <img class='icon icons8-Home' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFl0lEQVRoQ+2Za0xTZxjHn95bLqe1lGKBUkQ0azFiqejcNEE3iRi6iGYzmjFjMLrNacyi2ZZlW7It2RK3uLkZI84Zpwv6RTSgDIRJpsuG4yIOq2IZrfRKL7SlUM5p6VlODcReLG1tjWztx57n9nuf//s+50KC/8iPlGiOW5s2fe3Fcc+S8+ffS2SuhIF0y+UVFBrt+2yxeB6QSLhWoVB53e53ShoamhIBFHeQnrIyDrDZ9UhWlixbLE6fKtrrdoNBqRx1GI1dYLdXSdvbbfEEiivIzaqqd8k02vui4uJMekpKyDqx8XFQ9/aa3Cj6hezixUPxgokLSFd5uYyKIMf5BQVFHIGAHklxNr0eM/T3K73j42/IWlq6IvEJZ/NEIISMcASpTeVyX8qVSLhkGs0vl9NiAZ3Z6vsvm8eFtIwMv+uE3DQKhXXMam0jORw7n0RuMYN0b9hQTWcwPs4RiwuZbLZfgYR8tA+GwFv6AjBeq/Zdmzh5FCi3b0GOSAiBspuw2XDt3bsDGIp+WnLhwulYuhM1yB9lZfkMBKnnCoULswoLgzbCsEYDdgodGDv3Apk/178DwwZAaw8D24MBX5gbVK9RqRy3DA3dwxyOjSva21XRAEUF0i2XH2YhyOa84mJ+KBnph81Af70GKEuWhq1h8mYnYGdOgIDPCym3B729wy6H41xJQ8PeSGEiAumsrCwnZkKuRFKQxuNRHg1O6FytHIBJ8WJg1rwdaV7Ax5yAnv0JKIpeEC0ohKCFMZsntQrFgMft3rO0sbFlpsBhQXwySk+v5QgEywRisf9GAACLwQDmMRew9n0QJKOZEk/PF6MeXN9+CbwUFmQI/KVI2Ojv3LGP6HR/Yk7nm+Hk9liQ7oqKjxgcTk3uokWioM1pt8OQVg+0qs1AXbk60prD2nmuXwV3/TkQ5ggg1OGh6etToTbbjyVNTZ+FChQE0lFevobGYn2TW1RUmJ6ZyQqUkUatBlQgBGbNbiClpsUFYioIIbeJE0eAoRuC3HxRkNxGTSaX5vZtpdvl2re8peXXR5NPgxAzwctinWLn5CwXLFyYFajZEZMZLKgbaNU7gFKwIK4AgcG8A/cBO3McMug0mMPPDJo9+v5+o12r7SC7XNumZo8PpLOyciuVwfh8nlQqoqemkh/19N1SDKqBvLIMGBu3JBQgMDh6vg6816+CaF5+0OzBxsa8qu5uFYaiH5ZeunTWB9Illysla9bMDwykU6nBmYoAa8+BuMso0hUh5Ob67iCkjTkgO18U5PbPjRvNRXV160KCOG020JnMQN9aA9TF0khzJtTOc6sHsJ9PQDYxezic6VwhQQgZDQ6qcXKxjMTatjOhhcUa3HWqFsh/93iFIiGZOE2DQHh5eRkGo2VQXb1fIl0tY8Sa6Gn46frujTMOfdIv4PPynVZrx7S0OtevrydRqcfqKg5MSCXCpmVSEfNpFBRrDq3B5mxs65NvaTrIxD2eXUsvX67ymyP7j14rm00gX721qn1qMZIgscoiHn5T0kp2JB6rGY8YCeuIpaMRzH/9ElONvNJ1kLG8MirfhIEYLh+DQtoIzM3yv8GLpLrrGg/MXb8rEtNpmyTITMuV7AgAJKXV1ieP+xxJSisprYd3v0lpPe4Y/l/uEYPRBBjmhjxhtm9dZu3x29z6G1hHbLDl1VdmNwgBQfy4cx6+CZm1HQncZ0mQ5PEb5hb4mTx+S0vmN4tEvIg+MU+xOVt/gCKWPaYHqzYVBmkv75jpScHv+ujoBNrc2rsu7GRf8fxzLUwkxf878wxp8GsnQZY+GhPIJeUEkFZtjwqEguOe1is9a5Mgj1u2Z64jB478viRHyD3NRlIno+k1a+BKJuK4z6FQmXg0foTtSIrQ7pq/1hSNH4qi+IByePvB3S/eDPnKNJpgz5rtv18IxmAHP13mAAAAAElFTkSuQmCC' />
              </div>
            </Link>
            <ReactTooltip place='right' type='dark' effect='float' id='operationalDashboard'>
              <span>Operational Dashboard</span>
            </ReactTooltip>
          </li>
        )
      } else {
        return (null)
      }
    }
  }
  render () {
    return (
      <div className='fixed-sidebar'>
        <Joyride ref='joyride' run steps={this.state.steps} scrollToSteps debug={false} type={'continuous'} showStepsProgress showSkipButton />
        <div className='fixed-sidebar-left sidebar--small' id='sidebar-left'>
          <Link to='/dashboard' className='logo'>
            <img src='img/logo.png' alt='Olympus' />
          </Link>

          <div className='mCustomScrollbar' data-mcs-theme='dark'>
            <ul className='left-menu'>
              <li>
                <a className='js-sidebar-open'>
                  <svg className='olymp-menu-icon left-menu-icon' >
                    <use xlinkHref='icons/icons.svg#olymp-menu-icon' />
                  </svg>
                </a>
              </li>
              {this.showOperationalDashboard()}
              <li id='dashboard'>
                <Link to='/dashboard' data-toggle='tooltip' data-for='dashboard' data-tip>
                  <div style={{paddingRight: 20}}>

                    <img class='icon icons8-Home' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFl0lEQVRoQ+2Za0xTZxjHn95bLqe1lGKBUkQ0azFiqejcNEE3iRi6iGYzmjFjMLrNacyi2ZZlW7It2RK3uLkZI84Zpwv6RTSgDIRJpsuG4yIOq2IZrfRKL7SlUM5p6VlODcReLG1tjWztx57n9nuf//s+50KC/8iPlGiOW5s2fe3Fcc+S8+ffS2SuhIF0y+UVFBrt+2yxeB6QSLhWoVB53e53ShoamhIBFHeQnrIyDrDZ9UhWlixbLE6fKtrrdoNBqRx1GI1dYLdXSdvbbfEEiivIzaqqd8k02vui4uJMekpKyDqx8XFQ9/aa3Cj6hezixUPxgokLSFd5uYyKIMf5BQVFHIGAHklxNr0eM/T3K73j42/IWlq6IvEJZ/NEIISMcASpTeVyX8qVSLhkGs0vl9NiAZ3Z6vsvm8eFtIwMv+uE3DQKhXXMam0jORw7n0RuMYN0b9hQTWcwPs4RiwuZbLZfgYR8tA+GwFv6AjBeq/Zdmzh5FCi3b0GOSAiBspuw2XDt3bsDGIp+WnLhwulYuhM1yB9lZfkMBKnnCoULswoLgzbCsEYDdgodGDv3Apk/178DwwZAaw8D24MBX5gbVK9RqRy3DA3dwxyOjSva21XRAEUF0i2XH2YhyOa84mJ+KBnph81Af70GKEuWhq1h8mYnYGdOgIDPCym3B729wy6H41xJQ8PeSGEiAumsrCwnZkKuRFKQxuNRHg1O6FytHIBJ8WJg1rwdaV7Ax5yAnv0JKIpeEC0ohKCFMZsntQrFgMft3rO0sbFlpsBhQXwySk+v5QgEywRisf9GAACLwQDmMRew9n0QJKOZEk/PF6MeXN9+CbwUFmQI/KVI2Ojv3LGP6HR/Yk7nm+Hk9liQ7oqKjxgcTk3uokWioM1pt8OQVg+0qs1AXbk60prD2nmuXwV3/TkQ5ggg1OGh6etToTbbjyVNTZ+FChQE0lFevobGYn2TW1RUmJ6ZyQqUkUatBlQgBGbNbiClpsUFYioIIbeJE0eAoRuC3HxRkNxGTSaX5vZtpdvl2re8peXXR5NPgxAzwctinWLn5CwXLFyYFajZEZMZLKgbaNU7gFKwIK4AgcG8A/cBO3McMug0mMPPDJo9+v5+o12r7SC7XNumZo8PpLOyciuVwfh8nlQqoqemkh/19N1SDKqBvLIMGBu3JBQgMDh6vg6816+CaF5+0OzBxsa8qu5uFYaiH5ZeunTWB9Illysla9bMDwykU6nBmYoAa8+BuMso0hUh5Ob67iCkjTkgO18U5PbPjRvNRXV160KCOG020JnMQN9aA9TF0khzJtTOc6sHsJ9PQDYxezic6VwhQQgZDQ6qcXKxjMTatjOhhcUa3HWqFsh/93iFIiGZOE2DQHh5eRkGo2VQXb1fIl0tY8Sa6Gn46frujTMOfdIv4PPynVZrx7S0OtevrydRqcfqKg5MSCXCpmVSEfNpFBRrDq3B5mxs65NvaTrIxD2eXUsvX67ymyP7j14rm00gX721qn1qMZIgscoiHn5T0kp2JB6rGY8YCeuIpaMRzH/9ElONvNJ1kLG8MirfhIEYLh+DQtoIzM3yv8GLpLrrGg/MXb8rEtNpmyTITMuV7AgAJKXV1ieP+xxJSisprYd3v0lpPe4Y/l/uEYPRBBjmhjxhtm9dZu3x29z6G1hHbLDl1VdmNwgBQfy4cx6+CZm1HQncZ0mQ5PEb5hb4mTx+S0vmN4tEvIg+MU+xOVt/gCKWPaYHqzYVBmkv75jpScHv+ujoBNrc2rsu7GRf8fxzLUwkxf878wxp8GsnQZY+GhPIJeUEkFZtjwqEguOe1is9a5Mgj1u2Z64jB478viRHyD3NRlIno+k1a+BKJuK4z6FQmXg0foTtSIrQ7pq/1hSNH4qi+IByePvB3S/eDPnKNJpgz5rtv18IxmAHP13mAAAAAElFTkSuQmCC' />

                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='dashboard'>
                  <span>Dashboard</span>
                </ReactTooltip>
              </li>
              <li id='growthTools'>
                <Link to='/growthTools' data-for='growthTools' data-tip>
                  <div style={{paddingRight: 20}}>
                    <img class='icon icons8-Line-Chart' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEiklEQVR4Xu1bOWzUWBj+3njGExGOBIVDYsMRQBwCgdiFDWI5tcVScEikSGhCkKiIRDF0FAsFXSIoQrXSBhrYIhSEIrsFhxCIcChixQqECBAgSFxKIg4pY49t9L+RZ+3MYXuOMPa8V3nsZ7////7vv+w3DBU+WIXrDwGAYECFIyBcoMIJIIJgRhfoPNx9CsBeMCwMBEMMDIHhbKyr7cREfdIA6GjvPs2AI4FQPF2JE7GutuPW02kAdLZ3jwKo+al5G6bVTQ8EDp8/fsL9v64DBoZiZ9oWOQFg0ITt7bsDobypxLWuXn4Y62qzGT0TA9IAuEfogWF989YUKH47VxAA5s1WVvjtnACgcBcA1jdvm+AC/jlXEAOCEA0FAF5dwA9Wn1o3PeWWlJW+fPxkE3tq3YxU5vLMAD8AoNfWQNm9k4sqX+5DaGTMJrY+swbKruT1qnMXvNUB460tfsDAtYwCAMEA4QIiBnhqhkQQ9EEWCN8dgPRqGFBVaIsXIbFhXdasELgsQMqHHz9BJCpxpdW4hsSKZVlBCBwA0QsXITMNB442cgDOdvRDMSTEW/ZlZEHwADjfg6hkoDX2M1f4j5O3YEQiiO9vqgwAIldvQHr9BnJVmCusjCeQWLMKibWrgw8AGxmD/M8VMEXhVqehrVyWVfmy7AVSEZyEX9rAredmMEVF5O8rCI2OItGwEInNG93cVl7NkBnBrZLnoq91XuRmP6RnL0CdoPrbrzDkJAOcRlkFQYrgRN9Dxzb9H8CqqxFvyv0qXhp8gcitfk57hZSfWeOkd+p6eQFwvgdMVe0A5IjgpIXV79VNjdCW2L5vOAJRNgBIVLzcHcgocLKa+zGN1vn6vXWRsgDA9F8SjAIYpTEewevn8WNihV5bC/WXRhu98/X7ogMQ/vc/SE+fJ4XOM3KT/6qbN0Kvn2djAVE8cvM2QqNjMGQZ+pzZkF4P82Mz3Xn1+6ICEH7wEASArfbOUXiYi1t9V6+eAnXH1qzBi6gu3bmP8PMhfrt1LWKJumOLo69nm1CwC0R7eiEnxu21d7gqZ+SmqB2+N8AtqM+ZlVTeRdryWue7QaVwACbU3uc67/DyU5s7G/qSBuj1P0B68JDnaBr0RlZ6+54feylYaH40w1pxjWWt80sOAFFT7u0D+/rVVntnWthKW7qeT8oyCyW3dX5JAbCmIPJh+k00JqtrK5cj9GoY0uAzhN594D7rtj11EppijvToSXKt+fU5X3Y4PYuu5+UCNuUdSk+55xKqNMXWnhJgStMeN/KVfI5nAOItTammw03dbWaJYtK2mKh4BoAKEuq43ChvCkoghAaTdQK5SLbevJiKuX2WZwC4Eh47LrfCfI95ngEIkvJ5BUGKAW6Klu9hzXzW9MwA8WHEBx9GvDBBMMDt5/GOw3+OMcZmxHft9PTKyYs1JnsudaTRy30wDOPl0TMHbRvAM+0Upc3Ev0+2kJO0nvNmaRKks737uGEYBxhjCyZJsJIuQ5ZnjNF2edtOcVpU/GWmpND74OGCAT4wUklFFAwoKbw+eLhggA+MVFIRvwHnc1RuhuptKgAAAABJRU5ErkJggg==' />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='growthTools'>
                  <span>Growth Tools</span>
                </ReactTooltip>
              </li>
              <li id='subscribers'>
                <Link to='/subscribers' data-for='subscribers' data-tip>
                  <img class='icon icons8-Business-Building' width='30' height='30' src='data:image/png;base64,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' />
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='subscribers'>
                  <span>Subscribers</span>
                </ReactTooltip>
              </li>

              <li>
                <Link to='/live' data-for='live' data-tip>
                  <img class='icon icons8-Business-Building' width='30' height='30' src='data:image/png;base64,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' />
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='live'>
                  <span>Live Chat</span>
                </ReactTooltip>
              </li>

              <li id='convos' >
                <Link to='/convos' data-for='broadcasts' data-tip>
                  <div style={{paddingRight: 20}}>
                    <img class='icon icons8-Advertising' width='30' height='30' src='data:image/png;base64,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' />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='broadcasts'>
                  <span>Conversations</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/autoposting' data-for='autoposting' data-tip>
                  <div style={{paddingRight: 20}}>
                    <img class='icon icons8-Forward-Message' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD30lEQVRoQ+1YXUxSYRh+zkCT0NQ0rXAJK0RKnajLrbjQLrpryn1ruVy3rvsuuy/va6vWvU7v2lpd0JZuiikJig1oUGn+poYp+LX30CkFDnAOB8SN9wrG9z3f+zzP+77fOXA45sEd8/xRIHDUDhYcyEsHHC6vHlzkMYBWAPocJ+kDMAWmemAxG+hz0ogroZejb63Fau61yVCnSbU5m7/PeQOh3TC7eedWtz3ZOXEEBl8N+b8tr1zQ1VbjanMjitXqbOYZh70bDmN8xo3g4jLOVVd9Gbhtq5dEYOTdh61xp0sbDkdQVKSG1dKEmtMVOSGxtLoOu8OJvb0w1GoVOppMS71d12olEXC4F9h26DfGpmfxY22D39tkNODKxaRCZEzw02c/nB4vj3OmshydLZeh1ZyApfFS0kkZ9yMRELIhQAKmqDilhdXSwoMqGSSW3TGN9Z/bPCwJRYIJkREBAiFbx6bd+LWzw5cU9UVdTbUiHLzBRTjcHr5kTpaUwNrehMqy0kPYGRMgNGqssWkXvi6t8OAG3Vm0mi/JbnDCm3ItwBv8zuOdr6lCZ4s5IZ4iBARJSLFJ1zyowbWaElxvi1cslTVrm1t4P+nEdmiHb9Q2cwMMOvE+VZQAJUcJkBsbm9GatZiNaKjXpcqb/33eH4TD5eE/l5dpedVjSyYWSHECwgGTLg88/iD/lcYsuSF2Z1DJkOrUTxTGeh3azMa0SGeNAJ0eWFrm3Uh2Z8TOdlJdyhDIKgGhwe0TM//ujAa9DpbGqLo0YeZ9UZdotlvbmyU3ftYJCHUw5w/wk4WC7gwKYbbTxDLV16VVMjnrgUTZUIPbJ5z8nUEhNtulMMmZA0JS1LCO2agTlsvS7grfYAD6gcNO5ZyAFHVj1070OFF1oxL6gf9j+dgRIFIagwamR3qoSlWZPcxloqacveSAEAKJjg6T/KdROUlksucgAcJRaVXY2wxb7ntsU2K4SR+nM0kmdu/KmzUsjq4i5A1Jg2VY32esW4xEHIFJ98I6B5RLO0V8dWQrgrmHPumJx0By+6zvnsf2PPakRA4MA+hRisDswAJCvui9kGkkIhFPwOXVMy4ypYQLiyPLCDyLPvMrEWkRoIP+/i/0hDG0chxkvwxnW33KNat/LT41Df97v5brAGNsgzF0pd3Ecg9KtE+MwP4+SzgaY9enSv7IHOif603o/CECjH1U7aKrz2eLvgWJxJGUUEoCaSafnw4w9qJ/3nY33VLOLwcahp5LST7vHEhX9YPr8sqBAgE5CiTbI3YPiE0hOedntYTkJCR1T4GAVMWUXl9wQGlFpeIVHJCqmNLr/wCxmeJArsjLJQAAAABJRU5ErkJggg==' />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='autoposting'>
                  <span>Autoposting</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/poll' data-for='poll' data-tip>
                  <div style={{paddingRight: 20}}>
                    <img class='icon icons8-List-View' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA0ElEQVRoQ+2azQ1AQBCFbQNuClGBDhSrAxUoxE0DxEHCJngjk91sfG545ue92XkXoSr8CoXXX9FAbgUfFRjmZc1d4J6/b+rbOmkghUIokILlpxwoELPTj9Pl0dC1l/v4vapgHOf4zl0BGriRBAViYnBi9fS+4NwPsVNdchgawAfEYWGNqmu0eCcWJ8INxhZyo/JjIBTAB8TRwQfwAXFUrDC2kJUxbzwK4APiTOED+IA4KlYYW8jKmDceBbwZtcb7rwJWpnLg+dUgB+vnnMUrsAFNFwBAH0J/4QAAAABJRU5ErkJggg==' />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='poll'>
                  <span>Polls</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/surveys' data-for='surveys' data-tip>
                  <img class='icon icons8-Survey' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAB50lEQVRYR2NkoBJw6zh2nvE/ox7IuP9MDAd3lVs6UcNoRmoY4tZ+/AQDA4PGv79/fUDmMTEzb/nPwHBhd6WlA6XmY3WgT/fJpb///osixfC/f/7a7qmxOQLS49JyxIaZhfkwKfpZmZmWbSk1j0bXg9WB7h3H/+eHmOM0f+KakwyBLmZw+Y37zjB8ZGJVOFZi9BDmQA5O9kM+9kZw89fvOcVAyMydFZYY7qGKA6/cfvLv/pMXX3/+/O0FciA7O+s2BRlxHl1VWdo70FMZ0w8enSdQQhDkqOt3nzLcf/ISHKqKMuIMmsrSKDEACsEd5RYYsbL97n+wGChWyApBbA4M6D/NYGmoySDAy0VUMvvw+RvDxau3GJZlG9HHgZcefWLo2HyH4d2XX0Q5UIiHjaHCV4VBT46PPg4kylVEKqJJFBNpN1HKRh1IVDDhUTQagqMhiC0EkOti9IIaVIvAALaagdQQpXoaxObAuOnnGF59Ilxoi/GxMSzKRK1N6OJAUkMNWT3VHUiJY7DpHXUgpSE6GoKDLgRHy0G0KCHYaRpyNQmlaQ5d/2gupjRER0NwNARJbbBSGmKjuXjQhSC1HYTLPLJHtwalA726Ti77++9fJL0cB7KHmYlp+bYyc4xhZ6oMotPSI4PegQB/a844XdCD1wAAAABJRU5ErkJggg==' />
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='surveys'>
                  <span>Surveys</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/workflows' data-for='workflows' data-tip>
                  <div style={{paddingRight: 20}}>
                    <img class='icon icons8-Workflow' width='30' height='30' src='data:image/png;base64,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' />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='workflows'>
                  <span>Workflows</span>
                </ReactTooltip>
              </li>
              <li>
                <Link to='/subscribeToMessenger' data-for='subscribe' data-tip>
                  <div style={{paddingRight: 20}}>
                    <img class='icon icons8-Facebook-Messenger' width='30' height='30' src='data:image/png;base64,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' />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='subscribe'>
                  <span>Subscribe to Messenger</span>
                </ReactTooltip>
              </li>
              {
                /*
                     <li>
                <Link to='/stats' data-for='stats' data-tip>
                  <svg className='olymp-stats-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-stats-icon' />
                  </svg>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='stats'>
                  <span>Analytics</span>
                </ReactTooltip>
              </li>

                */
              }

              <li>
                <Link to='/pages' data-for='pages' data-tip>
                  <div style={{paddingRight: 20}}>
                    <img class='icon icons8-Facebook' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEm0lEQVR4Xu1bS2wbVRQ9M2OPna/jhsZKk37SpqpSBZJWpVBA7QaEBFLVDRtWMUsoaiBpF5UqQAgWtFFTEVggUXePqNjABglEJJBaCWFLleiHijiNaRKcJk4c27E9M9UdMsFJPJ9O7GTGnrexPfPe+J7zzr33/YZBlRemyvHDIcBRQJUz4LiAEQFc7g81iXmckSScYhj0GmmzVXUkCWGGwXesC1feGw7O6dmhq4DPzn4zyC2lPoUouvUeZqn7LJsTPLXnz11845KWXZoEyODTyYv0gLx/G7JtOyE0+iyFc60x3HwCfOwBXLOP5FtCTf1ZLRJUCZBlL3LTEAV3pvMAci0BSwNfa5xnPAp+IgqwXI5lhRY1d1AlYOh06EMAH1DPp7u6bQVeMbb2Vhjc/Dz9/GhgJEh41hVVAi69E/qDAl6qu8fyslfrHXKH2lsRUGAc/CJ46IkIGDodkqjBwgvHV9rVRX6HJDFI9R62zbWG30ZlWwdGgkU7W8sFZAKme46C9/LgOBbKwwpJseo1QRCRzWTRErm5MQKi+3tWenv3vYj83Y7XTCugEGzr+B2ZgIe7DqyQYvVrSqeVhAA7pgKHgGW3dRRgNgsUxgDHBTaJgdpkAp5UEnw2A286uepfs3wNRI6Tr6XqfVhoekrTKlvFAG96Ec2T43Dls4apnmrvRKamTrW+bQhomItj278xGQhfx6P3aCvaO/xo61g9+1zK5BF/uIjRH+4hPrmIiiCgcS4O/zL4rpf24uVXd+oq4PrXYcTGEvYnwL2Uxo7xuzLgYycP4siz23XBU4WKISAwcV8OdIeP78aLr+wxBL5iCFB6n/dw6Bt8Hh6vq7oIaJqZhO/RFJ451oYTr3Wqgo+NrV/bHP3+PuKTSXvHgMDEX6DU9/qb3djb1byOgJs/R3HjpzFNVdg6C7RG74LPptH3/nNo8HtXASXgRACVrMcLkf1v8FNY8i43Zlvai95T6ll6HKAY9+7HJ9aBuzZ0AwtzGcxub8O8zmhPSyK2JeDzC7/IuDY6F3EIsPJ0WMsFKkYBSqDT8tNiMUAhQKtdpqYeU+37rD0bVHq5HATkXG7803HQHgQU62XDw741FWN/J3D9alieBtM4wNJZQMvPzRKgjBEoPVKarDoCfvz2T9wOTxsaI2x5GiyHAoxOhUkZFUnAV5/8CloZerCvW3MYbCkCSp0FBIbFROfTumFkyxVAW2f8UkbTUDPjACMB0BIKMBKhtQhw5gIFu9O6ei9SYctdwFGABgNVMRlyFOAoQJ0BxwWWV2ucNFhkUdQCK0JXwwDTo7fubiY3r12yLpcCaM+B9h4AKTIw8lbRU+66R2UX6xoR39GxEZyqbcsdA5R9R1NHZemwtJCTxhiG8c0EdiHZ6C85CeUkgLbcaOtNkqQE52b2PPFhaUI79HaoDyxC9J0WIBPNAfmzVKUcBNBOs29m6v+jNSKCA18Gr6nZrPvCBJEgMdIwKaFUwDfjOdTzjMT0a4EnO3QJoErLr8z0A9IpCoybAcD8f0gRgKFXZoZL8sqMeUPs0dKQAuwBxZyVDgHmeKucVo4CKqcvzSF5DB/TeW5B71D9AAAAAElFTkSuQmCC' />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='pages'>
                  <span>Pages</span>
                </ReactTooltip>

              </li>
              <li>
                <Link onClick={this.openUserGuide} data-for='userGuide' data-tip target='_blank'>
                  <div style={{paddingRight: 20}}>
                    <img class='icon icons8-Help' width='30' height='30' src='data:image/png;base64,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' />
                  </div>
                </Link>
                <ReactTooltip place='right' type='dark' effect='float' id='userGuide'>
                  <span>User Guide</span>
                </ReactTooltip>
              </li>
            </ul>
          </div>
        </div>

        <div className='fixed-sidebar-left sidebar--large' id='sidebar-left-1'>
          <Link to='02-ProfilePage.html' className='logo'>
            <img src='img/logo.png' alt='Olympus' />
            <h6 className='logo-title'>olympus</h6>
          </Link>

          <div className='mCustomScrollbar' data-mcs-theme='dark'>
            <ul className='left-menu'>
              {this.showOperationalDashboard1()}
              <li>
                <Link to='/dashboard'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Dashboard' style={{paddingRight: 20}}>
                    <img class='icon icons8-Home' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFl0lEQVRoQ+2Za0xTZxjHn95bLqe1lGKBUkQ0azFiqejcNEE3iRi6iGYzmjFjMLrNacyi2ZZlW7It2RK3uLkZI84Zpwv6RTSgDIRJpsuG4yIOq2IZrfRKL7SlUM5p6VlODcReLG1tjWztx57n9nuf//s+50KC/8iPlGiOW5s2fe3Fcc+S8+ffS2SuhIF0y+UVFBrt+2yxeB6QSLhWoVB53e53ShoamhIBFHeQnrIyDrDZ9UhWlixbLE6fKtrrdoNBqRx1GI1dYLdXSdvbbfEEiivIzaqqd8k02vui4uJMekpKyDqx8XFQ9/aa3Cj6hezixUPxgokLSFd5uYyKIMf5BQVFHIGAHklxNr0eM/T3K73j42/IWlq6IvEJZ/NEIISMcASpTeVyX8qVSLhkGs0vl9NiAZ3Z6vsvm8eFtIwMv+uE3DQKhXXMam0jORw7n0RuMYN0b9hQTWcwPs4RiwuZbLZfgYR8tA+GwFv6AjBeq/Zdmzh5FCi3b0GOSAiBspuw2XDt3bsDGIp+WnLhwulYuhM1yB9lZfkMBKnnCoULswoLgzbCsEYDdgodGDv3Apk/178DwwZAaw8D24MBX5gbVK9RqRy3DA3dwxyOjSva21XRAEUF0i2XH2YhyOa84mJ+KBnph81Af70GKEuWhq1h8mYnYGdOgIDPCym3B729wy6H41xJQ8PeSGEiAumsrCwnZkKuRFKQxuNRHg1O6FytHIBJ8WJg1rwdaV7Ax5yAnv0JKIpeEC0ohKCFMZsntQrFgMft3rO0sbFlpsBhQXwySk+v5QgEywRisf9GAACLwQDmMRew9n0QJKOZEk/PF6MeXN9+CbwUFmQI/KVI2Ojv3LGP6HR/Yk7nm+Hk9liQ7oqKjxgcTk3uokWioM1pt8OQVg+0qs1AXbk60prD2nmuXwV3/TkQ5ggg1OGh6etToTbbjyVNTZ+FChQE0lFevobGYn2TW1RUmJ6ZyQqUkUatBlQgBGbNbiClpsUFYioIIbeJE0eAoRuC3HxRkNxGTSaX5vZtpdvl2re8peXXR5NPgxAzwctinWLn5CwXLFyYFajZEZMZLKgbaNU7gFKwIK4AgcG8A/cBO3McMug0mMPPDJo9+v5+o12r7SC7XNumZo8PpLOyciuVwfh8nlQqoqemkh/19N1SDKqBvLIMGBu3JBQgMDh6vg6816+CaF5+0OzBxsa8qu5uFYaiH5ZeunTWB9Illysla9bMDwykU6nBmYoAa8+BuMso0hUh5Ob67iCkjTkgO18U5PbPjRvNRXV160KCOG020JnMQN9aA9TF0khzJtTOc6sHsJ9PQDYxezic6VwhQQgZDQ6qcXKxjMTatjOhhcUa3HWqFsh/93iFIiGZOE2DQHh5eRkGo2VQXb1fIl0tY8Sa6Gn46frujTMOfdIv4PPynVZrx7S0OtevrydRqcfqKg5MSCXCpmVSEfNpFBRrDq3B5mxs65NvaTrIxD2eXUsvX67ymyP7j14rm00gX721qn1qMZIgscoiHn5T0kp2JB6rGY8YCeuIpaMRzH/9ElONvNJ1kLG8MirfhIEYLh+DQtoIzM3yv8GLpLrrGg/MXb8rEtNpmyTITMuV7AgAJKXV1ieP+xxJSisprYd3v0lpPe4Y/l/uEYPRBBjmhjxhtm9dZu3x29z6G1hHbLDl1VdmNwgBQfy4cx6+CZm1HQncZ0mQ5PEb5hb4mTx+S0vmN4tEvIg+MU+xOVt/gCKWPaYHqzYVBmkv75jpScHv+ujoBNrc2rsu7GRf8fxzLUwkxf878wxp8GsnQZY+GhPIJeUEkFZtjwqEguOe1is9a5Mgj1u2Z64jB478viRHyD3NRlIno+k1a+BKJuK4z6FQmXg0foTtSIrQ7pq/1hSNH4qi+IByePvB3S/eDPnKNJpgz5rtv18IxmAHP13mAAAAAElFTkSuQmCC' />
                  </div>
                  <span className='left-menu-title'>Dashboard</span>
                </Link>
              </li>
              <li id='growthtools'>
                <Link to='/growthTools'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Growth Tools' style={{paddingRight: 20}}>
                    <img class='icon icons8-Line-Chart' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEiklEQVR4Xu1bOWzUWBj+3njGExGOBIVDYsMRQBwCgdiFDWI5tcVScEikSGhCkKiIRDF0FAsFXSIoQrXSBhrYIhSEIrsFhxCIcChixQqECBAgSFxKIg4pY49t9L+RZ+3MYXuOMPa8V3nsZ7////7vv+w3DBU+WIXrDwGAYECFIyBcoMIJIIJgRhfoPNx9CsBeMCwMBEMMDIHhbKyr7cREfdIA6GjvPs2AI4FQPF2JE7GutuPW02kAdLZ3jwKo+al5G6bVTQ8EDp8/fsL9v64DBoZiZ9oWOQFg0ITt7bsDobypxLWuXn4Y62qzGT0TA9IAuEfogWF989YUKH47VxAA5s1WVvjtnACgcBcA1jdvm+AC/jlXEAOCEA0FAF5dwA9Wn1o3PeWWlJW+fPxkE3tq3YxU5vLMAD8AoNfWQNm9k4sqX+5DaGTMJrY+swbKruT1qnMXvNUB460tfsDAtYwCAMEA4QIiBnhqhkQQ9EEWCN8dgPRqGFBVaIsXIbFhXdasELgsQMqHHz9BJCpxpdW4hsSKZVlBCBwA0QsXITMNB442cgDOdvRDMSTEW/ZlZEHwADjfg6hkoDX2M1f4j5O3YEQiiO9vqgwAIldvQHr9BnJVmCusjCeQWLMKibWrgw8AGxmD/M8VMEXhVqehrVyWVfmy7AVSEZyEX9rAredmMEVF5O8rCI2OItGwEInNG93cVl7NkBnBrZLnoq91XuRmP6RnL0CdoPrbrzDkJAOcRlkFQYrgRN9Dxzb9H8CqqxFvyv0qXhp8gcitfk57hZSfWeOkd+p6eQFwvgdMVe0A5IjgpIXV79VNjdCW2L5vOAJRNgBIVLzcHcgocLKa+zGN1vn6vXWRsgDA9F8SjAIYpTEewevn8WNihV5bC/WXRhu98/X7ogMQ/vc/SE+fJ4XOM3KT/6qbN0Kvn2djAVE8cvM2QqNjMGQZ+pzZkF4P82Mz3Xn1+6ICEH7wEASArfbOUXiYi1t9V6+eAnXH1qzBi6gu3bmP8PMhfrt1LWKJumOLo69nm1CwC0R7eiEnxu21d7gqZ+SmqB2+N8AtqM+ZlVTeRdryWue7QaVwACbU3uc67/DyU5s7G/qSBuj1P0B68JDnaBr0RlZ6+54feylYaH40w1pxjWWt80sOAFFT7u0D+/rVVntnWthKW7qeT8oyCyW3dX5JAbCmIPJh+k00JqtrK5cj9GoY0uAzhN594D7rtj11EppijvToSXKt+fU5X3Y4PYuu5+UCNuUdSk+55xKqNMXWnhJgStMeN/KVfI5nAOItTammw03dbWaJYtK2mKh4BoAKEuq43ChvCkoghAaTdQK5SLbevJiKuX2WZwC4Eh47LrfCfI95ngEIkvJ5BUGKAW6Klu9hzXzW9MwA8WHEBx9GvDBBMMDt5/GOw3+OMcZmxHft9PTKyYs1JnsudaTRy30wDOPl0TMHbRvAM+0Upc3Ev0+2kJO0nvNmaRKks737uGEYBxhjCyZJsJIuQ5ZnjNF2edtOcVpU/GWmpND74OGCAT4wUklFFAwoKbw+eLhggA+MVFIRvwHnc1RuhuptKgAAAABJRU5ErkJggg==' />
                  </div>
                  <span className='left-menu-title'>Growth Tools</span>
                </Link>
              </li>
              <li id='subscribers'>
                <Link to='/subscribers'>
                  <img class='icon icons8-Business-Building' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAIEElEQVR4Xu1bb2xT1xX/vT+OHSfGiSEiaaAEhFoCRcBUwdpt7WipBqylhS+TJrTl5UM1qZlU5LRfpmmt+pWsSEv4NgJru6pVy5+2AqrSUEJbkkyAAxVJR9QEiEtCILYTJ/H/V9378oz97Pee33NCEtX3k+N77r3n/M45v3vuvQ6DWW77G1rPkiUam4Wts7yUqekZU6MMDGpqaBWJuLtZmPW1DKiVFJ11pQoAKCJgvqXEA4+A+RYRBQDMEIeRMUqPFyJgnu0KminQ1ND6DwCvAigz4vUHKOsHcMDdLLxpdk1VAJoaWt8AQABYCO1Nd7NA9DXctADwEc//Ye84Kirihid+EANGRjh88K6DLOV3NwvlZtZUBWD/K4f8DMM4FwIAoigGGlvqTaVpIQW0wmaB8IDp/Ce26xZC8r7t2leXU4r9OBrOSU4WmhwfNyQvC7uOfkY/5nvIKgCgB38hAqYrt0IKKDgg8O4JxEdIqQBwFS449+6in2UOKPr0FNhRUqgBifJyRHZtTwu21P6YcxHGnn0qrd/5ZTu4wBj9Llv/nHNAOgDlcO59UR0AVxkiL+xQBSDuXISABgDZ+uccADXuKOwCP5dtsMABaSRY4IAkJRQ4oMAB0llArw5Y8GeBfOuABQ9AvnUAE4mC8fkQnpxMVnuixZIxLRONgp+uCGlVWWxHvKQYC7IQYoIT4D1Xwd7ygolEMoyN24sRrapEtLoSFu8QrDcHQQBQNgKU/P2cHYf16gBZaeJpvusi2KE7YCYm0myxWgCbTTqRB8bpG2rW5nTcP7UHJ0TEEyliIg64W4R9qoN1OkzfB+hxAFmXGfWj6PMv07xNjFleacGSMjapWiwOXO4JY2LqPghLF7OoquBR5rgvJw8IhUX0e6MYvichIYrwcBZs3XdAkE5fBpppAHLhANuJk4A/gFI7g5pqCzWG5zJHXr0ewT1/gsqtfliSy6UFJ0UKHI0IEYfdLYKQy7hUmVkDgHjf+ukpcCzwxEZbVsOJIsSbHVfCunJqhqWBkIDgPigcNgKCaQD0OIC/9n/w/7sIEsq1q4pUdRq6G0dvfzQpF4uJ6OmPUk5YVsmh0sUleUJtksHhOPpuRkkUDLhbhJVzAEDmWYCwPd/9HWoe4lFTzVOdFlWWo+qxFRj+3oux26NIxOIY8MYw8GMsKXf9Zgze4ViaDSQlli7hUGwFOJaBoyQ9RUgUXbwWQTQmIgFsfa1Z+CpXEExHgB4HKAFgeQ5rntsEznKfBAK3R9HVdgO9vWMUgMVlLDWEtG27H8Vgvx+9nmFVW0qLGWystaKjOwRCpNPN0DX5AwHgkdV2rNj8CGzOkgxjOtsG0HX2BgVgebUNnVemsOWZGmx8chmVHfOF4O33UzDG/SF4BwLJOaprnHhuzxoc/mcn/Y68EIFh6hqbheOzHgG6HDCdAuvWu/D07rVpnk9VrufSMM4c64WenJZBrfs7EAzQ3WDT6wcFT67GEznTEaBVB9Di52w7uKE72Lx1BfWoWms/2YfuC15dOS2jzp3sw5ULXojAcY6HYKQeMA2AFgdY2trB3fJSES0AZMWJ3FM7VmPDk9VGnJeU7f7Wi/ZTfdLfonjC3VL/Uq4TzQoAtiPvJ40nuWy1SbuAsh39t4fmNAFJS07PmHAoBs+3g5RLSDNyPjANgBYHWP/7ET2s/PWtpzV1lwHQk9MDQO7/19/PzRUA6XVA0ekzYIdH8Ps/PoZVtYtV9f/sve/Q33tPVy4XAGQyBcRz7ub63+YyJi8S1OIArq8flm86aOhv27NGFQRZaT05PWPIPOdP9YGkAgyWw6ZTQAsA0sefvwD+hwEq9vLffqXKA1983INezx3a/2f3FlU5tfXGfaHUOuBIY0t9bu/40xOaBkCvDiDzy7uBHsPLqbBt9xrU/mKpnsPT+uVCymjoy5PMEACZZwGyALkEIfcBjjIb6txbVA3z9gdw9JBHV045AQn5I02dpkI/bwD0UkDulwlRryCSdwS9aEldN1kAieKNxpZ69WpLI6ZMR0AuAJAI4LsugfX54HBaUdf4y6zDSB5/cex7WvMX2Xjsqd+AiqpSzVSQo4YKiRgQIb7R2FJ/xFD+5FMKawFADOe6r9JSmHIBRDxebcfjf9mcNowY3nl2AD2X0098eoQ4cjuIY4e6aegnLAAr35uaAGJGIyA6OAT/+Utphq8rSmBtURzkSsSy/iHYdq6D0nBixEStDcG1Viz5fBwWX4LuBr/ZuRq1m9JJkZwbCPER4ydWWeD/dQnsfRE4PFPgJ6fvFA0AMSMAEMOnLngQGxxKejzVcNntwQSDbtaK60HpMjPV8ESRpAobEVH29QSKB6VLEUKgS6pKEAnFcfd2UCI8IGl8akiZASIvAMRwBOOftOkaTq44PGEO16LSZUg2w5UpRYwp7QnRaEhtMTuDwBY7QsszH1FkOSUQ5NY4IULIdlQ2DQAxfuzD04jfHaU5ns3jskInJi3wJZicDFcCwQcT4H3SdU+8hEXUleVaWYWQFED4WR4rlUdl0wCQkJ/q8MDFJrDdHqM5nq0Rr3eFOUTLWdz9nQNyqBtl63zkXW1BmlKiKGZUiqYBCLzzCfX+LnsULlb9VUf2/p3nHYa8l4/B2aJo6VHpF2fKo7JpAEbflq7f60oz3/hSFTgclGLD+ydTP+aeMRyq/yM9GhUAUPwDZyEClDG2/5XWywyDjTMWe/NsIt0UaGo45AGYDfNM77zVIW8GjMi8qnw71E2BvFee5xP87AH4CQ3zeowBrKMnAAAAAElFTkSuQmCC' />
                  <span className='left-menu-title'>Subscribers</span>
                </Link>
              </li>

              <li>
                <Link to='/live'>
                  <img class='icon icons8-Business-Building' width='30' height='30' src='data:image/png;base64,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' />
                  <span className='left-menu-title'>Live Chat</span>
                </Link>
              </li>

              <li id='convos'>
                <Link to='/convos'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Broadcasts' style={{paddingRight: 20}}>
                    <img class='icon icons8-Advertising' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHpUlEQVR4Xu1ba2xURRT+5u7eLexW91HLQ0oplloQsA+CSbUqComAQvEHP3wksP1laI1g0X9Gjf+USk2K8Y/dkiga0QjBAEZ5JSYYDEI1CuERHgKiIPTdsnvvHXPm7q276z7uPmm3TFJmkjsze853vjnnzAOGcV7YONcfdwDINwa8/3LH44rKel7/0HvcjG55w4B31/mqJQYfY6gmxTnHcYuMJza0ebvjAZEXALQ2+94E8BYpqjnsQl9pYJBQ2NmypXFV3gIQaXVlTiWUh2rB/AEUfPal0Lul3RvXyGOWAaFWJ0X9Ty2GNmXSiLEnbP0sPwGItLqh8fCa58KYnpcARK51pb4Otm/3CcXzGoBoa12tng9uk2FYOm8BCLO62wXloQVR13reAfA/q1fNg1I9/38RLe8YQIpbGF4Bw1oR190uBOrrwD2uqOF8TAKw+SVfGZf5DGhwccaqwalGNYPI4oSm3CpzdW4li2b1UCRGJQCUj+vpKFsk6qBijKMMDGXxMjOyuFZaAvWB2cLJJSo5B8CwnqahjDFWZliPaiMPTyS0SFcLHeA2G7jHDdgKoHlcom1G6ZwwQKxFCQ0j1guhZyIF75b4UK/GJlI/pWoetCIPIMvgpHShI9HwpL5nnAFkYdUKHwMEfSOLg3EUShw2cBRZABsDPBIX3aZYtJHunf22sATFtmsPpBv6xkxzu+FfuTQpRWN1zigAQasfIEckg/NSq8ZmyKQs4LFoojZb4gLgccG/YpnZqeL2yygAm5p8x2gdeyQNS+1KUgpHShkJQEa0jTJJxgBoXedbCwk+oniDI5CW8iTn2AOgqWMHGGuoL1AxS1bTNtjYA6DZJzzZSntgxKmlg8JocYLgaFM5tsY6Ixw5EGkNArC20J+O3uaiQA6d4IhAHOcB7JBUfLDhIy+1RckZABlBNQUnWFPnwJnfh9DXo4doJqFPUfCYwYi8B+DVd6YKxf/+U8Hh/b04e/KWODHeuMVbMy4YYABgkOf9N/4UTeOwNGcMuF2Z4OgEIIdOcNQAcLuc4B0AQp3ggT6cPTFMJxRdLe2N4gotZz7gdjGglsLgiWH0duvZLWO8X1HZozkPg7fLCRrAc84vgLEdFgVtcROh5fIwCv1+cK7v8VMt2yWnGHrx+WdFPWXPfthu9oi23+3E1WVPxp1aZhJskgVUy4zFfMiQaDfIgQ80DZ0mUuGOgwB7fKE2hDKknw5HApAqkMY4KyTIUvCPMViCkCQCwPTlqLEdlsHxtNYHqtMpmQYgUhbihI1JmPypfguckYuRTU0d5xljM5xcRT0fhB3/HXElC0a2ATDkKdm+SzQvrV4hlstEixUFVKdyO6zfxvCDjDEnMWAaD6AYKhzQ4OBaUoDE9QEuJ64uj+8DzAJu7R8UXZVC/WEEFVou9277SrRNLwFjsH4uyDsBVhVNCALGBRUy53AHGVIMRXQt5npNJV0naBaAWP1Kt32dGgDGhO81+xYxYBUDr+Yc1cQKs0I5oWo9sEjUv+fBOVAcdqgOOxS7PcxSZueL14+iC7mrSEalDUDoj25q6uhkjK1x3V+CosrpCAwM63/9Q1ACCvw3+0T3wWt6mEtUCBCirCbLCHhceu12ivBI7WSKoagRbo2xmQWg2beKAV8XuAoxc+nCuPKd/JxO1YHVjUW4dO6WaB8+0C9qznlPIiapDgfvLy9lfZXlpsDICQAk/Kamjm4SvnxFHWTHhJggnNt7BLe6B/DiumJMmmoV/b74+DounQ8AGrwtH3o76fJFsaKMAS66EOWiDl9qXLbx3jnlrGfe7LiA5xIAsQwm11TAXVkSU6iL+34WS4EYMH2mfpVyYHcvjh0eoObbLe1e8ZwtVglGovX0W9TH73Lin7oFYolEKzkDwEiUJrrvwuwVddA0PUegf402pc9Xjp5G96lLWLTMidqH9dC0c9vN4C4sMQCGkpHRiJxpNDZM2/6NGHJ59TNh+GTUB9DMm9f7XJqCm9SufWEJLDad3pHl8rEzuHL8TNRvkoKZoRuRuNwOfmxt9hFj6CFkVDZEywOob8YBoElbg5cnM+vn456KaVHlv376Ms798GvEN96lga1/rd170IzSkX3MsiF0XHYACF6fuaYXo2LJgqi69F29gZN7jpDPP9TS3hj1hjkVEIQBErAh6wCYWQb+viF0fXlIyJIoDU0FCLNsyAoDdCvo2+Z4y+An396sAWCAlogN2QOgybceDJuLyu/FfY89GNWIRz/5DlpAhaqhxuy7/UywgZInihZUSoLRIRELk34sTUmMZsU5igIUDaKVE7t/RP9f3RQin0jV8SUDSCgbKM2mYs3mc/nW5o7jtFuctbgW7tL/XmgbQp/6/ih6/rhGm5QNLVu8bckok2rfoG9oo+Wpz8G7JCtblJX/MNGaYBmE5AIJM79UFY41joCgb2aXXtJLgCY3loGtcCKqVgcBD5HIAIBzvnXjlkbx4nO0lpQAIGWM47O5DY/A7rkrTL9s5gKZBjJ1AJp9bQx4xVU6CRWLa8Pk+uu3C7h45ERWkqFRA4B4TyjjF8YRbv4QCXMVBdIBJWUG0I/GPj/kXdBYG+390xEuF2PTAiAXAmb7N+4AkG2ER/v8454B/wLIvDF9m+YPVAAAAABJRU5ErkJggg==' />
                  </div>
                  <span className='left-menu-title'>Conversations</span>
                </Link>
              </li>

              <li id='autoposting'>
                <Link to='/autoposting'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Autoposting' style={{paddingRight: 20}}>
                    <img class='icon icons8-Forward-Message' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD30lEQVRoQ+1YXUxSYRh+zkCT0NQ0rXAJK0RKnajLrbjQLrpryn1ruVy3rvsuuy/va6vWvU7v2lpd0JZuiikJig1oUGn+poYp+LX30CkFDnAOB8SN9wrG9z3f+zzP+77fOXA45sEd8/xRIHDUDhYcyEsHHC6vHlzkMYBWAPocJ+kDMAWmemAxG+hz0ogroZejb63Fau61yVCnSbU5m7/PeQOh3TC7eedWtz3ZOXEEBl8N+b8tr1zQ1VbjanMjitXqbOYZh70bDmN8xo3g4jLOVVd9Gbhtq5dEYOTdh61xp0sbDkdQVKSG1dKEmtMVOSGxtLoOu8OJvb0w1GoVOppMS71d12olEXC4F9h26DfGpmfxY22D39tkNODKxaRCZEzw02c/nB4vj3OmshydLZeh1ZyApfFS0kkZ9yMRELIhQAKmqDilhdXSwoMqGSSW3TGN9Z/bPCwJRYIJkREBAiFbx6bd+LWzw5cU9UVdTbUiHLzBRTjcHr5kTpaUwNrehMqy0kPYGRMgNGqssWkXvi6t8OAG3Vm0mi/JbnDCm3ItwBv8zuOdr6lCZ4s5IZ4iBARJSLFJ1zyowbWaElxvi1cslTVrm1t4P+nEdmiHb9Q2cwMMOvE+VZQAJUcJkBsbm9GatZiNaKjXpcqb/33eH4TD5eE/l5dpedVjSyYWSHECwgGTLg88/iD/lcYsuSF2Z1DJkOrUTxTGeh3azMa0SGeNAJ0eWFrm3Uh2Z8TOdlJdyhDIKgGhwe0TM//ujAa9DpbGqLo0YeZ9UZdotlvbmyU3ftYJCHUw5w/wk4WC7gwKYbbTxDLV16VVMjnrgUTZUIPbJ5z8nUEhNtulMMmZA0JS1LCO2agTlsvS7grfYAD6gcNO5ZyAFHVj1070OFF1oxL6gf9j+dgRIFIagwamR3qoSlWZPcxloqacveSAEAKJjg6T/KdROUlksucgAcJRaVXY2wxb7ntsU2K4SR+nM0kmdu/KmzUsjq4i5A1Jg2VY32esW4xEHIFJ98I6B5RLO0V8dWQrgrmHPumJx0By+6zvnsf2PPakRA4MA+hRisDswAJCvui9kGkkIhFPwOXVMy4ypYQLiyPLCDyLPvMrEWkRoIP+/i/0hDG0chxkvwxnW33KNat/LT41Df97v5brAGNsgzF0pd3Ecg9KtE+MwP4+SzgaY9enSv7IHOif603o/CECjH1U7aKrz2eLvgWJxJGUUEoCaSafnw4w9qJ/3nY33VLOLwcahp5LST7vHEhX9YPr8sqBAgE5CiTbI3YPiE0hOedntYTkJCR1T4GAVMWUXl9wQGlFpeIVHJCqmNLr/wCxmeJArsjLJQAAAABJRU5ErkJggg==' />
                  </div>
                  <span className='left-menu-title'>Autoposting</span>
                </Link>
              </li>
              <li id='polls'>
                <Link to='/poll'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Polls' style={{paddingRight: 20}}>
                    <img class='icon icons8-List-View' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA0ElEQVRoQ+2azQ1AQBCFbQNuClGBDhSrAxUoxE0DxEHCJngjk91sfG545ue92XkXoSr8CoXXX9FAbgUfFRjmZc1d4J6/b+rbOmkghUIokILlpxwoELPTj9Pl0dC1l/v4vapgHOf4zl0BGriRBAViYnBi9fS+4NwPsVNdchgawAfEYWGNqmu0eCcWJ8INxhZyo/JjIBTAB8TRwQfwAXFUrDC2kJUxbzwK4APiTOED+IA4KlYYW8jKmDceBbwZtcb7rwJWpnLg+dUgB+vnnMUrsAFNFwBAH0J/4QAAAABJRU5ErkJggg==' />
                  </div>
                  <span className='left-menu-title'>Polls</span>
                </Link>
              </li>
              <li id='surveys'>
                <Link to='/surveys'>
                  <img class='icon icons8-Survey' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAB50lEQVRYR2NkoBJw6zh2nvE/ox7IuP9MDAd3lVs6UcNoRmoY4tZ+/AQDA4PGv79/fUDmMTEzb/nPwHBhd6WlA6XmY3WgT/fJpb///osixfC/f/7a7qmxOQLS49JyxIaZhfkwKfpZmZmWbSk1j0bXg9WB7h3H/+eHmOM0f+KakwyBLmZw+Y37zjB8ZGJVOFZi9BDmQA5O9kM+9kZw89fvOcVAyMydFZYY7qGKA6/cfvLv/pMXX3/+/O0FciA7O+s2BRlxHl1VWdo70FMZ0w8enSdQQhDkqOt3nzLcf/ISHKqKMuIMmsrSKDEACsEd5RYYsbL97n+wGChWyApBbA4M6D/NYGmoySDAy0VUMvvw+RvDxau3GJZlG9HHgZcefWLo2HyH4d2XX0Q5UIiHjaHCV4VBT46PPg4kylVEKqJJFBNpN1HKRh1IVDDhUTQagqMhiC0EkOti9IIaVIvAALaagdQQpXoaxObAuOnnGF59Ilxoi/GxMSzKRK1N6OJAUkMNWT3VHUiJY7DpHXUgpSE6GoKDLgRHy0G0KCHYaRpyNQmlaQ5d/2gupjRER0NwNARJbbBSGmKjuXjQhSC1HYTLPLJHtwalA726Ti77++9fJL0cB7KHmYlp+bYyc4xhZ6oMotPSI4PegQB/a844XdCD1wAAAABJRU5ErkJggg==' />
                  <span className='left-menu-title'>Surveys</span>
                </Link>
              </li>
              <li id='workflows'>
                <Link to='/workflows'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Workflows' style={{paddingRight: 20}}>
                    <img class='icon icons8-Workflow' width='30' height='30' src='data:image/png;base64,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' />
                  </div>
                  <span className='left-menu-title'>Workflows</span>
                </Link>
              </li>
              <li>
                <Link to='/subscribeToMessenger'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Subscribe To Messenger' style={{paddingRight: 20}}>
                    <img class='icon icons8-Facebook-Messenger' width='30' height='30' src='data:image/png;base64,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' />
                  </div>
                  <span className='left-menu-title'>Subscribe To Messenger</span>
                </Link>
              </li>
              {/*
                <li>
                <Link to='stats'>
                  <svg className='olymp-stats-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='Account Stats'><use xlinkHref='icons/icons.svg#olymp-stats-icon' /></svg>
                  <span className='left-menu-title'>Analytics</span>
                </Link>
                </li>
              */}

              <li id='pages'>
                <Link to='/pages'>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='Pages' style={{paddingRight: 20}}>
                    <img class='icon icons8-Facebook' width='30' height='30' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEm0lEQVR4Xu1bS2wbVRQ9M2OPna/jhsZKk37SpqpSBZJWpVBA7QaEBFLVDRtWMUsoaiBpF5UqQAgWtFFTEVggUXePqNjABglEJJBaCWFLleiHijiNaRKcJk4c27E9M9UdMsFJPJ9O7GTGnrexPfPe+J7zzr33/YZBlRemyvHDIcBRQJUz4LiAEQFc7g81iXmckSScYhj0GmmzVXUkCWGGwXesC1feGw7O6dmhq4DPzn4zyC2lPoUouvUeZqn7LJsTPLXnz11845KWXZoEyODTyYv0gLx/G7JtOyE0+iyFc60x3HwCfOwBXLOP5FtCTf1ZLRJUCZBlL3LTEAV3pvMAci0BSwNfa5xnPAp+IgqwXI5lhRY1d1AlYOh06EMAH1DPp7u6bQVeMbb2Vhjc/Dz9/GhgJEh41hVVAi69E/qDAl6qu8fyslfrHXKH2lsRUGAc/CJ46IkIGDodkqjBwgvHV9rVRX6HJDFI9R62zbWG30ZlWwdGgkU7W8sFZAKme46C9/LgOBbKwwpJseo1QRCRzWTRErm5MQKi+3tWenv3vYj83Y7XTCugEGzr+B2ZgIe7DqyQYvVrSqeVhAA7pgKHgGW3dRRgNgsUxgDHBTaJgdpkAp5UEnw2A286uepfs3wNRI6Tr6XqfVhoekrTKlvFAG96Ec2T43Dls4apnmrvRKamTrW+bQhomItj278xGQhfx6P3aCvaO/xo61g9+1zK5BF/uIjRH+4hPrmIiiCgcS4O/zL4rpf24uVXd+oq4PrXYcTGEvYnwL2Uxo7xuzLgYycP4siz23XBU4WKISAwcV8OdIeP78aLr+wxBL5iCFB6n/dw6Bt8Hh6vq7oIaJqZhO/RFJ451oYTr3Wqgo+NrV/bHP3+PuKTSXvHgMDEX6DU9/qb3djb1byOgJs/R3HjpzFNVdg6C7RG74LPptH3/nNo8HtXASXgRACVrMcLkf1v8FNY8i43Zlvai95T6ll6HKAY9+7HJ9aBuzZ0AwtzGcxub8O8zmhPSyK2JeDzC7/IuDY6F3EIsPJ0WMsFKkYBSqDT8tNiMUAhQKtdpqYeU+37rD0bVHq5HATkXG7803HQHgQU62XDw741FWN/J3D9alieBtM4wNJZQMvPzRKgjBEoPVKarDoCfvz2T9wOTxsaI2x5GiyHAoxOhUkZFUnAV5/8CloZerCvW3MYbCkCSp0FBIbFROfTumFkyxVAW2f8UkbTUDPjACMB0BIKMBKhtQhw5gIFu9O6ei9SYctdwFGABgNVMRlyFOAoQJ0BxwWWV2ucNFhkUdQCK0JXwwDTo7fubiY3r12yLpcCaM+B9h4AKTIw8lbRU+66R2UX6xoR39GxEZyqbcsdA5R9R1NHZemwtJCTxhiG8c0EdiHZ6C85CeUkgLbcaOtNkqQE52b2PPFhaUI79HaoDyxC9J0WIBPNAfmzVKUcBNBOs29m6v+jNSKCA18Gr6nZrPvCBJEgMdIwKaFUwDfjOdTzjMT0a4EnO3QJoErLr8z0A9IpCoybAcD8f0gRgKFXZoZL8sqMeUPs0dKQAuwBxZyVDgHmeKucVo4CKqcvzSF5DB/TeW5B71D9AAAAAElFTkSuQmCC' />
                  </div>
                  <span className='left-menu-title'>Pages</span>
                </Link>
              </li>
              <li id='userguide'>
                <Link onClick={this.openUserGuide}>
                  <div data-toggle='tooltip' data-placement='right' title='' data-original-title='User Guide' style={{paddingRight: 20}}>
                    <img class='icon icons8-Help' width='30' height='30' src='data:image/png;base64,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' />
                  </div>
                  <span className='left-menu-title'>User Guide</span>
                </Link>
              </li>
            </ul>
          </div>
          {
                this.state.isShowingModal &&
                <ModalContainer style={{marginTop: '50px'}} onClose={this.closeUserGuide}>
                  <ModalDialog style={{marginTop: '50px'}} onClose={this.closeUserGuide}>
                    <UserGuide />
                  </ModalDialog>
                </ModalContainer>
              }
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log(state)
  return {
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
