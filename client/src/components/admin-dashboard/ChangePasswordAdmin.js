import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Label,
  Button
} from 'reactstrap';
import axios from 'axios';
class ChangePasswordAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      oldPassword: '',
      newPassword: '',
      newPassword1: '',
      messageSucc:'',
      messageErr:''
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
  }
  clearMsg=()=>{
    this.refs.oldPassword.innerHTML = '';
    this.refs.newPassword.innerHTML = '';
    this.refs.newPassword1.innerHTML = '';
  }
  _changePassword = () => {
    this.clearMsg();
    if(this.state.oldPassword === ''||
      this.state.newPassword === ''){
        if(this.state.oldPassword === "")this.refs.oldPassword.innerHTML = 'Vui lòng không bỏ trống';
        if(this.state.newPassword === '')this.refs.newPassword.innerHTML = 'Vui lòng không bỏ trống';
        return false;
    }if(this.state.newPassword!==this.state.newPassword1){
      this.refs.newPassword1.innerHTML = 'Mật khẩu không khớp';
      return false;
    }
    this.setState({
      isLoading: false
    })
    const user = {uid: this.props.auth.user.user_id, password: this.state.oldPassword, newPassword: this.state.newPassword1}
    axios.put(`/api/auth/changePassword`,user).then(res => {
      this.setState({
        isLoading: false,
        messageSucc: res.data.message,
        messageErr:"",
        oldPassword: '',
        newPassword: '',
        newPassword1: '',
      })
    }).catch(err => {
      this.setState({messageErr:err.response.data.message, messageSucc:""});
    });
  }
  render() {
    return (
      <div className="addProduct">
          <div className="row">
            <div className="col-md-8">
              <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Thay đổi mật khẩu</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                {this.state.messageSucc===""?"":<div style={{width:'100%'}} className="alert alert-success" role="alert">{this.state.messageSucc}</div>}
                {this.state.messageErr===""?"":<div style={{width:'100%'}} className="alert alert-danger" role="alert">{this.state.messageErr}</div>}
                <Col xs="6">
                  <Label htmlFor="company">Mật khẩu cũ</Label>
                  <input ref=''
                    type="password"
                    className={classnames('form-control form-control-lg')}
                    name="oldPassword"
                    value={this.state.oldPassword}
                    onChange={this.onChange}
                  />
                  <div style={{display:'block'}} ref='oldPassword' className="invalid-feedback"></div>
                  </Col>
                </FormGroup>
                <FormGroup>
                <Col xs="6">
                  <Label htmlFor="company">Mật khẩu mới</Label>
                  <input ref=''
                    type="password"
                    className={classnames('form-control form-control-lg')}
                    name="newPassword"
                    value={this.state.newPassword}
                    onChange={this.onChange}
                  />
                  <div style={{display:'block'}} ref='newPassword' className="invalid-feedback"></div>
                  </Col>
                </FormGroup>
                <FormGroup>
                <Col xs="6">
                  <Label htmlFor="company">Nhập lại mật khẩu mới</Label>
                  <input ref=''
                    type="password"
                    className={classnames('form-control form-control-lg')}
                    name="newPassword1"
                    value={this.state.newPassword1}
                    onChange={this.onChange}
                  />
                  <div style={{display:'block'}} ref='newPassword1' className="invalid-feedback"></div>
                  </Col>
                </FormGroup>
                  <div style={{marginTop:20}}>
                  <FormGroup row className="my-0">
                    <Col col="3" sm="2" md="2" className="mb-3 mb-xl-0">
                      <Button style={{marginLeft:15}} block color="primary" onClick={this._changePassword}>Lưu</Button>
                    </Col>
                  </FormGroup>
                  </div>
              </CardBody>
            </Card>
          </Col>
            </div>
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {  })(ChangePasswordAdmin);