import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CustomLink extends Component {
  render () {
    return (
      <div className="btn btn-info">
        <Link style={{ textDecoration: 'none', color: 'white' }} to={{ pathname: '/register', state: { phone: this.props.phone} }}>{this.props.linkText}</Link>
      </div>
    )    
  }
}

export default CustomLink;