import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../../store/actions/authActions';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }
  
  render() {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Admin Dashboard</h1>      
              <button onClick={this.onLogoutClick}>Đăng xuất</button>       
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(AdminDashboard);

