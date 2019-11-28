import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Button,
} from 'reactstrap';
import Spinner from '../../common/Spinner'
import Notifications, { notify } from 'react-notify-toast'
import SpinnerU from './../../uploadImage/Spinner'
import Images from './../../uploadImage/Images'
import Buttons from './../../uploadImage/Buttons'
import WakeUp from './../../uploadImage/WakeUp'
import './../../uploadImage/UploadImage.css'
import { GoogleMap, withGoogleMap, Marker } from "react-google-maps"
import { updateLocation, addlocationByAdmin, getLocationCategories } from '../../../store/actions/locationAction'
import * as Constants from './../../../utils/constants';
import Geosuggest from 'react-geosuggest';

const toastColor = { 
  background: '#505050', 
  text: '#fff' 
}

const MapComponent = withGoogleMap(props =>
  <GoogleMap
    defaultCenter = { props.getDefaultCenter }
    defaultZoom = { 13 }
    center={ props.getDefaultCenter }
    onClick={props.onMapClick}
  >
    <Marker position={props.getLatLong} />
  </GoogleMap>
)

class EditLocation extends Component {
  
  constructor(props) {
    super(props);
    const {address, description, images, location, name, typeId} = this.props.location.state.data;
    this.state = {
      images,
      name,
      typeLocationCategory: typeId._id ,
      description,
      loadingU: true,
      uploading: false,
      modal: false,
      address,
      locationCategories: [],
      location,
      latlong: { lat: location.coordinates[1], lng: location.coordinates[0] }
    };
  }

  getLatLong = (event) =>{    
    var lat = event.latLng.lat(), long = event.latLng.lng();
    this.setState({
      latlong:{
        lat:lat, 
        lng:long
      }
    });
  }

