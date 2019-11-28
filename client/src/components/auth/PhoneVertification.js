import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  getVertificationCode, 
  getVertify, 
  clearMessageSendCode, 
  clearmessageCheckCode,
  clearErrorsProps 
} from '../../store/actions/phoneActions';

class PhoneVertification extends Component {
  constructor() {
    super();
    this.state = {
      phone: '',
      code: '',
      errors: {},
    };
  }

  onPhoneVertification = (e) => {
    this.props.clearMessageSendCode();
    this.props.clearErrorsProps();
    this.props.getVertificationCode({phone: this.state.phone});
  }

  onPhoneVertify = (e) => {
    this.props.clearmessageCheckCode();
    this.props.clearErrorsProps();
    const { phone, code } = this.state;
    this.props.getVertify({phone, code});
    // const { messageSendCode, messageCheckCode} = this.props;   
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.messageSendCode && nextProps.messageCheckCode.message !== undefined) {
      nextProps.history.push('/register', {phone: prevState.phone})
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

  onChangePhoneNumber = (e) => {
    this.setState({phone: e.target.value});
  }

  onChangeCode = (e) => {
    this.setState({code: e.target.value});
  }

  render() {
    const { errors } = this.state;
    const { messageSendCode, errorsProps } = this.props;
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
      <div className="login">
        <div className="container bounceInRight">
          <div className="row">
            <div className="col-md-4 m-auto bounceInRight">           
            <div className="form-group" style={{color:'white',marginTop:20, marginLeft:10}}>
              <Link 
                style={{
                  color:'white', 
                  fontSize: 20,
                  borderColor: '#ffffff',
                  borderRadius: 5
                }} to="/login">Quay lại</Link>
            </div>
            <h1 className="display-4 text-center" style={{ marginBottom:30}}>Đăng ký</h1>             
              <div className="form-group">
                <input
                  style={{ borderRadius:25}}
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Số điện thoại"
                  name="phone"
                  value={this.state.phone}
                  onChange={this.onChangePhoneNumber}
                />   
                {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                )}            
              </div>
              <div className="form-group">                  
                <button type="button" style={{width:"100%", borderRadius:25}} className="btn-lg btn-success" onClick={this.onPhoneVertification}>Gửi mã xác minh</button>                  
              </div>

              { messageSendCode && messageSendCode.message !== undefined && (                      
                  <p className="font-weight-normal text-center" style={{color: '#ffffff', marginBottom: 10 }}>{messageSendCode.message}</p>
              )}
              { errorsProps && (
                  <p className="font-weight-normal" style={{color: '#ffffff'}}>{errorsProps.message}</p>
              )}
              {messageSendCode? (<div>
                <div className="form-group">
                  <input
                    type="text"
                    style={{width:"100%", borderRadius:25}}
                    className="form-control form-control-lg"
                    placeholder="Mã xác minh"
                    name="code"
                    value={this.state.code}
                    onChange={this.onChangeCode}/>
                </div>
                <div className="form-group">                  
                <button type="button"style={{ borderRadius:25}} className="btn-lg btn-secondary" onClick={this.onPhoneVertify}>Xác nhận</button>
              </div>
                </div>):""}
              {errorsProps && (
                <p className="font-weight-normal">{errorsProps.message2}</p>
              )}
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
  errorsProps: state.errors,
  messageSendCode: state.sendCodeBySMS.messageSendCode,
  messageCheckCode: state.sendCodeBySMS.messageCheckCode,
});

export default connect(
  mapStateToProps, 
  { 
    getVertificationCode, 
    getVertify, 
    clearMessageSendCode, 
    clearmessageCheckCode,
    clearErrorsProps
  })(PhoneVertification);
