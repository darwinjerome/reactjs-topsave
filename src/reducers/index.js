import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import authReducer from './authReducer';
import userReducer from './userReducer';
import productReducer from './productReducer';

export default combineReducers ({
  auth: authReducer,
  user: userReducer,
  products: productReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
})