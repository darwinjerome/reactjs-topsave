import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import firebase from './utils/firebase';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {};

// Create middleware using thunk which will allow pass function through redux actions
// Then include extra arguments in thunk to pass objects (Firebase and Firestore)
const middleware = [thunk.withExtraArgument({ getFirebase, getFirestore })];

// Use this if using any DevTools
const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

// react-redux-firebase config
const rrfConfig = {
  useFirestoreForProfile: true,
  userProfile: 'users',
  enableRedirectHandling: false ,
  attachAuthIsReady: true,
}

// use applyMiddleware and other store enhancers
const enhancer = composeEnhancers(
  applyMiddleware(...middleware),
  reduxFirestore(firebase),
  reactReduxFirebase(
    firebase, rrfConfig),
);

// This create store for the application
// Then pass in default state of the application
// Then compose several enhancers which includes the middleware, reduxFirestore and reactReduxFirebase.
export default store = createStore(rootReducer, initialState, enhancer);