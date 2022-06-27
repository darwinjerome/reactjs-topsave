import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT_SUCCESS, 
  SIGNUP_SUCCESS, SIGNUP_ERROR, GET_ESTOKEN, GET_ESTOKEN_ERROR } from '../actions/types';

import FirebaseInstance from '../utils/firebase'

export const signIn = (credentials) => {
  return (dispatch, getState, {getFirebase}) => {

    const firebase = getFirebase()

    firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        // Success
        dispatch({
          type: LOGIN_SUCCESS
        })
      })
      .catch((error) => {

        if (error.code == 'auth/user-not-found') {          
          error.message = "Sorry, we couldn't find that email on our record. You probably have used another email address?"
          error.type = "userid"

        }else if (error.code == 'auth/invalid-email') {          
          error.message = "Oops! Make sure you have the right email format. ie: user@email.com"
          error.type = "userid"
    
        }else if (error.code == 'auth/wrong-password') {          
          error.message = "Sorry, that password is incorrect. We can help you recover your password."
          error.type = "userpassword"
          
        }
        dispatch({ type: LOGIN_ERROR, error})
      })  
  }
}

export const signOut = () => {
  return (dispatch, getState, {getFirebase}) => {
    
    const firebase = getFirebase()

    // signs-out the user from firebase
    firebase.auth().signOut().then(()=>{

      //signs-out firebase instance
      firebase.logout();

      //dispatch logout success
      dispatch({
        type: LOGOUT_SUCCESS
      })
    })
  }
}

export const signUp = (newUser) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase()
    const firestore = getFirestore()

    // Register user and then update displayName
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((res) => {
      return firestore.collection('users').doc(res.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      })   
    })
    .then(()=>{
      dispatch({
        type: SIGNUP_SUCCESS
      })
    })
    .catch((error) => {
      dispatch({
        type: SIGNUP_ERROR, error
      })
    }); 
  }
}

export const onAuthStateChanged = (user) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {

    const firebase = getFirebase();

    // Check if firebase user exists then navigate to our appropriate place
		firebase.auth().onAuthStateChanged((user) => {

      if (user) {
        // User is signed in.
        console.log(user)
        // Dispatch user object to the store
        dispatch({
          type: LOGIN_SUCCESS,
          payload: user
        });
      } else {
        // No user is signed in.
      }

			// // This function gets the ElasticSearch token from Firebase cloud functions
			// // then saves the authenticated user data on redux for global state management
			// this.props.setUser(user).then((res)=>{

			// 	console.log("Setuser ", res)
			// 	// Listen for auth ready (promise available on store thanks to attachAuthIsReady: true config option)
			// 	store.firebaseAuthIsReady.then(() => {
			// 		console.log('Auth has loaded') // eslint-disable-line no-console

			// 		// Check status of firebase user. This will switch to the App screen or Auth screen and this loading
			// 		// screen will be unmounted and thrown away.
			// 		this.props.navigation.navigate(res ? 'App' : 'Auth')
			// 	})	
      // })
      
		})
  }
}

export const getElasticSearchToken = () => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {

    const fbfunction = getFirebase().functions()
    
    //Triggers Firebase cloud function to send ElasticSearch token
    fbfunction.httpsCallable('authOnSendConfig')()
      .then((result) => {
        
        //Dispatch ElasticSearch token to the store
        dispatch({
          type: GET_ESTOKEN,
          payload: result.data.authorization
        })
      })
      .catch(function(error) {
        // Getting the Error details.
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.log("setUser Error: ", message)

        //Dispatch errors
        dispatch({
          type: GET_ESTOKEN_ERROR, error
        })
      });
  }
}