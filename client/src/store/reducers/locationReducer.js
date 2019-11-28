import {
  GET_LOCATIONCATEGORIES,
  CATEGORY_LOADING,
  GET_LOCATION_DETAIL,
  GET_ERRORS,
  UPDATE_LOCATION_SUCCESS
} from '../actions/types';

const initialState = {
  locationCategories: [],
  locationCategory: {},
  locationDetail: {},
  loading: false,
  locationUpdateSuccess: false,
  error: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CATEGORY_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_LOCATIONCATEGORIES:
      return {
        ...state,
        locationCategories: action.payload,
        loading: false
      };
    case GET_LOCATION_DETAIL: 
      return {
        ...state,
        locationDetail: action.payload,
        loading: false
      }
    case UPDATE_LOCATION_SUCCESS:
      return {
        ...state,
        locationDetail: action.payload,
        locationUpdateSuccess: true
      }
    case GET_ERRORS: 
      return {
        ...state,
        locationUpdateSuccess: false,
        error: action.payload
      }
    default:
      return state;
  }
}
