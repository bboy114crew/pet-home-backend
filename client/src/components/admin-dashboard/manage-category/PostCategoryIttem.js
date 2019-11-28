import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';

class PostCategoryIttem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.postCate._id,
      deletionFlag: this.props.postCate.deletionFlag,
      name: this.props.postCate.name
    }
  }

  componentDidMount() {
  }

  _deleteItem = () => {
    this.props.onDeleteHandle({ id: this.props.postCate._id, deletionFlag: this.props.postCate.deletionFlag, name: this.props.postCate.name });
  }
  
  render() {
    const { postCate } = this.props;
    const date = new Date(postCate.updatedAt).toLocaleDateString();
    const typeColor = postCate.deletionFlag ? 'card-accent-secondary' : 'card-accent-warning';
    return (
      <Col xs="12" sm="4" md="3" className="itemSearch" >
        <input type="hidden" className="statusFlagPost" value={postCate.deletionFlag ? 'off' : 'on'} />
        <Card className={typeColor} >
          <CardHeader>
            <span ref="nameItem" className="nameItem">{postCate.name}</span>
            <div className="card-header-actions">
              <a className="card-header-action btn btn-close" onClick={this._deleteItem} data-toggle="modal" data-target="#editModal"><i className="icon-pencil"></i></a>
              <a className="card-header-action btn btn-close" onClick={this._deleteItem} data-toggle="modal" data-target="#exampleModal">
                <i className="icon-close"></i>
              </a>
            </div>
          </CardHeader>
          <CardBody className="">
            <div className="callout callout-warning row">
              <div className="col-sm-6">
                <small className="text-muted">Số bài viết</small>
                <br />
                <strong className="h4">{postCate.count}</strong>
              </div>
              <div className="col-sm-6">
                <small className="text-muted">Ngày tạo</small>
                <br />
                <strong className="">{date}</strong>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }

}

export default PostCategoryIttem;

