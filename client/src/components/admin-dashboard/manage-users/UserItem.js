import React,{Component} from 'react';
import { Badge, Button } from 'reactstrap';
import Img from 'react-image';
import axios from 'axios';

class UserItem extends Component {

  constructor(props){
    super(props);
    this.state = {
      deletionFlag: props.userDetail.deletionFlag
    }
  }

  // componentDidMount(){
  //   const userDetail = this.props.userDetail;
  // }

  _requestBanUser = () => {
    const userDetail = this.props.userDetail;
    const user = {id: userDetail._id,deletionFlag : !this.state.deletionFlag}
    axios.put('/api/admin/users', user).then(res => {
      this._requestGetDelectionFlag();
    });
  }

  _requestGetDelectionFlag = () => {
    axios.get(`/api/admin/users/status/${this.props.userDetail._id}`).then(res => {
      this.setState({
        deletionFlag: res.data.deletionFlag,
        isLoading: false
      })
    }).catch(err =>{
      //todo
    });
  }

  _onClickBanUser = () => {
    this.setState({
      isLoading: true,
    })
    this._requestBanUser();
  }

  render(){
    const key = this.props.key;

    const { deletionFlag } = this.state
    const style = deletionFlag ? "secondary" : "danger";
    const text = deletionFlag ? "Không hoạt động" : "Đang hoạt động";
    
    const {userDetail} = this.props
    const date = new Date(userDetail.createdAt).toLocaleDateString() + ' ' + new Date(userDetail.createdAt).toLocaleTimeString();
    return (
      <tr key={key} style= {this.state.isLoading ?{opacity:0.4}:{opacity:1}}>
        <td><Img src={userDetail.avatar} style={{height:55,width:55}}/></td>
        <td style={{verticalAlign:"middle"}}>
        <div>{userDetail.appName}</div>
          <div className="small text-muted">Đăng ký lúc: {date}
          </div>
        </td>
        <td style={{verticalAlign:"middle"}}><Badge color={style}>{text}</Badge></td>
        {this.state.deletionFlag?<td style={{verticalAlign:"middle"}}><Button color="success" size="sm" onClick={this._onClickBanUser}>Bỏ cấm</Button></td>
          :<td style={{verticalAlign:"middle"}}><Button color="warning" size="sm" onClick={this._onClickBanUser}>Cấm</Button></td>}
      </tr>
    )
  }

}

export default UserItem;

