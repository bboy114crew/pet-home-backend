import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createProductParentCategories, getProductParentCategories, updateProductCategory, deleteProductCategory } from '../../store/actions/productAction';
import {
  FormGroup,
  InputGroup,
  Input,
  Card,
  CardBody,
  Col,
  Row,
  CardHeader,
  Table,
  Button,
  FormText,
  Label,
  Badge
} from 'reactstrap';
import Spinner from '../common/Spinner';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class ProductCategory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      productParentCategories: [],
      checkUpdate: false,
      isLoading: false,
      editingIndex: -1,
    }
  }

  componentDidMount() {
    this._getAllCategory();
    this.setState(this.props.product.productParentCategories);
    const script = document.createElement("script");
    script.src = "https://use.typekit.net/foobar.js";
    script.async = true;
    document.body.appendChild(script);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  getPropertyCategory = (e, index) => {
    this.refs.nameCategory.focus();
    e.preventDefault();
    this.setState({
      _id: e.currentTarget.getElementsByTagName('input')[0].value,
      name: e.currentTarget.getElementsByTagName('input')[1].value.trim(),
      description: e.currentTarget.getElementsByTagName('input')[2].value.trim(),
      checkUpdate: true,
      editingIndex: e.currentTarget.getElementsByTagName('input')[0].value
    });
  }

  _getAllCategory = () => {
    axios.get(`/api/product/productParentCategories/${this.props.auth.user.user_id}`).then(res => {
      this.setState({
        productParentCategories: res.data.productParentCategories,
        isLoading: false,
      })
    }).catch(err => {
      //todo
    });
  }

  setDeletionFlagFalse = (e) => {
    this.setState({ isLoading: true ,editingIndex: e.currentTarget.getElementsByTagName('input')[0].value});
    let deletionFlag = false;
    if (e.currentTarget.value === 'true') deletionFlag = false;
    if (e.currentTarget.value === 'false') deletionFlag = true;
    const newCategory = {
      id: e.currentTarget.getElementsByTagName('input')[0].value,
      name: e.currentTarget.getElementsByTagName('input')[1].value,
      description: e.currentTarget.getElementsByTagName('input')[2].value,
      deletionFlag: deletionFlag,
      editingIndex: e.currentTarget.getElementsByTagName('input')[0].value
    };
    if(newCategory!==null){
      axios.put(`/api/product/updateProductCategory`, newCategory).then(res => {
        this._getAllCategory();
      }).catch(err => {
        //todo
      });
    }
  }

  cancelEdit = (e) => {
    this.setState({
      name: '',
      description: '',
      checkUpdate: false
    });
  }

  addCategory = (e) => {
    this.setState({ isLoading: true });
    e.preventDefault();
    if (this.state.checkUpdate === false) {
      this.refs.title.innerHTML = "Thêm thể loại";
      const newCategory = {
        ownerId: this.props.auth.user.user_id,
        name: this.state.name,
        description: this.state.description,
        deletionFlag: false,
      };
      axios.post(`/api/product/addProductParentCategory`, newCategory).then(res => {
        this._getAllCategory();
      }).catch(err => {
        //todo
      });
      this.cancelEdit()
    } else {
      this.refs.title.innerHTML = "Sửa thể loại";
      const newCategory = {
        id: this.state._id,
        name: this.state.name,
        description: this.state.description
      };
      axios.put(`/api/product/updateProductCategory`, newCategory).then(res => {
        this._getAllCategory();
      }).catch(err => {
        //todo
      });
      this.cancelEdit()
    }

  }
  renderRowItem = (item, index) => {
    return (
      <tr ref="rowCategory" key={index} style={{ opacity: this.state.isLoading === true && item._id === this.state.editingIndex ? 0.4 : 1 }} >
        <input type="hidden" value={item._id} />
        <td name="name">{item.name}</td>
        <td>{item.description}</td>
        {item.deletionFlag === false ?
          <td><Badge color="success">Đang hoạt động</Badge></td> :
          <td><Badge color="secondary">Đang bị ẩn</Badge></td>
        }
        <td><Button onClick={this.setDeletionFlagFalse} size="sm" style={{width:45}} ref="hideShowFlag" value={item.deletionFlag} color="warning" >
          {item.deletionFlag === false ? "Ẩn" : "Hiện"}
          <input type="hidden" value={item._id}/><input type="hidden" value={item.name} />
          <input type="hidden" value={item.description} />
          <input type="hidden" value={item.deletionFlag} />
        </Button></td>
        <td><Button onClick={this.getPropertyCategory} size="sm" style={{width:45}} color="danger" >
          Sửa
          <input type="hidden" value={item._id}/><input type="hidden" value={item.name} />
          <input type="hidden" value={item.description} />
          <input type="hidden" value={item.deletionFlag} />
        </Button></td>
      </tr>
    );
  }
  onSearch = (e) => {
    if(this.state.productParentCategories.length !==0){
    let tr = this.refs.table.getElementsByTagName('tr');
    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        if (td.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }}
  }

  render() {
    const { productParentCategories } = this.state;
    const { loading } = this.props.product;
    return (
      <div>
        <Row>
          <Col xs="3" lg="3">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                <strong ref="title">Thêm thể loại</strong>
              </CardHeader><CardBody>
                <form onSubmit={this.addCategory}>
                  <input type="hidden" value={this.state._id} />
                  <FormGroup>
                    <Label htmlFor="description">Tên thể loại</Label>
                    <input type="text" ref="nameCategory" className="form-control" value={this.state.name} onChange={this.onChange} name="name" required="required" />
                    <FormText className="help-block">Vui lòng nhập tên thể loại</FormText>
                  </FormGroup>
                  <FormGroup row className="my-0">
                    <Col>
                      <Label htmlFor="description">Mô tả</Label>
                      <Input type="textarea" value={this.state.description} onChange={this.onChange} name="description" id="description" rows="4" />
                      <FormText className="help-block">Nhập nội dung phần mô tả</FormText>
                    </Col>
                  </FormGroup>
                  {this.state.checkUpdate === false ? <Button type="submit" color="info"><i className="fa fa-save"></i> Thêm mới</Button> : <div>
                    <Button type="submit" color="info"><i className="fa fa-save"></i> Sửa</Button>
                    <Button type="button" onClick={this.cancelEdit} color="secondary">Hủy</Button>
                  </div>}
                </form>
              </CardBody>
            </Card>
          </Col>
          <Col xs="8" lg="8">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Danh sách thể loại
                <div style={{ float: 'right' }}>
                  <Col sm="12">
                    <InputGroup>
                      <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Tìm thể loại" />
                    </InputGroup>
                  </Col>
                </div>
              </CardHeader>
              <CardBody>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Mô tả</th>
                      <th>Trạng thái</th>
                      <th>Xử lý</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody ref="table">
                    {productParentCategories === null ? <Spinner /> :
                      productParentCategories.map((item, index) => this.renderRowItem(item, index))
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  product: state.product
});

export default connect(mapStateToProps, { createProductParentCategories, getProductParentCategories, updateProductCategory, deleteProductCategory })(withRouter(ProductCategory));