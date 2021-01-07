
//handles sms response event
export function handleResponseEvent(smsAnalyticsCurrent, smsResponseInfo, senders, smsResponseEvent) {
    let socketResponse = smsResponseInfo.response
    if (smsAnalyticsCurrent.responded > 0) {
        //check to see if the response exist, then increment count                   
        let responseObject = smsAnalyticsCurrent.responses.find(re => re._id.toLowerCase().trim() === socketResponse.response.text.toLowerCase().trim())
        if (responseObject) {
            smsAnalyticsCurrent.responded = smsAnalyticsCurrent.responded + 1
            responseObject.count =  responseObject.count + 1
        } else {
            //check to see if the responses are less than 5  
            if (smsAnalyticsCurrent.responses.length < 5) {
                // since response doesnot exist create a new one and update its senders info
                if (socketResponse.response && socketResponse.response.text) {
                    smsAnalyticsCurrent.responded = smsAnalyticsCurrent.responded + 1
                    smsAnalyticsCurrent.responses.push({_id: socketResponse.response.text.toLowerCase().trim(), count: 1})
                    if (smsResponseEvent) {
                        smsResponseEvent(null)
                    }
                }
            } else {
                let othersObject = smsAnalyticsCurrent.responses.find(re => re._id === 'others')
                //if response length is 5 check to see if others exist in responses, increment count of others
                if (othersObject) {
                    smsAnalyticsCurrent.responded = smsAnalyticsCurrent.responded + 1
                    othersObject.count = othersObject.count + 1
                } else {
                  // if response length is 5 and others doesnot exist. Create others by appending the new response with the last response.
                  // Count of others will be count of last response + 1
                  // remove last response senders info.
                    smsAnalyticsCurrent.responded = smsAnalyticsCurrent.responded + 1
                    let responseArray = []
                    for (var i=0; i < smsAnalyticsCurrent.responses.length - 1; i++) {
                        responseArray.push(smsAnalyticsCurrent.responses[i])
                    }
                    responseArray.push({_id: 'others', count:  smsAnalyticsCurrent.responses[smsAnalyticsCurrent.responses.length - 1].count + 1})
                    smsAnalyticsCurrent.responses = responseArray
                    if (senders && senders[smsAnalyticsCurrent.responses[smsAnalyticsCurrent.responses.length - 1]._id]) {
                        delete senders[smsAnalyticsCurrent.responses[smsAnalyticsCurrent.responses.length - 1]._id]
                    }
                    if (smsResponseEvent) {
                        smsResponseEvent(null)
                    }
                }
            }
        }
    } else {
        if (socketResponse.response && socketResponse.response.text) {
            smsAnalyticsCurrent.responded = 1
            smsAnalyticsCurrent.responses.push({_id: socketResponse.response.text.toLowerCase().trim(), count: 1})
        }
    }
    return smsAnalyticsCurrent
  }
