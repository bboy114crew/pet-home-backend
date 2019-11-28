import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER, GET_CODE, SEND_PASS_LOADING , RESET_STATE} from './types';

export const itemsHasErrored = (bool) => dispatch => {
  dispatch( {
      type: 'ITEMS_HAS_ERRORED',
      payload: bool
  });
}

export const itemsIsLoading = (bool) => dispatch => {
  dispatch( {
      type: 'ITEMS_IS_LOADING',
      isLoading: bool
  });
}

export const itemsFetchLCSuccess = (items) => dispatch => {
  dispatch( {
      type: 'ITEMS_FETCH_LC_SUCCESS',
      items
  });
}

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/auth/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.error
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/auth/login', userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.error 

      })
    );
};

// Login - Get User Token
export const forgetPass = phone => dispatch => {
  axios
    .get(`/api/users/forgotPassword/${phone}`)
    .then(res => {     
      dispatch(
        {
          type: GET_CODE,
          payload: res.data
        },        
      )
    })
    .catch(err =>
      {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error 
        })
      }
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const setStateToDefault = () => {
  return {
    type: RESET_STATE
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch(setStateToDefault());
};

export const setSendPassLoading = () => {
  return {
    type: SEND_PASS_LOADING
  };
};
