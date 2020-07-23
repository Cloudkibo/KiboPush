import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function appendSentSeenResponsesData (data) {
  let polls = data.polls
  let pagepolls = data.pollpages
  let responsesCount = data.responsesCount
  for (let j = 0; j < polls.length; j++) {
    let pagepoll = pagepolls.filter((c) => c.pollId === polls[j]._id)
    let pagePollDelivered = pagepoll.filter((c) => c.sent === true)
    let pagepollTapped = pagepoll.filter((c) => c.seen === true)
    polls[j].sent = pagepoll.length
    polls[j].delivered = pagePollDelivered.length // total sent
    polls[j].seen = pagepollTapped.length // total tapped
    for (let i = 0; i < responsesCount.length; i++) {
      if (responsesCount[i]._id === polls[j]._id) {
        polls[j].responses = responsesCount[i].count
        break
      } else {
        polls[j].responses = 0
      }
    }
  }
  //  var newPoll = polls.reverse()
  console.log('appendSentSeenResponsesData', polls)
  return polls
}
export function showWarning (data) {
  return {
    type: ActionTypes.POLLS_WARNING,
    data: data
  }
}
export function updatePollsList (data) {
  return {
    type: ActionTypes.FETCH_POLLS_LIST,
    data: appendSentSeenResponsesData(data)
  }
}
export function updatePollsListNew (data) {
  return {
    type: ActionTypes.FETCH_POLLS_LIST_NEW,
    data: appendSentSeenResponsesData(data),
    count: data.count
  }
}
export function createPoll (data) {
  return {
    type: ActionTypes.ADD_POLL,
    data
  }
}

export function sendpollresp (data) {
  return {
    type: ActionTypes.SEND_POLL,
    data
  }
}

export function sendPollSuccess () {
  return {
    type: ActionTypes.SEND_POLL_SUCCESS
  }
}

export function sendPollFailure () {
  return {
    type: ActionTypes.SEND_POLL_FAILURE
  }
}

export function clearAlertMessage () {
  return {
    type: ActionTypes.CLEAR_ALERT
  }
}

export function showresponses (data) {
  var sorted = rank(data, 'response')
  return {
    type: ActionTypes.ADD_POLL_RESPONSES,
    sorted
  }
}

export function showresponsesfull (data) {
  return {
    type: ActionTypes.ADD_POLL_RESPONSES_FULL,
    data
  }
}

export function getAllResponses (data) {
  return {
    type: ActionTypes.GET_ALL_POLL_RESPONSES,
    data
  }
}

export function loadPollsList (days) {
  return (dispatch) => {
    callApi(`polls/all/0`).then(res => dispatch(updatePollsList(res.payload)))
  }
}
export function loadPollsListNew (data) {
  console.log('data for polls', data)
  return (dispatch) => {
    callApi(`polls/allPolls`, 'post', data).then(res => {
      console.log('response from allPolls', res)
      dispatch(updatePollsListNew(res.payload))
    })
  }
}
export function sendpoll (poll, msg) {
  return (dispatch) => {
    callApi('polls/send', 'post', poll)
      .then(res => {
        dispatch(sendpollresp(res.payload))
        console.log('sendpollresp', res)
        if (res.status === 'success') {
          msg.success('Poll sent successfully')
          dispatch(sendPollSuccess())
        } else {
          msg.error(res.description)
          dispatch(sendPollFailure())
        }
      }
    )
  }
}
export function sendPollDirectly (poll, msg) {
  return (dispatch) => {
    callApi('polls/sendPollDirectly', 'post', poll)
      .then(res => {
        console.log('response from polls', res)
        if (res.status === 'success') {
          msg.success('Poll sent successfully')
        } else {
          msg.error(res.description)
          dispatch(showWarning())
        }
      }
    )
  }
}
export function addPoll (token, data) {
  return (dispatch) => {
    callApi('polls/create', 'post', data)
      .then(res => {
        console.log('create poll response', res)
        if (res.status === 'success') {
          dispatch(createPoll(res.payload))
        } else {
          dispatch(showWarning(res.description))
        }
      })
  }
}
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
  return ranked.sort(function (a, b) { return b.count - a.count })
}

export function getpollresults (pollid) {
  return (dispatch) => {
    callApi(`polls/responses/${pollid}`)
      .then(res => {
        dispatch(showresponses(res.payload))
        dispatch(showresponsesfull(res.payload))
      })
  }
}

export function getAllPollResults (pollid) {
  return (dispatch) => {
    callApi(`polls/allResponses/`)
      .then(res => {
        dispatch(getAllResponses(res.payload))
      })
  }
}
export function deletePoll (id, msg, data) {
  return (dispatch) => {
    callApi(`polls/deletePoll/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('Poll deleted successfully')
          dispatch(loadPollsListNew(data))
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to delete poll. ${res.description}`)
          } else {
            msg.error('Failed to delete poll')
          }
        }
      })
  }
}
