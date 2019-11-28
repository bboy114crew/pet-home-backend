import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

class LocationCategoryItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.locationCate._id,
      deletionFlag: this.props.locationCate.hiddenFlag,
      name: this.props.locationCate.name
    }
  }

  componentDidMount() {
  }
  
  _deleteItem = () => {
    this.props.onDeleteHandle({ id: this.props.locationCate._id, deletionFlag: this.props.locationCate.hiddenFlag, name: this.props.locationCate.name,typeLocation: this.props.locationCate.typeLocation });
  }

  render() {
    const { locationCate } = this.props;
    const type = locationCate.typeLocation === 1 ? 'Địa điểm cá nhân' : 'Địa điểm công cộng';
    const typeColor = locationCate.typeLocation === 1 ? 'card-accent-warning' : 'card-accent-primary';
    const date = new Date(locationCate.updatedAt).toLocaleDateString();
    const classnametype = locationCate.hiddenFlag ? 'badge-secondary' : 'badge-success';
    // const date = new Date(locationCate.createdAt).toDateString();
    return (<Col xs="12" sm="4" md="3" className="itemSearchLocation"  >
      <input type="hidden" className="statusFlagLocation" value={locationCate.hiddenFlag ? 'off' : 'on'} />
      <Card className={typeColor} >
        <CardHeader>
          <span ref="nameItemValue" className="nameItemValue">{locationCate.name}</span>
          <span className={classnametype} style={{ marginLeft: 3, verticalAlign: 'middle', paddingLeft: 5, paddingRight: 5, borderRadius: 5, fontSize: 7, marginBottom: 4 }}></span>
          <div className="card-header-actions">
            <a className="card-header-action btn btn-close" onClick={this._deleteItem} data-toggle="modal" data-target="#editModalLocation"><i className="icon-pencil"></i></a>
            <a className="card-header-action btn btn-close" onClick={this._deleteItem} data-toggle="modal" data-target="#deleteModalLocation">
              <i className="icon-close"></i>
            </a>
          </div>
        </CardHeader>
        <CardBody className="">
          <div className="callout callout-danger row">
            <div className="col-sm-4">
              <small className="text-muted">Số địa điểm</small>
              <br />
              <strong className="h4">{locationCate.count}</strong>
            </div>
            <div className="col-sm-8">
              <small className="text-muted">Ngày tạo: {date}</small>
              <br />
              <strong className="h5">{type}</strong>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>);
  }

}

export default LocationCategoryItem;

