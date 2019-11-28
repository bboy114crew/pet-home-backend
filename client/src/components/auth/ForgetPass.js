import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { forgetPass } from '../../store/actions/authActions';
import Spinner from '../common/Spinner';
import { Link } from 'react-router-dom';

class ForgetPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      errors: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errors) {
      return { errors: nextProps.errors};
    }
    if (nextProps.sendPassStatus) {
      nextProps.history.push('/sendPassSuccess');
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.sendPassStatus) {
      prevProps.history.push('/sendPassSuccess');
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    this.props.forgetPass(this.state.phone);
  }

  render() {
    const { errors } = this.state;
    const { loading } = this.props.auth;   
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="forgotPass">
            <div className="container">
              <div className="row">
                <div className="col-md-5 m-auto" style={{ marginLeft:830}}>
                  <h2 style={{ marginBottom:30}}>Quên mật khẩu</h2>
                  <form noValidate onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        style={{width:"100%", borderRadius:25}}
                        className={classnames('form-control form-control-lg', {
                          'is-invalid': errors.message2
                        })}
                        placeholder="Số điện thoại của bạn"
                        name="phone"
                        value={this.state.phone}
                        onChange={this.onChange}
                      />
                      {errors.message2 &&  (
                        <div className="invalid-feedback">{errors.message2}</div>
                      )}
                    </div>   
                    { loading ? <Spinner /> : 
                    <input type="submit" style={{width:"100%", borderRadius:25}} className="btn-lg btn-warning btn-block mt-4" value="Gửi mật khẩu về điện thoại"/>}
                    <div className="form-group" style={{color:'white',marginTop:20, marginLeft:10}}><Link  style={{color:'white', fontSize: 20}} to="/login">Quay lại</Link></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  sendPassStatus: state.sendCodeBySMS.messageSendCode.status
});

export default connect(mapStateToProps, { forgetPass })(ForgetPass);