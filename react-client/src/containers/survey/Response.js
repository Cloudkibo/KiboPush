import React from 'react'

function rank (items, prop) {
  // declare a key->count table
  var results = {}

  // loop through all the items we were given to rank
  var len = items.length
  for (var i = 0; i < len; i++) {
    // get the requested property value (example: License)
    var value = items[i][prop]

    // increment counter for this value (starting at 1)
    var count = (results[value] || 0) + 1
    results[value] = count
  }

  var ranked = []

  // loop through all the keys in the results object
  for (var key in results) {
    // here we check that the results object *actually* has
    // the key. because of prototypal inheritance in javascript there's
    // a chance that someone has modified the Object class prototype
    // with some extra properties. We don't want to include them in the
    // ranking, so we check the object has it's *own* property.
    if (results.hasOwnProperty(key)) {
      // add an object that looks like {value:"License ABC", count: 2}
      // to the output array
      ranked.push({value: key, count: results[key]})
    }
  }

  // sort by count descending
  return ranked.sort(function (a, b) {
    return b.count - a.count
  })
}
class Response extends React.Component {
  constructor (props, context) {
    super(props, context)
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'http://cdn.cloudkibo.com/public/js/Chart.min.js')
    document.body.appendChild(addScript)

    this.openPopover = this.openPopover.bind(this)
    this.closePopover = this.closePopover.bind(this)
    this.state = {'responseVal': []}
  }

  openPopover () {
    this.setState({showPopover: true})
  }

  closePopover () {
    this.setState({showPopover: false})
  }

  createChart () {
    if (this.props.responses && this.props.question.type === 'multichoice') {
      var sorted = rank(this.props.responses, 'response')
      // this.setState({responseVal:sorted});

      var radarChart = document.getElementById(this.props.question._id)
      var counts = []
      var vals = []
      var colors = ['#38a9ff', '#ff5e3a', '#ffdc1b']
      var backcolors = []
      for (var j = 0; j < sorted.length; j++) {
        counts.push(sorted[j].count)
        backcolors.push(colors[j])
        vals.push(sorted[j].value)
      }
      if (radarChart !== null) {
        // eslint-disable-next-line camelcase
        var ctx_rc = radarChart.getContext('2d')

        // eslint-disable-next-line camelcase
        var data_rc = {
          datasets: [
            {
              data: counts,
              backgroundColor: backcolors
            }],
          labels: vals
        }

        // eslint-disable-next-line no-unused-vars,no-undef
        var radarChartEl = new Chart(ctx_rc, {
          type: 'pie',
          data: data_rc
        })
      }
    }
  }

  componentDidMount () {
    this.createChart()
  }

  componentDidUpdate () {
    this.createChart()
  }

  render () {
    const response = this.props.responses
    return (
      (
        this.props.question.type === 'text'
          ? <ul className='list-group'>
            {
            response.map((c) => (
              <div>
                <li
                  className='list-group-item'
                  style={{cursor: 'pointer'}}
                  key={c._id}
                  ref='target'
                  onMouseOver={this.openPopover}
                  onMouseOut={this.closePopover}
                  data-toggle='tooltip' data-placement='right' title=''
                  data-original-title={c.subscriberId.firstName + ' ' +
                  c.subscriberId.lastName}
                >
                  {c.response}

                </li>
              </div>
            ))
          }
          </ul>
          : <div className='m-portlet__body'>
            <div className='ui-block-content'>
              <div style={{
                'width': '600px',
                'height': '400px',
                'margin': '0 auto'
              }}>
                <canvas id={this.props.question._id} width={250} height={170} />
              </div>
            </div>
          </div>
      )
    )
  }
}

export default Response
