import React from 'react';
import { Link } from 'react-router-dom';

const SendPassSuccess = () => {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
      <div className="forgotPass">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto text-center">
              <h2>Mật khẩu mới đã được gửi tới số điện thoại của bạn!</h2>
              <Link style={{ width:'100%',textDecoration:'none', borderRadius:25 }} className="btn-lg btn-warning btn-block mt-4 text-center" to={{ pathname: '/login' }}>Quay về trang đăng nhập</Link>
            </div>
          </div>
        </div></div>
        </div>
      </div>
    );
}

export default SendPassSuccess;