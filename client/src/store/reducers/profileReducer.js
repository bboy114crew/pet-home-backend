import {
    GET_PROFILE
  } from '../actions/types';
  
const initialState = {
    profile: {},
    loading: false
};
  
export default function(state = initialState, action) {
  switch (action.type) {
      case GET_PROFILE:
        console.log(action.payload)
        return {
          ...state,
          profile: action.payload,
          loading: true
        };
        default:
          return state;
      }
      
  }