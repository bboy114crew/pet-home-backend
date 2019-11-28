import React,{Component} from 'react';
import { Badge, Button } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAllUsers } from '../../../store/actions/usersActions'
class ReportItem extends Component {

  constructor(props){
    super(props);
    this.state = {
      deletionFlag: props.reportDetail.deletionFlag,
      loadingUser: true,
      allusers: ''
    }
  }

  componentDidMount() {
    this._getAllUsers();
  }

  _getAllUsers = () => {
    axios.get(`/api/admin/users`).then(res => {
      console.log(res)
      this.setState({
        allusers: res.data.users,
        loadingUser: false
      })
    }).catch(err =>{
      //todo
    });
  }

  _requestBanUser = () => {
    const update = {id: this.props.reportDetail._id,deletionFlag: !this.state.deletionFlag }
    axios.put('/api/report/updateReportStatus', update).then(res =>{
      this._requestGetDelectionFlag();
    })
  }

  _requestGetDelectionFlag = () => {
    axios.get(`/api/post/getById/${this.props.reportDetail._id}`).then(res => {
      this.setState({
        deletionFlag: res.data.result.deletionFlag,
        isLoading: false
      })
    }).catch(err =>{
      //todo
    });
  }

  _getReportById = () => {
  }

  _onClickBanUser = (e) => {
    e.preventDefault();
    this.setState({
      isLoading: true,
    })
    this._requestBanUser();
  }

  _showModal =(e) => {
    e.preventDefault();
    window.showReportDetail();
    axios.get(`/api/report/${this.props.reportDetail._id}`).then(res => {
      const data = {post:this.props.reportDetail, allReport: res.data.result }
      this.props.onShowDetail(data)
    }).catch(err =>{
      //todo
    });  
  }

  render(){
    const key = this.props.index;
    const users = this.props.allusers;
    const { deletionFlag } = this.state
    const style = deletionFlag !== true ? "secondary" : "danger";
    const text = deletionFlag !== true ? "Chưa xử lý" : "Đã xử lý";
    let owerName= []
    const {reportDetail, totalReports} = this.props;
    if(this.state.allusers !== ''){
      owerName = this.state.allusers.filter(item => item._id === reportDetail.ownerId )
    }
    const date = new Date(reportDetail.createdAt).toLocaleDateString() + ' ' + new Date(reportDetail.createdAt).toLocaleTimeString();
    return (
      <tr key={key} style= {this.state.isLoading ?{opacity:0.4}:{opacity:1}}>
        <td style={{verticalAlign:"middle"}}>{reportDetail.title}</td>
        <td style={{verticalAlign:"middle"}}>{owerName.length !==0 ? owerName[0].appName:'unknown'}</td>
        <td style={{verticalAlign:"middle"}}>{date}</td>
        <td style={{verticalAlign:"middle"}}>{totalReports}</td>
        <td style={{verticalAlign:"middle"}}><Badge color={style}>{text}</Badge></td>
        {!this.state.deletionFlag?<td style={{verticalAlign:"middle"}}><Button color="success" size="sm" onClick={this._onClickBanUser}>Ẩn bài viết</Button></td>
          :<td style={{verticalAlign:"middle"}}><Button color="warning" size="sm" onClick={this._onClickBanUser}>Hiện bài viết</Button></td>}
          <td><a style={{color:"blue", textDecorationLine:"yes",cursor:"pointer"}} onClick={this._showModal}>Chi tiết</a></td>
      </tr>
      )
    }
  }

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  allusers: state.allusers
});

export default connect(mapStateToProps, { getAllUsers })(withRouter(ReportItem));

