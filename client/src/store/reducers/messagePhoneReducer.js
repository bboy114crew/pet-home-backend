import { GET_MESSAGE_PHONE } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MESSAGE_PHONE:
      return action.payload;
    default:
      return state;
  }
}