  componentDidMount() {
    this.props.getLocationCategories(Constants.PUBLIC_LOCATION);
    fetch(`/api/wake-up`)
      .then(res => {
        if (res.ok) {
          return this.setState({ loadingU: false })  
        }
        const msg = 'Something is went wrong with server' 
        this.toast(msg, 'custom', 2000, toastColor)
      })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errors) {
      return { errors: nextProps.errors};
    }
    else return null;
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.locationApp !== prevProps.locationApp) {
      this.setState({
        modal: !this.state.modal
      });
    }
  }

  onSubmit = e => {
    e.preventDefault();
    if(this.state.name ===''
    ||this.state.address ===''){
      if(this.state.name ==='') {this.refs.nameValidate.innerHTML ='Vui lòng nhập tên địa điểm';this.refs.nameValidate1.classList.add('is-invalid')}
      if(this.state.address ==='') {this.refs.addressValidate.innerHTML ='Vui lòng nhập địa chỉ';this.refs.addressValidate1.classList.add('is-invalid')}
      if(this.state.description ===0) {this.refs.descriptionValidate.innerHTML ='Vui lòng mổ tả';this.refs.descriptionValidate1.classList.add('is-invalid')}
      return false;
    }

    const { name, typeLocationCategory, description, address, images } = this.state

    const addedImages = images.map(item => { 
      return {
        public_id: item.public_id,
        width: item.width,
        height: item.height,
        format: item.format,
        bytes: item.bytes,
        secure_url: item.secure_url
    }})
    const location =  {
      type: 'Point',
      coordinates: [this.state.latlong.lng,this.state.latlong.lat]
    }
    const updatedLocation = {
      name,
      typeId: typeLocationCategory,
      description,
      address,
      images: addedImages,
      location: location,
      ownerId: this.props.auth.user.user_id,
      _id: this.props.location.state.data._id
    };
    this.props.updateLocation(updatedLocation, this.props.history);
  }

  onCancel = (e) => {
    this.props.history.push('/product');
  }

  toast = notify.createShowQueue()

  onChangeU = e => {
    const errs = [] 
    const files = Array.from(e.target.files)

    if (files.length > 5) {
      const msg = 'Bạn chỉ co thể tải lên 5 ảnh'
      return this.toast(msg, 'custom', 2000, toastColor)  
    }

    const formData = new FormData()
    const types = ['image/png', 'image/jpeg', 'image/gif']

    files.forEach((file, i) => {

      if (types.every(type => file.type !== type)) {
        errs.push(`'${file.type}' không phải dịnh dạng phù hợp`)
      }

      if (file.size > 10000000) {
        errs.push(`'${file.name}' quá lớn, bạn hãy chọn file kích cỡ nhỏ hơn`)
      }

      formData.append(i, file)
    })

    if (errs.length) {
      return errs.forEach(err => this.toast(err, 'custom', 2000, toastColor))
    }

    this.setState({ uploading: true })

    fetch(`/api/image-upload`, {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        throw res
      }
      return res.json()
    })
    .then(images => {
      this.setState({
        uploading: false, 
        images
      })
    })
    .catch(err => {
      err.json().then(e => {
        this.toast(e.message, 'custom', 2000, toastColor)
        this.setState({ uploading: false })
      })
    })
  }

  filter = id => {
    return this.state.images.filter(image => image.public_id !== id)
  }

  removeImage = id => {
    this.setState({ images: this.filter(id) })
  }

  onError = id => {
    this.toast('Oops, something went wrong', 'custom', 2000, toastColor)
    this.setState({ images: this.filter(id) })
  }

  renderOptionItem = (item, index) => {
    return (
      <option key={index} value={item._id} >{item.name}</option>
    );
  }

  onChangeTypeLocation = e => {
    this.setState({typeLocationCategory: e.target.value,isUpdate: false});
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  getLatLong = (event) =>{    
    var lat = event.latLng.lat(), long = event.latLng.lng();
    this.setState({
      latlong:{
        lat:lat, lng:long
      }
    });
  }

  getLocationCenter =(suggest) => {
    if(suggest){
      const { location } = suggest;
      const { lat, lng} = location;
      this.setState({
        latlong: {
          lat, lng
        },
        address: suggest.description
      })
    }
  }

  render() {
    const { loadingU, uploading, images } = this.state
    const { locationCategories, loading } = this.props.locationApp;  
    const content = () => {
      switch(true) {
        case loadingU:
          return <WakeUp />
        case uploading:
          return <SpinnerU />
        case images.length > 0:
          return <Images 
                  images={images}
                  removeImage={this.removeImage} 
                  onError={this.onError}
                 />
        default:
          return <Buttons onChange={this.onChangeU} />
      }
    }
    return (
      <div className="addProduct">
        <div className="row">
          <div className="col-md-7">           
            <Col xs="12" sm="12">
              <Card>
                <CardHeader>
                  <strong>Địa điểm</strong>
                </CardHeader>
                <CardBody>
                  <FormGroup row className="my-0 mt-2">
                    <Col xs="7">
                      <Label htmlFor="textarea-input">Ảnh</Label>
                      <div className='container'>
                        <Notifications />
                        <div className='buttons'>
                          {content()}
                        </div>                        
                      </div>
                      <div style={{display:'block'}} ref='imageValidate' className="invalid-feedback"></div>
                    </Col>
                  </FormGroup>
                <FormGroup>
                  <Label htmlFor="company">Tên địa điểm</Label>
                  <input ref='nameValidate1'
                    type="text"
                    className={classnames('form-control form-control-lg')}
                    placeholder="Tên địa điểm"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                  />
                  <div style={{display:'block'}} ref='nameValidate' className="invalid-feedback"></div>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="company">Địa chỉ</Label>
                  <input ref='addressValidate1'
                    type="text"
                    className={classnames('form-control form-control-lg')}
                    placeholder="Địa chỉ"
                    name="address"
                    value={this.state.address}
                    onChange={this.onChange}
                  />
                  <div style={{display:'block'}} ref='addressValidate' className="invalid-feedback"></div>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="company">Tìm địa chỉ</Label>
                  <Geosuggest 
                    style={{ width: '100%'}}
                    className='form-control form-control-lg' 
                    onSuggestSelect={this.getLocationCenter} 
                    placeholder='Tìm địa chỉ'
                    width={`100%`}/>
                  <div style={{display:'block'}} ref='addressValidate' className="invalid-feedback"></div>
                </FormGroup>
                <FormGroup row className="my-0 mt-3">
                  <Col xs="6">
                    <Label htmlFor="ccyear">Loại</Label>
                    { locationCategories === null || loading ? <Spinner /> :   
                      <Input 
                        type="select" 
                        name="ccyear" 
                        id="ccyear"
                        value={this.state.typeLocationCategory}
                        onChange={this.onChangeTypeLocation}
                        >
                        { locationCategories.map((item, index) => this.renderOptionItem(item,index))}
                      </Input>
                    }
                    </Col>
                  </FormGroup>
                  <FormGroup row className="my-0 mt-3">
                    <Col xs="7">
                      <Label htmlFor="textarea-input">Mô tả</Label>
                        <textarea
                          ref='descriptionValidate1'
                          className="form-control form-control-lg"
                          name="description" 
                          id="textarea-input" 
                          rows="7"
                          placeholder="Nội dung mô tả..." 
                          value={this.state.description}
                          onChange={this.onChange}>
                        </textarea>
                        <div style={{display:'block'}} ref='descriptionValidate' className="invalid-feedback"></div>
                    </Col>
                  </FormGroup>
                  <div style={{marginTop:20}}>
                    <FormGroup row className="my-0">
                      <Col col="6" sm="4" md="4" className="mb-3 mb-xl-0">
                        <Button block color="primary" onClick={this.onSubmit}>Cập nhật</Button>
                      </Col>
                      <Col col="5" sm="4" md="2" className="mb-xl-0">
                        <Button block color="secondary" onClick={this.onCancel}>Hủy</Button>
                      </Col>
                    </FormGroup>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </div> 
          <div className="col-md-5"> 
            <Col xs="12" sm="12">
              <Card>
                <CardHeader>
                  <strong>Địa điểm</strong>
                </CardHeader>
                <CardBody>
                  <MapComponent
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: '500px' , width: `100%`}} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    onMapClick={this.getLatLong}
                    getLatLong={this.state.latlong}
                    getDefaultCenter={this.state.latlong}
                  />
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
  errors: state.errors,
  product: state.product,
  locationApp: state.locationApp
});

export default connect(mapStateToProps, { updateLocation, addlocationByAdmin, getLocationCategories })(withRouter(EditLocation));