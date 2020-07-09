import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Main extends Component {
  render() {
    const { loginUser } = this.props;
    if(loginUser) {
      return <Redirect to="/app" />
    }else{
      return <Redirect to="/user" />
    }
  }
}
export default Main;
