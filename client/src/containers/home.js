import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Sidebar from './sidebar/sidebar';
import Responsive from './sidebar/responsive';
import Dashboard from './dashboard/dashboard';
import Header from './header/header';
import HeaderResponsive from './header/headerResponsive';

class Home extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

  }

  render() {
    console.log("Hello");
    return (
      <div>
      <Header/>
      <HeaderResponsive />
      
      <Sidebar/>
      <Responsive/>
      <Dashboard/>
      </div>
    );
  }

}

function mapStateToProps(state) {
  //console.log(state);
  return {
    connectInfo: (state.basicInfo)
  };
}

function mapDispatchToProps(dispatch) {
  // todo do this later
  return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
