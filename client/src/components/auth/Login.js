import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { loginUser } from '../../store/actions/authActions';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      phone: '',
      password: '',
      errors: {},
      errorsClassPassword: '',
      errorsClassUsername: '',
      showpass: false
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      if(this.props.auth.user.role === 1){
        this.props.history.push('/product');
      } else {
        this.props.history.push('/admin/allusers');
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isAuthenticated) {
      if(nextProps.auth.user.role === 1){
        nextProps.history.push('/product');
      } else {
        nextProps.history.push('/admin/allusers');
      }
    }
    if (nextProps.errors) {
      return { errors: nextProps.errors};     
    }
    else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.auth.isAuthenticated) {
      prevProps.history.push('/product');
    }
  }
  
  onSubmit = (e) => {
    e.preventDefault();
    if(this.state.phone !== ''){
      const userData = {
        phone: this.state.phone,
        password: this.state.password
      };
      this.props.loginUser(userData);
    }
  }

  onForgetPass = (e) => {
    this.props.history.push('/forgetPass');;
  }

  onRegister = (e) => {
    this.props.history.push('/phoneVertification');
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  onShowPassword =(e) => {
    if (!this.state.showpass){
      this.refs.passwordInput.setAttribute('type','text');
      this.setState({showpass:true})
    }
    else{
      this.refs.passwordInput.setAttribute('type','password');
      this.setState({showpass:false})
    }
  }
  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="login ">
              <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55 login-container">
                <form className="login100-form validate-form flex-sb flex-w" onSubmit={this.onSubmit}>
                  <span className="login100-form-title p-b-32">
                    Đăng nhập
                  </span>
                  {this.state.errors.message === undefined ? ''
                    :
                    <div style={{width:'100%'}} className="alert alert-danger" role="alert">
                    {this.state.errors.message !== undefined && (this.state.errors.message.phone ===undefined && this.state.errors.message.password ===undefined)?this.state.errors.message:''}
                    {this.state.errors.message.phone ===undefined? '':this.state.errors.message.phone }
                    {this.state.errors.message.password ===undefined? '':this.state.errors.message.password }
                    </div> }
                  <span className="txt1 p-b-11">
                    Số điện thoại
                  </span>
                  <div className={classnames("wrap-input100 validate-input m-b-36") }>
                  <input className="input100" type="text"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.onChange}/>
                    <span className="focus-input100"></span>
                  </div>
                  <span className="txt1 p-b-11">
                    Mật khẩu
                  </span>
                  <div className={"wrap-input100 validate-input m-b-12  "} >
                    <span className="btn-show-pass">
                      {this.state.showpass?<i className="fa fa-eye-slash" onClick={this.onShowPassword}></i>:<i className="fa fa-eye" onClick={this.onShowPassword}></i>}
                    </span>
                    <input  className="input100" type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange} 
                    ref='passwordInput'/>
                    <span className="focus-input100"></span>
                  </div>
                  <div className="flex-sb-m w-full p-b-48">
                    <div>
                      <a href="/forgetPass" className="txt3">
                        Quên mật khẩu?
                      </a>
                    </div>
                  </div>
                  <div className="container-login100-form-btn">
                    <button className="login100-form-btn">
                      Đăng nhập
                    </button>
                  </div>
                  <div className="register-link" style={{ marginTop: 10}}>
                    <span className="txt3 p-b-11" style={{color:"#23282c", marginRight: 10}}>Bạn chưa có tài khoản?</span>
                    <Link to="/phoneVertification">Đăng ký</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
