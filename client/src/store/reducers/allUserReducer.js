
import { GET_ALL_USERS, BAN_USER_BY_ID } from '../actions/types';

const initialState = {
  isLoading: false,
  allusers: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_USERS:
    
      return {
        ...state,
        allusers: action.payload
      };
    case BAN_USER_BY_ID:
      return {
        loading: true
      };
    default:
      return state;
  }
  
}
