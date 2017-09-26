import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import PagesInfo from './userPages'
import BroadcastsInfo from './userBroadcasts'
import SurveysInfo from './userSurveys'
import PollsInfo from './userPolls'

class UserDetails extends React.Component {
  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <h3>Sania Siddiqui</h3>
          <PagesInfo />
          <BroadcastsInfo />
          <SurveysInfo />
          <PollsInfo />
        </div>
      </div>
    )
  }
}

export default UserDetails

/* function mapStateToProps (state) {
  console.log(state.PagesInfo.pages)
  return {
    pages: (state.PagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ loadPagesList: loadPagesList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Seemore) */
