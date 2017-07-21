import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Login from './login/login';

class Home extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

  }

  render() {
    return (
      <Login />
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
