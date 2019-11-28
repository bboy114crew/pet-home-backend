import React, { Component } from 'react';
import { Badge, Button } from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'
class LocationItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hiddenFlag: props.location.hiddenFlag
    }
  }

  _onClickUpdateLocation = () => {
    const location = this.props.location;
    const locationUpdate = { id: location._id, hiddenFlag: !this.state.hiddenFlag }
    axios.put('/api/admin/hideOrShowLocation', locationUpdate).then(res => {
      this._requestGetDelectionFlag();
    });
  }

  _requestGetDelectionFlag = () => {
    axios.get(`/api/admin/getLocationById/${this.props.location._id}`).then(res => {
      this.setState({
        hiddenFlag: res.data.result.hiddenFlag,
        isLoading: false
      })
    }).catch(err => {
      //todo
    });
  }

  _onClickBanLocation = () => {
    this.setState({
      isLoading: true,
    })
    this._onClickUpdateLocation();
  }

  _showModal = () => {
    window.showReportDetail();
  }

  _editProduct = (location) => {
    this.props.onEdit(location);
  }

  _deleteProduct = (location) => {
    this.props.onDelete(location);
  }

  render() {
    const { hiddenFlag: hiddenFlag } = this.state
    const style = hiddenFlag ? "secondary" : "danger";
    const text = hiddenFlag ? "Không hoạt động" : "Đang hoạt động";
    const { location } = this.props;
    const key = location._id;
    const maxRate = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= location.systemRating) {
        maxRate.push(1);

      } else if ((i) === location.systemRating + 0.5) {
        maxRate.push(0.5);
      } else {
        maxRate.push(0);
      }
    }
    // const date = new Date(location.updatedAt).toLocaleDateString() + ' ' + new Date(location.updatedAt).toLocaleTimeString();
    return (
      <tr key={key} style={this.state.isLoading ? { opacity: 0.4 } : { opacity: 1 }} onClick={this._showModal}>
        <td style={{ verticalAlign: "middle" }}>{location.name}</td>
        <td style={{ verticalAlign: "middle" }}>{location.address}</td>
        <td style={{ verticalAlign: "middle" }}>{location.description}</td>
        <td style={{ verticalAlign: "middle" }}>{location.typeId.name}</td>
        <td style={{ color: "orange", verticalAlign: "middle" }}>{maxRate.map(item => item === 1 ? <FontAwesomeIcon icon={faStar} size='1x' color='#F2BB05' /> : (item === 0.5 ? <FontAwesomeIcon icon={faStarHalfAlt} size='1x' color='#CCCCCC' /> : <span ><FontAwesomeIcon icon={faStar} size='1x' color='#CCCCCC' /></span>))}</td>
        <td style={{ verticalAlign: "middle" }}><Badge color={style}>{text}</Badge></td>
        {/* <td style={{verticalAlign:"middle"}}>
        <div>{userDetail.appName}</div>
          <div className="small text-muted">Đăng ký lúc: {date}
          </div>
        </td>
        <td style={{verticalAlign:"middle"}}><Badge color={style}>{text}</Badge></td> */}
        {!this.state.hiddenFlag ?
          <td style={{ verticalAlign: "middle" }}>
            <Button color="success" size="sm" onClick={this._onClickBanLocation}>Ẩn</Button>
          </td>
          : <td style={{ verticalAlign: "middle" }}>
            <Button color="warning" size="sm" onClick={this._onClickBanLocation}>Hiện</Button>
          </td>}
        <td style={{ verticalAlign: "middle" }}>
          {location.ownerId._id === this.props.user.user_id && this.props.user.role === 3 ?
            <Button
              color="success"
              size="sm"
              style={{ marginRight: 10 }}
              onClick={() => this._editProduct(location)}>
              <i className="fa fa-pencil-square-o"></i>
              <input type="hidden" value={location._id} />
            </Button> : null}
          {location.ownerId._id === this.props.user.user_id && this.props.user.role === 3 ?
            <button
              className="btn btn-sm btn-danger"
              onClick={() => this._deleteProduct(location)}
              data-toggle="modal"
              data-target="#deleteProduct">
              <i className="fa fa-trash"></i>
              <input type="hidden" value={location._id} />
            </button> : null}
        </td>
      </tr>
    )
  }

}

export default LocationItem;

