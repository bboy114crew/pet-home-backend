import React, { Component } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppAsideToggler, AppHeaderDropdown, AppSidebarToggler,AppNavbarBrand } from '@coreui/react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../../store/actions/authActions';
import Img from 'react-image';
import logo from '../../../assets/img/logo-ad.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'Pethome Logo' }}
        />
        <Nav className="d-md-down-none" navbar>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none" nav>
            <NavLink href="#">{this.props.auth.user.phone}</NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <Img src={this.props.auth.user.avatar} style={{ height: 35, width: 35 }} className="img-avatar"></Img>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Quản lý tài khoản</strong></DropdownItem>
              <DropdownItem><i className="fa fa-lock"></i>
              <a href="/admin/chgpwd">Thay đổi mật khẩu</a>
              </DropdownItem>
              <DropdownItem onClick={this.onLogoutClick}><i className="fa fa-sign-out"></i> Đăng xuất</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(DefaultHeader);
