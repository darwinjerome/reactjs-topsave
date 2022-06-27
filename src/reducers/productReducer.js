import { FETCH_PRODUCTS, CREATE_PRODUCT, SEARCH_PRODUCT, POST_PRODUCT, PRODUCT_ERROR } from '../actions/types';

// this is where you initialised application level states and variables
const initialState = {
  default: {
    items: [],
    items_total: 0,
  },
  isSearching: {
    search_results: [],
    search_results_total: 0,
  },
  isPosting: {
    item_images: {},
    item_details: []
  },
  productError: null
}

export default function(state = initialState, action){

  switch(action.type){
    default:
      return state;

    case FETCH_PRODUCTS:

      return {
        ...state,
        default: {
          items: action.payload,
          items_total: action.items_total,
        },        
        productError: null
      }
    
    case CREATE_PRODUCT:    
      console.log("Created Product", action.product)  
      return state;

    case SEARCH_PRODUCT:
      return {
        ...state,
        isSearching: {
          search_results: action.payload,
          search_results_total: action.search_results_total,
        },
        productError: null
      }

    case POST_PRODUCT:
    return {
      ...state,
      isPosting: {
        item_images: action.payload
      },
      productError: null
    }

    case PRODUCT_ERROR:
      return {
        ...state,
        productError: action.error
      }
  }
}