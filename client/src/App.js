import React, { Component } from 'react';
import './App.css';
import './App.scss';
import { BrowserRouter as Router,Route, Switch } from 'react-router-dom';
import PhoneVertification from './components/auth/PhoneVertification';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ForgetPass from './components/auth/ForgetPass';
import SendPassSuccess from './components/auth/SendPassSuccess';
import RegisterSuccess from './components/auth/RegisterSuccess';

import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './store/actions/authActions';

import { Provider } from 'react-redux';
import store from './store/store';

import PrivateRoute from './components/common/PrivateRoute';
import NotFound from './components/not-found/NotFound';

import DefaultLayout from './components/layout/DefaultLayout';
import UploadImage from './components/uploadImage/UploadImage';
import DefaultLayoutAdmin from './components/admin-dashboard/layout/DefaultLayoutAdmin';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // TODO: Clear current Profile

    // Redirect to login
    window.location.href = '/login';
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Login} />
            <Route exact path="/phoneVertification" component={PhoneVertification} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/forgetPass" component={ForgetPass} />
            <Route exact path="/sendPassSuccess" component={SendPassSuccess} />
            <Route exact path="/register-success" component={RegisterSuccess} />
            <Route exact path="/upload" component={UploadImage} />
            <Switch>
              <PrivateRoute path="/pro" component={DefaultLayout} />
              <PrivateRoute path="/profile" component={DefaultLayout} />
              <PrivateRoute path="/product/add" component={DefaultLayout} />
              <PrivateRoute path="/product/edit" component={DefaultLayout} />
              <PrivateRoute path="/product" component={DefaultLayout} />
              <PrivateRoute path="/chgpwd" component={DefaultLayout} />
              <PrivateRoute path="/category" component={DefaultLayout} />
              <PrivateRoute path="/locationDetail" component={DefaultLayout} />
              {/* admin */}
              <PrivateRoute path="/admin/allusers" component={DefaultLayoutAdmin}/>
              <PrivateRoute path="/admin/report" component={DefaultLayoutAdmin} />
              <PrivateRoute path="/admin/report/detail" component={DefaultLayoutAdmin} />
              <PrivateRoute path="/admin/category/location" component={DefaultLayoutAdmin} />
              <PrivateRoute path="/admin/category/post" component={DefaultLayoutAdmin} />
              <PrivateRoute path="/admin/location" component={DefaultLayoutAdmin} />
              <PrivateRoute path="/admin/location/add" component={DefaultLayoutAdmin} />
              <PrivateRoute path="/admin/location/edit" component={DefaultLayoutAdmin} />
              <PrivateRoute path="/admin/chgpwd" component={DefaultLayoutAdmin} />
            </Switch>
            <Route exact path="/not-found" component={NotFound} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
