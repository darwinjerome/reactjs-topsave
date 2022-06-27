import { GET_USER_FBAUTH } from './types';
import { firebaseFunctions } from '../utils/firebase';


// export const setUser = (user) => (dispatch, getState ) => {
//   return new Promise((resolve, reject) => {
      
//     //Triggers Firebase cloud function to send ElasticSearch token
//       firebaseFunctions.httpsCallable('sendConfig')()
//         .then((result) => {

//           //Dispatch ElasticSearch token to the store
//           dispatch({
//             type: GET_USER_FBAUTH,
//             payload: result.data.authorization
//           })
//         })
//         .then(() => {
          
//           // Dispatch user object to the store
//           // dispatch({
//           //   type: SET_USER,
//           //   payload: user
//           // });

//           resolve(user)
//         })
//         .catch(function(error) {
//           // Getting the Error details.
//           var code = error.code;
//           var message = error.message;
//           var details = error.details;
//           console.log("setUser Error: ", message)
//           reject (details)
//           // ...
//         });
//   })
// }


export const getUserInitials = (userDisplayName) => {
  
  let initials = userDisplayName.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials
}