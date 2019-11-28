import React, { Component } from 'react';
import { Card, CardHeader, Col, Row } from 'reactstrap';
import Spinner from '../../common/Spinner';
import axios from 'axios';
import PostCategoryItem from './PostCategoryIttem';
import Empty from '../../common/Empty';
class PostCategory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      isLoading: true,
      name: '',
      newName: ''
    }
  }
  oldName = '';
  data = {};
  componentDidMount() {
    this._requestGetAllPostCategories();
  }
  errMsg = '';
  _requestGetAllPostCategories = () => {
    axios.get('/api/post/category/get').then(res => {
      this.setState({
        categories: res.data.categories,
        isLoading: false
      })
    }).catch(err => {
      //todo
    });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  _onDeleteItem = () => {
    const abc = { id: this.state.itemId, field: 'deletionFlag', name: !this.state.deletionFlg }
    axios.put('/api/post/category/updateNameById', abc).then(res => {
      this._requestGetAllPostCategories();
    }).catch(err => {
      //todo
    });
  }
  _onChangeNameCategory = () => {
    if (this.state.name === '') {
      this.refs.editErrMsg.innerHTML = "Vui lòng không bỏ trống!";
      return;
    }
    if (this.state.name.trim() === this.oldName) {
      this.refs.editErrMsg.innerHTML = "Bạn chưa thay đổi!";
      return;
    }
    const abc = { id: this.state.itemId, field: 'name', name: this.state.name }
    axios.put('/api/post/category/updateNameById', abc).then(res => {
      this.refs.editErrMsg.innerHTML = "";
      this._requestGetAllPostCategories();
      window.hideEditModal();
    }).catch(err => {
      this.refs.editErrMsg.innerHTML = err.response.data.error.message;
    });
  }
  _onAddNewCategory = () => {
    if (this.state.newName === '') {
      this.refs.addErrMsg.innerHTML = "Vui lòng không bỏ trống!";
      return;
    }
    const data = { name: this.state.newName }
    axios.post('/api/post/category/add', data).then(res => {
      this._requestGetAllPostCategories();
      this.refs.addErrMsg.innerHTML = "";
      window.hideAddModal();
    }).catch(err => {
      this.refs.addErrMsg.innerHTML = err.response.data.error.message;
    });
  }

  deleteHandle = (obj) => {
    this.oldName = obj.name;
    this.setState({ name: obj.name, itemId: obj.id, deletionFlg: obj.deletionFlag })
  }

  _onSearch = (e) => {
    if(this.state.categories.length !== 0)
    {
      const list = this.refs.tesst.getElementsByClassName('nameItem');
      const itemm = this.refs.tesst.getElementsByClassName('itemSearch');
      for (let i = 0; i < list.length; i++) {
        if (list[i].innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) {
          itemm[i].style.display = '';
        }
        else {
          itemm[i].style.display = 'none';
        }
      }
    }
  }

  _filterByStatus = (e) => {
    // console.log(this.refs.search.getElementsByClassName('statusFlagLocation'))
    const list = this.refs.tesst.getElementsByClassName('statusFlagPost');
    const itemm = this.refs.tesst.getElementsByClassName('itemSearch');
    if (this.refs.all.checked)
      this._showAll()
    else
      for (let i = 0; i < list.length; i++) {
        if (list[i].value === e.target.id && e.target.value) {
          itemm[i].style.display = '';
        }
        else {
          if (e.target.id !== 'all')
            itemm[i].style.display = 'none';
        }
      }
  }
  _showAll = () => {
    const itemm = this.refs.tesst.getElementsByClassName('itemSearch');
    for (let i = 0; i < itemm.length; i++) {
      itemm[i].style.display = '';
    }
  }
  render() {
    const { categories, isLoading } = this.state;
    return (
      <div >
        <Row>
          <Col>
            <Card >
              <CardHeader>
                <div className="form-group row" >
                  <input className="form-control col-sm-2 " placeholder="Tìm theo tên" onChange={this._onSearch} name="name" style={{marginLeft:30,marginRight:20,marginTop:-5}}/>
                  <div style={{display:"none"}}>
                  <div className="form-check">
                    <input className="form-check-input" ref='all' onClick={this._filterByStatus} type="radio" name="exampleRadios" id="all" value="option1"/>
                    <label className="form-check-label" htmlFor="all">
                    Tất cả
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input"  ref='on' onClick={this._filterByStatus} type="radio" name="exampleRadios" id="on" value="option2"/>
                    <label className="form-check-label" htmlFor="on">
                    Hoạt động
                    </label>
                  </div>
                  <div className="form-check disabled">
                    <input className="form-check-input" ref='off' onClick={this._filterByStatus} type="radio" name="exampleRadios" id="off" value="option3"/>
                    <label className="form-check-label" htmlFor="off">
                    Không hoạt động
                    </label>
                  </div></div>
                  <div className="card-header-actions">
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addModal"><i className="fa fa-plus"></i>  Thêm mới</button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Col>
        </Row>
        <div ref="tesst">
          <Row >
            {categories === null || isLoading ? <Spinner /> :(categories.length === 0? <Empty/> :
              categories.map((item, index) => (<PostCategoryItem onDeleteHandle={this.deleteHandle} postCate={item} key={index} />)))}
          </Row>
        </div>
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <h4> Bạn có chắc chắn muốn {this.state.deletionFlg ? 'hiện' : 'ẩn'} {this.name} ?</h4>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button type="button" onClick={this._onDeleteItem} data-dismiss="modal" className="btn btn-primary">Đồng ý</button>
              </div>
            </div>
          </div>
        </div>
        {/* Edit modal */}
        <div ref="editModal" className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4> Sửa tên thể loại</h4>
              </div>
              <div className="modal-body">
                <input className="form-control" onChange={this.onChange} name="name" value={this.state.name} />
                <small ref='editErrMsg' className="" style={{ color: 'red' }}></small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button type="button" onClick={this._onChangeNameCategory} className="btn btn-primary">Đồng ý</button>
              </div>
            </div>
          </div>
        </div>
        {/* add modal */}
        <div ref="addModal" className="modal fade" id="addModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4> Thêm thể loại</h4>
              </div>
              <div className="modal-body">
                <input className="form-control" onChange={this.onChange} name="newName" placeholder="nhập tên ..." value={this.state.newName} />
                <small ref='addErrMsg' className="" style={{ color: 'red' }}></small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button type="button" onClick={this._onAddNewCategory} className="btn btn-primary">Lưu</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default PostCategory;

