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
    console.log('going to check conition')
    if (this.props.sentseendata.broadcastSentCount.length > 0 && this.props.sentseendata.pollSentCount.length > 0 && this.props.sentseendata.surveySentCount.length > 0 && this.props.sentseendata.broadcastSeenCount.length > 0 && this.props.sentseendata.pollSeenCount.length > 0 && this.props.sentseendata.surveySeenCount.length > 0) {
      console.log('props.sentseendata.broadcastSentCount[0].count', this.props.sentseendata.broadcastSentCount[0].count)
      data = [ // {name: 'Broadcasts', sent: 868, seen: 967},
              {name: 'Broadcasts', sent: this.props.sentseendata.broadcastSentCount[0].count, seen: this.props.sentseendata.broadcastSeenCount[0].count},
              {name: 'Polls', sent: this.props.sentseendata.pollSentCount[0].count, seen: this.props.sentseendata.pollSeenCount[0].count},
              {name: 'Surveys', sent: this.props.sentseendata.surveySentCount[0].count, seen: this.props.sentseendata.surveySeenCount[0].count}]
    }
    console('checked condition')

    return (
      <div className='row'>
        <ComposedChart layout='vertical' width={600} height={400} data={data}
          margin={{top: 20, right: 20, bottom: 20, left: 20}} style={{marginTop: '50px', marginLeft: '100px'}}>
          <XAxis type='number' />
          <YAxis dataKey='name' type='category' />
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
