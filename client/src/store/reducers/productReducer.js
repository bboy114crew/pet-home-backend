import {
    CREATE_PRODUCT,
    GET_PRODUCT_PARENT_CATEGORIES,
    PRODUCT_PARENT_CATEGORIES_LOADING,
    CREATE_PRODUCT_PARENT_CATEGORIES,
    PRODUCT_PRODUCT_BY_USER_ID_LOADING,
    GET_PRODUCT_BY_USER_ID,
    GET_PRODUCT_DETAIL,
    UPDATE_PRODUCT_CATEGORIES_BY_ID,
    DELETE_PRODUCT_CATEGORY_BY_ID
  } from '../actions/types';
  
  const initialState = {
    productParentCategories: [],
    productParentCategory: {},
    productByUserIds: [],
    productDetail: {},
    loading: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
        case CREATE_PRODUCT:
          return {
            ...state,
            loading: true
          };
        case PRODUCT_PARENT_CATEGORIES_LOADING:
          return {
            ...state,
            loading: true
          };
        case GET_PRODUCT_PARENT_CATEGORIES:
          return {
            ...state,
            productParentCategories: action.payload,
            loading: false
          };
        case CREATE_PRODUCT_PARENT_CATEGORIES:
          return {
            ...state,
            loading: true
          }
        case PRODUCT_PRODUCT_BY_USER_ID_LOADING:
          return {
            ...state,
            loading: true
          };
        case GET_PRODUCT_BY_USER_ID:
          return {
            ...state,
            productByUserIds: action.payload,

            loading: false
          };
        case GET_PRODUCT_DETAIL:
          return {
            ...state,
            productDetail: action.payload,
            loading: false
          };
        case UPDATE_PRODUCT_CATEGORIES_BY_ID:
          return {
            ...state,
            loading: false
          };
        case DELETE_PRODUCT_CATEGORY_BY_ID:
          return {
            ...state,
            loading: false
          };
        default:
          return state;
      }
  }
  