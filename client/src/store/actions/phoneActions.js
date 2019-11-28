import axios from 'axios';

import {
  CODE_LOADING,
  CLEAR_ERRORS,
  GET_CODE,
  GET_ERRORS,
  GET_CHECK_CODE_RES,
  CLEAR_MCC,
  CLEAR_MSC
} from './types';

export const getVertificationCode = phoneData => dispatch => {
  dispatch(setSendCodeLoading());
  axios
    .post('/api/phone/sms', phoneData)
    .then(res =>
      {
        dispatch(
          {
            type: GET_CODE,
            payload: res.data
          },        
        )
      }
     )
    .catch(err =>
      {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error 
        })
      }
    );
};

export const getVertify = phoneData => dispatch => {
  dispatch(setSendCodeLoading());
  axios
    .post('/api/phone/verify', phoneData)
    .then(res =>
      {
        dispatch(
          {
            type: GET_CHECK_CODE_RES,
            payload: res.data
          },        
        )
      }
     )
    .catch(err =>
      {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error 
        })
      }
    );
};

// Set loading state
export const setSendCodeLoading = () => {
  return {
    type: CODE_LOADING
  };
};

export const clearMessageSendCode = () => {
  return {
    type: CLEAR_MSC
  };
};

export const clearmessageCheckCode = () => {
  return {
    type: CLEAR_MCC
  };
};

export const clearErrorsProps = () => {
  return {
    type: CLEAR_ERRORS
  };
};