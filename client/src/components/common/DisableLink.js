import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DisableLink extends Component {
  render () {
      if(this.props.disable){
          return <span>{this.props.linkText}</span>
      }
      return <Link style={{ textDecoration: 'none' }} to={{ pathname: '/register2', state: { phone: this.props.phone} }}>{this.props.linkText}</Link>
  }
}

export default DisableLink;