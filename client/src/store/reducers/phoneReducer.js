import {
  GET_CODE,
  CODE_LOADING,
  GET_CHECK_CODE_RES,
  CLEAR_MSC,
  CLEAR_MCC
} from '../actions/types';

const initialState = {
  code: '',
  messageSendCode: '',
  messageCheckCode: '',
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CODE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CODE:
      return {
        ...state,
        messageSendCode: action.payload,
        loading: false
      };
    case GET_CHECK_CODE_RES:
      return {
        ...state,
        messageCheckCode: action.payload,
        loading: false
      };
    case CLEAR_MSC:
      return {
        ...state,
        messageSendCode: '',
      };
    case CLEAR_MCC:
      return {
        ...state,
        messageCheckCode: '',
      };     
    default:
      return state;
  }
}
