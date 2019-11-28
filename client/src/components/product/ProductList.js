import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createProduct, deleteProduct } from '../../store/actions/productAction';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col, Button, Row, Table, FormGroup, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import Img from 'react-image';
import Spinner from '../uploadImage/Spinner';
import Empty from '../common/Empty';
import axios from 'axios';
class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desciption: '',
      price: 0,
      image: [],
      proDetailId: '',
      products: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this._getAllProducts()
  }

  onChangeTypeProduct = (e) => {
    this.setState({ typeLocation: e.target.value });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      name: this.state.name,
      desciption: this.state.desciption,
      price: this.state.price,
      image: this.state.image
    };
    this.props.createProduct(newProduct, this.props.history);
  }

  onSearch = (e) => {
    if(this.state.products.length !== 0){
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
  }

  editProduct = item => {
    this.props.history.push('/product/edit', item);
  }

  onAddProduct = (e) => {
    this.props.history.push('/product/add', { id: '' });
  }

  deleteProduct = (e) => {
    this.setState({
      isLoading: true
    })
    axios.put(`/api/product/delete`, { id: this.state.proDetailId }).then(res => {
      this._getAllProducts();
      window.messageSuccess();
    }).catch(err => {
      //todo
    });

  }
  _onSetDelete = (e) => {
    this.setState({ proDetailId: e.currentTarget.getElementsByTagName('input')[0].value })
  }
  renderProductItem = (item, index) => {
    return (
      <tr key={index}>
        <td><Img src={item.images[0]} style={{ height: 55, width: 55 }} /></td>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td><Badge color="danger">{item.typeId.name}</Badge></td>
        <td>{item.description}</td>
        <td>
          <Button color="success" style={{ marginRight: 10 }} onClick={() => this.editProduct(item)}><i className="fa fa-pencil-square-o"></i><input type="hidden" value={item._id} /></Button>
          <button className="btn btn-danger" onClick={this._onSetDelete} data-toggle="modal" data-target="#deleteProduct"><i className="fa fa-trash"></i><input type="hidden" value={item._id} /></button>
        </td>
      </tr>
    );
  }
  _getAllProducts = () => {
    axios.get(`/api/product/productByUserIds/${this.props.auth.user.user_id}`).then(res => {
      this.setState({
        products: res.data.productByIds,
        isLoading: false
      })
    }).catch(err => {
      //todo
    });
  }

  render() {
    const { products } = this.state;
    return (
      <div className="product-container">
        <FormGroup row>
          <Col sm="8">
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <Button type="button" color="primary" size="lg"><i className="fa fa-search"></i> Tìm kiếm</Button>
              </InputGroupAddon>
              <Input type="text" id="input1-group2" onChange={this.onSearch} size="lg" name="input1-group2" placeholder="Tìm sản phẩm" />
            </InputGroup>
          </Col>
          <Button onClick={this.onAddProduct} type="button" className="btn btn-lg btn-primary"><i className="fa fa-plus">  Thêm sản phẩm</i></Button>
        </FormGroup>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Danh sách sản phẩm
            </CardHeader>
              <CardBody>
                {this.state.isLoading ? 
                  <div className={{
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}>
                    <Spinner />
                  </div> : (this.state.products.length === 0 ? <Empty/> :
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Ảnh</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Giá</th>
                        <th>Loại</th>
                        <th>Mô tả</th>
                        <th style={{ width: '9%' }}>Sửa sản phẩm</th>
                      </tr>
                    </thead>
                    <tbody ref="tableSearch">
                      {!this.state.isLoading && products.map((item, index) => this.renderProductItem(item, index))}
                    </tbody>
                  </Table>)
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <div className="alert alert-success" id="messageTri2gger" style={{color:"green",zIndex:100,position:"absolute",opacity:0.5, border:"2px green solid",marginLeft:500}}>
          <i className="fas fa-check-circle"></i> Xử lý thành công!
        </div> */}
        <div className="modal fade" id="deleteProduct" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4> Bạn có chắc chắn muốn xóa sản phẩm này? </h4>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.deleteProduct}>Đồng ý</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddProduct.propTypes = {
  createProduct: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  locationApp: state.locationApp,
  product: state.product,
});

export default connect(mapStateToProps, { createProduct, deleteProduct })(withRouter(AddProduct));