const DEFAULTDATA = {
  alerts: [
    {
      _id: '123',
      type: 'talk_to_agent',
  		enabled: false,
  		promptCriteria: 'outside_bussiness_hours'
    },
    {
      _id: '124',
      type: 'pending_session',
  		enabled: false,
  		interval: 15,
  		intervalUnit: 'mins',
  		promptCriteria: 'none'
    },
    {
      _id: '125',
      type: 'unresolved_session',
  		enabled: false,
  		interval: 6,
  		intervalUnit: 'hours'
    }
  ],
  channels: {
    notification: { title: 'In-app Notification', enabled: false },
    messenger: { title: 'Facebook Messenger', enabled: false },
    whatsapp: { title: 'WhatsApp Messenger', enabled: false },
    email: { title: 'Email Subscription', enabled: false }
  }
}

export default DEFAULTDATA
