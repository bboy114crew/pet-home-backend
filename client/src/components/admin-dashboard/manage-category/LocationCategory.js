import React, { Component } from 'react';
import { Card, CardHeader, Col, Row } from 'reactstrap';
import Spinner from '../../common/Spinner';
import axios from 'axios';
import LocationCategoryItem from './LocationCategoryItem';
import Empty from '../../common/Empty';
class LocationCategory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locationCategories: [],
      isLoading: true,
      name: '',
      newName: '',
      typeLocationEdit:"",
      typeLocation:''
    }
  }

  componentDidMount() {
    this._requestGetAllLocationCategories();
  }

  _requestGetAllLocationCategories = () => {
    axios.get('/api/location/locationCategories').then(res => {
      this.setState({
        locationCategories: res.data.locationCategories,
        isLoading: false
      })
    }).catch(err => {
      //todo
    });
  }

  _onDeleteItem = () => {
    const data = { id: this.state.itemId, field: 'hiddenFlag', value: !this.state.deletionFlg }
    axios.put('/api/admin/location/updateLocationCategories', data).then(res => {
      this._requestGetAllLocationCategories();
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
    const abc = { id: this.state.itemId, field: 'name', value: this.state.name }
    axios.put('/api/admin/location/updateLocationCategories', abc).then(res => {
      this.refs.editErrMsg.innerHTML = "";
      this._requestGetAllLocationCategories();
      window.hideEditModalLocation();
    }).catch(err => {
      this.refs.editErrMsg.innerHTML = err.response.data.error.message;
    });
  }

  _onAddNewCategory = () => {
    if (this.state.newName === '') {
      this.refs.addErrMsg.innerHTML = "Vui lòng không bỏ trống!";
      return;
    }
    const data = { name: this.state.newName, typeLocation: Number(this.state.typeLocation )}
    axios.post('/api/admin/location/addLocationCategory', data).then(res => {
      this._requestGetAllLocationCategories();
      this.refs.addErrMsg.innerHTML = "";
      window.hideAddModalLocation();
    }).catch(err => {
      this.refs.addErrMsg.innerHTML = err.response.data.error.message;
    });
  }
  deleteHandle = (obj) => {
    this.oldName = obj.name;
    this.setState({ name: obj.name, itemId: obj.id, deletionFlg: obj.deletionFlag, typeLocationEdit: Number(obj.typeLocation) })
  }

  _onSearch = (e) => {
    if(this.state.locationCategories.length !== 0)
      this._inputSearchAll(e);
  }
  _inputSearch = (e, val) =>{
    const list = this.refs.search.getElementsByClassName('nameItemValue');
    const listCheck = this.refs.search.getElementsByClassName('statusFlagLocation');
    const itemm = this.refs.search.getElementsByClassName('itemSearchLocation');
    for (let i = 0; i < list.length; i++) {
      if (list[i].innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1 && listCheck[i].value === val ) {
        itemm[i].style.display = '';
      }
      else {
        itemm[i].style.display = 'none';
      }
    }
  }
  _inputSearchAll = (e, val) =>{
    const list = this.refs.search.getElementsByClassName('nameItemValue');
    const itemm = this.refs.search.getElementsByClassName('itemSearchLocation');
    for (let i = 0; i < list.length; i++) {
      if (list[i].innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1 ) {
        itemm[i].style.display = '';
      }
      else {
        itemm[i].style.display = 'none';
      }
    }
  }
  oldName = '';

  onChange = (e) => {
    if(e.target.name==="typeLocationEdit")
      this.setState({ [e.target.name]: Number(e.target.value) });
    else
      this.setState({ [e.target.name]: e.target.value });
  }

  deleteHandle = (obj) => {
    this.oldName = obj.name;
    this.setState({ name: obj.name, itemId: obj.id, deletionFlg: obj.deletionFlag,typeLocationEdit:obj.typeLocation })
  }

  _filter = (val) => {
    const list = this.refs.search.getElementsByClassName('statusFlagLocation');
    const itemm = this.refs.search.getElementsByClassName('itemSearchLocation');
    for (let i = 0; i < list.length; i++) {
      if (list[i].value === val) {
        itemm[i].style.display = '';
      }
      else {
        itemm[i].style.display = 'none';
      }
    }
  }
  _filterByStatus = (e) => {
    this._showAll();
  }
  _showAll = () => {
    const itemm = this.refs.search.getElementsByClassName('itemSearchLocation');
    for (let i = 0; i < itemm.length; i++) {
      itemm[i].style.display = '';
    }
  }
  render() {
    const { locationCategories, isLoading } = this.state;
    return (
      <div>
        <Row>
          <Col>
            <Card >
              <CardHeader>
                <div className="form-group row">
                <input className="form-control col-sm-2" placeholder="Tìm theo tên" onChange={this._onSearch} name="name" style={{marginLeft:30,marginRight:20,marginTop:-5}}/>
                 <div style={{display:"none"}}>
                 <div className="form-check form-check-inline">
                    <input className="form-check-input" onClick={this._filterByStatus} type="checkbox" id="inlineCheckbox1"  ref='all' name="all" />
                    <label className="form-check-label" htmlFor="inlineCheckbox1">Tất cả</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" onClick={this._filterByStatus} type="checkbox" id="inlineCheckbox2" ref='on' name="on"/>
                    <label className="form-check-label" htmlFor="inlineCheckbox2">Hoạt động</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" onClick={this._filterByStatus} type="checkbox" id="inlineCheckbox3" ref='off' name="off"/>
                    <label className="form-check-label" htmlFor="inlineCheckbox3">Không hoạt động</label>
                  </div>
                 </div>
                  <div className="card-header-actions">
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addModalLocation"><i className="fa fa-plus"></i>  Thêm mới</button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Col></Row>
        <div ref="search">
          <Row>
            {locationCategories === null || isLoading ? <Spinner /> :(locationCategories.length === 0? <Empty/> :
              locationCategories.map((item, index) => (<LocationCategoryItem onDeleteHandle={this.deleteHandle} locationCate={item} key={index} />)))}
          </Row>
          <div className="modal fade" id="deleteModalLocation" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <h4> Bạn có chắc chắn muốn {this.state.deletionFlg ? 'hiện' : 'ẩn'} {this.oldName} ?</h4>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                  <button type="button" onClick={this._onDeleteItem} data-dismiss="modal" className="btn btn-primary">Đồng ý</button>
                </div>
              </div>
            </div>
          </div>
          {/* Edit modal */}
          <div  className="modal fade" id="editModalLocation" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4> Sửa tên thể loại</h4>
                </div>
                <div className="modal-body">
                  <input className="form-control" onChange={this.onChange} name="name" value={this.state.name} />
                  <small ref='editErrMsg' className="" style={{ color: 'red' }}></small>
                  <br/>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="typeLocationEdit" ref="publicEditL" onChange={this.onChange} checked={this.state.typeLocationEdit ===2} id="publicLocation" value="2"/>
                    <label className="form-check-label" htmlFor="publicLocation">
                      Địa điểm công cộng
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="typeLocationEdit" ref="privateEditL" onChange={this.onChange} checked={this.state.typeLocationEdit ===1} id="privateLocaton" value="1"/>
                    <label className="form-check-label" htmlFor="privateLocaton">
                      Địa điểm cá nhân
                    </label>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                  <button type="button" onClick={this._onChangeNameCategory} className="btn btn-primary">Đồng ý</button>
                </div>
              </div>
            </div>
          </div>
          {/* add modal */}
          <div className="modal fade" id="addModalLocation" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4> Thêm thể loại</h4>
                </div>
                <div className="modal-body">
                  <input className="form-control" onChange={this.onChange} name="newName" placeholder="nhập tên ..." value={this.state.newName} />
                  <small ref='addErrMsg' className="" style={{ color: 'red' }}></small>
                  <br/>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="typeLocation" onChange={this.onChange} id="publicLocation1" value="2" defaultChecked/>
                    <label className="form-check-label" htmlFor="publicLocation1">
                      Địa điểm công cộng
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="typeLocation" onChange={this.onChange} id="privateLocaton1" value="1"/>
                    <label className="form-check-label" htmlFor="privateLocaton1">
                      Địa điểm cá nhân
                    </label>
                  </div>
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
      </div>)
  }

}

export default LocationCategory;

