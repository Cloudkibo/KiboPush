const DEFAULT = [
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
]

export default DEFAULT
