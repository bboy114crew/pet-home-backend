import axios from 'axios';

import {
  GET_PRODUCT_PARENT_CATEGORIES,
  GET_ERRORS,
  PRODUCT_PARENT_CATEGORIES_LOADING,
  CREATE_PRODUCT_PARENT_CATEGORIES,
  PRODUCT_PRODUCT_BY_USER_ID_LOADING,
  GET_PRODUCT_BY_USER_ID,
  DELETE_PRODUCT_BY_ID,
  DELETE_PRODUCT_CATEGORY_BY_ID,
  UPDATE_PRODUCT_CATEGORIES_BY_ID,
  GET_PRODUCT_DETAIL
} from './types';

// Get Product Category
export const getProductParentCategories = ownerId => dispatch => {
    dispatch(setProductParentCategoriesLoading());
    axios
      .get(`/api/product/category/${ownerId}`)
      .then(res =>
        dispatch({
          type: GET_PRODUCT_PARENT_CATEGORIES,
          payload: res.data.productParentCategories
        })
      )
      .catch(err =>
        dispatch({
          type: GET_PRODUCT_PARENT_CATEGORIES,
          payload: null
        })
      );
  };

export const createProduct = (product, history) => dispatch => {
  axios
    .post('/api/product/add', product)
    .then(res =>
        history.push('/product')
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


export const createProductParentCategories = productParentCategories => dispatch => {
  axios
    .post('/api/product/addProductParentCategory', productParentCategories)
    .then(res =>
      
        dispatch(
          {
            type: CREATE_PRODUCT_PARENT_CATEGORIES,
            payload: res.data
          },
        )
      )
    .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error 
        })
    );
  };
export const getProductByIds = ownerId => dispatch => {
  dispatch(setProductByUserIdLoading());
  axios
    .get(`/api/product/productByUserIds/${ownerId}`)
    .then(res =>
      dispatch({
        type: GET_PRODUCT_BY_USER_ID,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PRODUCT_BY_USER_ID,
        payload: null
      })
    );
};

export const getProductDetailById = id => dispatch => {
  axios
    .get(`/api/product/productDetailById/${id}`)
    .then(res =>
      dispatch({
        type: GET_PRODUCT_DETAIL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PRODUCT_DETAIL,
        payload: null
      })
    );
};
export const deleteProduct = product => dispatch => {
  axios
    .put(`/api/product/delete`,product)
    .then(res =>
      dispatch({
        type: DELETE_PRODUCT_BY_ID,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PRODUCT_BY_USER_ID,
        payload: null
      })
    );
};


export const deleteProductCategory = productCategories => dispatch => {
  axios
    .put(`/api/product/delete`,productCategories)
    .then(res =>
      dispatch({
        type: DELETE_PRODUCT_CATEGORY_BY_ID,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PRODUCT_BY_USER_ID,
        payload: null
      })
    );
};

export const updateProductCategory = productCategories => dispatch => {
  axios
    .put(`/api/product/updateProductCategory`,productCategories)
    .then(res =>
      dispatch({
        type: UPDATE_PRODUCT_CATEGORIES_BY_ID,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PRODUCT_BY_USER_ID,
        payload: null
      })
    );
};
export const updateProduct = (product, history) => dispatch => {
  axios
    .put(`/api/product/update`, product)
    .then(res =>
      history.push('/product')
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
export const setProductParentCategoriesLoading = () => {
  return {
    type: PRODUCT_PARENT_CATEGORIES_LOADING
  };
};

export const setProductByUserIdLoading = () => {
  return {
    type: PRODUCT_PRODUCT_BY_USER_ID_LOADING
  };
};
