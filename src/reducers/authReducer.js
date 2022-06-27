import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT_SUCCESS, SIGNUP_SUCCESS, 
  SIGNUP_ERROR, GET_ESTOKEN, GET_ESTOKEN_ERROR } from '../actions/types';

const initState = {
  authError: null,
  estoken: '',
}

export default authReducer = (state = initState, action) => {
  switch (action.type){
      case LOGIN_ERROR:
        return {
          ...state,
          authError: action.error
        }

      case LOGIN_SUCCESS:
        return {
          ...state,
          user: action.payload,
          authError: null
        }

      case LOGOUT_SUCCESS:
        return state

      case SIGNUP_SUCCESS:
        return {
          ...state,
          authError: null
        }

      case SIGNUP_ERROR:
        return {
          ...state,
          authError: action.error
        }

      case GET_ESTOKEN:
        return {
          ...state,
          estoken: action.payload,
        }

      case GET_ESTOKEN_ERROR:
        return {
          ...state,
          authError: action.error
        }
      
      default:
        return state
  }
}