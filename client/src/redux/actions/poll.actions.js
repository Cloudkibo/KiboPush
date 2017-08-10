import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePollsList (data) {
  return {
    type: ActionTypes.FETCH_POLLS_LIST,
    data
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

export function loadPollsList () {
	// here we will fetch list of subscribers from endpoint
  console.log('Loading broadcast list')
  return (dispatch) => {
    callApi('polls').then(res => dispatch(updatePollsList(res.payload)))
  }
}
export function sendpoll (poll) {
  return (dispatch) => {
    callApi('polls/send', 'post', poll).then(res => dispatch(sendpollresp(res.payload)))
  }
}
export function addPoll (token, data) {
	// here we will add the broadcast
  console.log('Loading broadcast list')
  return (dispatch) => {
    callApi('polls/create', 'post', data).then(res => dispatch(createPoll(data)))
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
export function showresponses (data) {
  /* var d = [{'response': 'abc', //response submitted by subscriber
    'pollId': '110',
    'subscriberid':'1212'},{'response': 'abc', //response submitted by subscriber
    'pollId': '1100',
    'subscriberid':'12112'},{'response': 'xyz', //response submitted by subscriber
    'pollId': '1010',
    'subscriberid':'10212'},
    {'response': 'lmn', //response submitted by subscriber
    'pollId': '10190',
    'subscriberid':'109212'},
    {'response': 'lmn', //response submitted by subscriber
    'pollId': '10810',
    'subscriberid':'1212'}
    ,{'response': 'lmn', //response submitted by subscriber
    'pollId': '10010',
    'subscriberid':'102012'}]; */
  var sorted = rank(data, 'response')
  console.log(sorted)
  return {
    type: ActionTypes.ADD_POLL_RESPONSES,
    sorted
  }
}

export function getpollresults (pollid) {
  return (dispatch) => {
    callApi(`polls/responses/${pollid}`).then(res => dispatch(showresponses(res.payload)))
  }
}
/* A poll should NOT be allowed to edit */

// export function editPoll(token, data) {
// 	//here we will edit the broadcast
//   return {
//     type: ActionTypes.EDIT_POLL,
//     data
//   };
// }
