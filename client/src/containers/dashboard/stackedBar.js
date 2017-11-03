/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import {ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend} from 'recharts'
class StackedBar extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('StackedBar')
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
  render () {
    var data = []
    var temp = {}
    console.log('new 4')
    console.log(this.props.sentseendata)
    // if (this.props.sentseendata.broadcastSentCount && this.props.sentseendata.broadcastSentCount.length > 0 && this.props.sentseendata.broadcastSeenCount.length) {
    //   var temp = {name: 'Broadcasts', sent: this.props.sentseendata.broadcastSentCount[0].count, seen: this.props.sentseendata.broadcastSeenCount[0].count}
    //   data.push(temp)
    // }
    // if (this.props.sentseendata.surveySentCount && this.props.sentseendata.surveySentCount.length > 0 && this.props.sentseendata.surveySeenCount.length) {
    //   temp = {name: 'Surveys', sent: this.props.sentseendata.surveySentCount[0].count, seen: this.props.sentseendata.surveySeenCount[0].count}
    //   data.push(temp)
    // }
    // if (this.props.sentseendata.pollSentCount && this.props.sentseendata.pollSentCount.length > 0 && this.props.sentseendata.pollSeenCount.length) {
    //   temp = {name: 'Polls', sent: this.props.sentseendata.pollSentCount[0].count, seen: this.props.sentseendata.pollSeenCount[0].count}
    //   data.push(temp)
    // }
    if (this.props.sentseendata.broadcastSentCount && this.props.sentseendata.broadcastSentCount.length > 0) {
      if (this.props.sentseendata.broadcastSeenCount.length > 0) {
        temp = {name: 'Broadcasts', sent: this.props.sentseendata.broadcastSentCount[0].count, seen: this.props.sentseendata.broadcastSeenCount[0].count}
        data.push(temp)
      } else {
        temp = {name: 'Broadcasts', sent: this.props.sentseendata.broadcastSentCount[0].count, seen: 0}
        data.push(temp)
      }
    }
    if (this.props.sentseendata.surveySentCount && this.props.sentseendata.surveySentCount.length > 0) {
      if (this.props.sentseendata.surveySeenCount.length > 0) {
        temp = {name: 'Surveys', sent: this.props.sentseendata.surveySentCount[0].count, seen: this.props.sentseendata.surveySeenCount[0].count}
        data.push(temp)
      } else {
        temp = {name: 'Surveys', sent: this.props.sentseendata.surveySentCount[0].count, seen: 0}
        data.push(temp)
      }
    }
    if (this.props.sentseendata.pollSentCount && this.props.sentseendata.pollSentCount.length > 0) {
      if (this.props.sentseendata.pollSeenCount.length > 0) {
        temp = {name: 'Polls', sent: this.props.sentseendata.pollSentCount[0].count, seen: this.props.sentseendata.pollSeenCount[0].count}
        data.push(temp)
      } else {
        temp = {name: 'Polls', sent: this.props.sentseendata.pollSentCount[0].count, seen: 0}
        data.push(temp)
      }
    }

    return (
      <div className='row'>
        <ComposedChart layout='vertical' width={600} height={400} data={data}
          margin={{top: 20, right: 20, bottom: 20, left: 20}} style={{marginTop: '50px', marginLeft: '100px'}}>
          <XAxis type='number' />
          <YAxis dataKey='name' type='category' width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey='seen' stackId='a' fill='#413ea0' />
          <Bar dataKey='sent' stackId='a' fill='#82ca9d' />
        </ComposedChart>
      </div>
    )
  }
}
export default StackedBar
