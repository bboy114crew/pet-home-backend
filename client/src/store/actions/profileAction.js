import axios from 'axios';

import {
   GET_PROFILE
} from './types';

// Get Profile
export const getProfile = ownerId => dispatch => {
    axios
      .get(`/api/location/profile/${ownerId}`)
      .then(res =>
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_PROFILE,
          payload: null
        })
      );
  };