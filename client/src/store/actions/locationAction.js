import axios from 'axios';

import {
  CLEAR_ERRORS,
  GET_LOCATIONCATEGORIES,
  CATEGORY_LOADING,
  GET_LOCATION_DETAIL,
  GET_ERRORS,
  UPDATE_LOCATION_SUCCESS
} from './types';

export const addlocationByAdmin = (locationData, history) => dispatch => {
  axios
    .post('/api/admin/addLocaionByAdmin', locationData)
    .then(res => history.push('/admin/location'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.error
      })
    );
};

// Get Posts
export const getLocationCategories = type => dispatch => {
  dispatch(setCategoryLoading());
  axios
    .get(`/api/location/locationCategoriesByType/${type}`)
    .then(res =>
      dispatch({
        type: GET_LOCATIONCATEGORIES,
        payload: res.data.locationCategories
      })
    )
    .catch(err =>
      dispatch({
        type: GET_LOCATIONCATEGORIES,
        payload: null
      })
    );
};

// Get location detail
export const getLocations = ownerId => dispatch => {
  axios
    .get(`/api/location/detail/${ownerId}`)
    .then(res =>
      dispatch({
        type: GET_LOCATION_DETAIL,
        payload: res.data.locationProfile
      })
    )
    .catch(err =>
      dispatch({
        type: GET_LOCATION_DETAIL,
        payload: null
      })
    );
};

export const updateLocation = (location, history) => dispatch => {
  axios
    .put(`/api/location/update`, location)
    .then(res =>
      {
        history.push('/admin/location');
        dispatch({
          type: UPDATE_LOCATION_SUCCESS,
          payload: res.data.locationProfile
        })
      }
    )
    .catch(err =>
      {
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    );
};

export const deleteAdminLocation = (location, history) => dispatch => {
  axios
    .put(`/api/admin/deleteAdminLocation`, location)
    .then(res =>
      {
        history.push('/admin/location');
        dispatch({
          type: UPDATE_LOCATION_SUCCESS,
          payload: res.data.locationProfile
        })
      }
    )
    .catch(err =>
      {
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    );
};

export const updatePrivateLocation = (location, history) => dispatch => {
  axios
    .put(`/api/location/update`, location)
    .then(res =>
      {
        dispatch({
          type: UPDATE_LOCATION_SUCCESS,
          payload: res.data.locationProfile
        })
      }
    )
    .catch(err =>
      {
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    );
};

// Set loading state
export const setCategoryLoading = () => {
  return {
    type: CATEGORY_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
