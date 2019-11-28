import React,{Component} from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row,Table } from 'reactstrap';
import {getAllUsers} from '../../../store/actions/usersActions'
import Spinner from '../../common/Spinner'
import UserItem from './UserItem'

class UserList extends Component {

  constructor(props){
    super(props);
    this.state = {
      userId : '',
      deletionFlag: false
    }
  }

  componentDidMount(){
    this.props.getAllUsers();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSearch =(e) => {
    let tr = this.refs.tableSearch.getElementsByTagName('tr');

    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        if (td.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  render(){
    const users = this.props.allusers;
    return (
    <div>
      <Row>
        <Col xs="12" lg="8">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Danh sách người dùng
                <input type="text" 
                  className="form-control" 
                  style={{float:"right", width:"20%"}} 
                  placeholder="Tìm kiếm"
                  onChange={this.onSearch}
                  value={this.state.search}/>
              </CardHeader>
              <CardBody>
              { users.allusers.users === undefined ||users ===null  ? <Spinner /> :
                <Table hover responsive >
                  <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên người dùng</th>
                    <th>Trạng thái hoạt động</th>
                    <th style={{width:'9%'}}>Xử lý</th>
                  </tr>
                  </thead>
                  <tbody ref="tableSearch">
                    {users.allusers.users !== undefined && users.allusers.users.map((item, index) => <UserItem userDetail={item} key={index} />)}
                  </tbody>
                </Table>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
    </div>)
  }

}
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  allusers: state.allusers
});

export default connect(mapStateToProps, { getAllUsers})(withRouter(UserList));

