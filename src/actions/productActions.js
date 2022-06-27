import { FETCH_PRODUCTS, CREATE_PRODUCT, SEARCH_PRODUCT, POST_PRODUCT, PRODUCT_ERROR } from './types';

import { firebaseFunctions } from '../utils/firebase';

const ref = {
  queryRef: null,
  queryRefNext: null,
  products: [],
  error: null,
}

const LIMIT_PER_PAGE = 9

// export const fetchProducts = () => (dispatch, getState, { getFirebase, getFirestore }) => {
  
//   /* Set common Firestore reference */
//   ref.queryRef = getFirestore().collection('products').orderBy('createdAt', 'asc')

//   // Load first page 
//   const firstPage = ref.queryRef.limit(LIMIT_PER_PAGE)
//   fetchNextProducts(firstPage)
//     .then( (returnedSnapshot) => {
//       if(ref.error){
//         dispatch({
//           type: PRODUCT_ERROR,
//           payload: ref.error
//         })
//       }else{
//         dispatch({
//           type: FETCH_PRODUCTS,
//           payload: ref.products,
//           queryRefNext: ref.queryRefNext
//         })
//       }
//     })
// }

export const fetchNextPage = (queryRef) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {

      //load next pages  
      fetchNextProducts(queryRef)
        .then( (returnedSnapshot) => {
          if (returnedSnapshot.empty){
            return
          } 

          if(ref.error){
            dispatch({
              type: PRODUCT_ERROR,
              payload: ref.error
            })
          }else{
            dispatch({
              type: FETCH_PRODUCTS,
              payload: ref.products,
              queryRefNext: ref.queryRefNext
            })
          }
        })
      resolve()
    })
  }
}

export const fetchNextProducts = (queryRef) => {
  return new Promise((resolve, reject) => {

    ref.queryRef = queryRef
    queryRef.get()
      .then((snapshot) => {

        /* If documentSnapshots is empty, then we have loaded all of pages */
        if (snapshot.empty) {
          resolve(snapshot);
        };

        /* Push queried data to products */
        let docs = snapshot.docs;
        docs.forEach(doc => {
          let productData = doc.data();
          productData.id = doc.id;
          ref.products.push(productData)
        })   

        /* Build reference for next page */
        let lastVisible = docs[docs.length - 1];

        // Return if no more queries to display
        if (!lastVisible) {
          return;
        }; 

        ref.queryRefNext = ref.queryRef
          .startAfter(lastVisible.data().createdAt)
          .limit(LIMIT_PER_PAGE);

        // Resolve products snapshot to be Dispatch to store      
        resolve(snapshot);

      })
      .catch((error) => {
        ref.error = error;
        reject(ref.error)
      })
  })
}

export const createProduct = (product) =>{
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // make async call
    const firestore = getFirestore().collection('products');
    firestore.add({
      ...product,
      name: 'Apple iMac Pro',
      price: 6000,
      uri_thumbnail: 'https://cdn3.dpmag.com/2018/02/Apple-iMac-Pro.jpg',
      createdAt: new Date(),
      location: 'Manukau',
      delivery: 'shipping',
      category: 'Apple',
      condition: 'new',
      description: 'An iMac with four cores is remarkable enough. But an iMac with 8, 10, 14 or 18 cores is an entirely different creature. Add Turbo Boost speeds up to 4.5GHz, and iMac Pro has the power and flexibility to balance multicore processing with single‑thread performance.',
      
    }).then(() => {
      dispatch({
        type: CREATE_PRODUCT,
        payload: product,
      })
    }).catch((error) => {
      dispatch({
        type: PRODUCT_ERROR,
        payload: error
      })
    })
  }
}

export const updateAllProduct = (product) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    const firestore = getFirestore().collection('products');
    firestore.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          var ref = firestore.doc(doc.id);

          console.log('UPDATING: ' + ref.id)
          return ref.update({
              description: 'Contact me for additional details.',
              userseller: {
                userid: ref.id,
                username: {
                  userfname: 'Dylan',
                  userlname: 'Jacob'
                },
                userrankings: 'hero',
                userratings: 4.2,
                usersince: new Date(),
                userverified: true
              }
          }).then(() => {
            console.log('All products have been updated')
          }).catch((error) => {
            console.log('Error updating all products: ', error.message)
          })
      });
    });
  }
}

export const searchProducts = (keyword, pageNum) => dispatch => {  

  const searchProducts = firebaseFunctions.httpsCallable('dbProductsOnSearch')
  searchProducts({keyword: keyword})
  .then((result) => {

    /* Push particular data to products */
    let docs = result.data.searchResults.hits.hits;
    products = [];

    docs.forEach(doc => {
      let productData = doc._source;
      productData.id = doc._id;
      products.push(productData)
    })

    // dispatch to storeafter formatting the result data
    dispatch({
      type: SEARCH_PRODUCT,
      payload: products
    })

  }).catch((error) => {
    // Getting the Error details.
    var code = error.code;
    var message = error.message;
    var details = error.details;
    console.log("searchProducts ERROR: ", message)
  });
}

export const fetchProducts = (keyword, pageNum, resultSize) => (dispatch, getstate) => {
  
  return new Promise((resolve, reject) => {
    let url = 'http://35.244.79.165//elasticsearch/products/product/_search?q=';
    let size = '&size=' + resultSize;
    let pagenum = '&from=' + pageNum;
    let sortby = '&sort=createdAt._seconds:asc';
    let queryURL = url + keyword + size + pagenum + sortby; 
    
    // Get ElasticSearch access token from Store. 
    // This is saved from FB cloud functions on login
    let authToken = getstate().auth.estoken;

    fetch(queryURL, 
      {
        "credentials":"include",
        "headers":{
          "authorization": authToken, //Encrypt this
          "cache-control":"no-cache",
          "pragma":"no-cache",
          "upgrade-insecure-requests":"1"
        },
        "body":null,
        "method":"GET",
        "mode":"cors"
      })
      .then((response) => response.json())
      .then((res => {

        /* Push queried data to products */
        let docs = res.hits.hits;
        let items_total = res.hits.total;

        //ref.products = [];

        docs.forEach(doc => {
          //console.log(doc)
          let productData = doc._source;
          productData.id = doc._id;
          ref.products.push(productData)
        })

        dispatch({
          type: FETCH_PRODUCTS,
          payload: ref.products, 
          items_total
        })

        resolve(res)
        
      }))
      .catch(error => {
        console.error('Error:', error)
        reject(error)
      })
  })
}

// searchProductsDirect() is a function directly searching ElasticSearch server from the app
// Unlike searchProducts() which queries from Firebase Cloud Functions which queries from ElasticSearch
// Currently only way of securing Authorization token
export const searchProductsDirect = (keyword, pageNum, resultSize) => (dispatch, getstate) => {  

  return new Promise((resolve, reject) => {

    let url = 'http://35.244.79.165//elasticsearch/products/_search?q=';
    let size = '&size=' + resultSize
    let pagenum = '&from=' + pageNum
    let sortby = '&sort=createdAt._seconds:asc';
    let queryURL = url + keyword + size + pagenum + sortby; 

    console.log("searchProductsDirect: " + queryURL)

    // Get ElasticSearch access token from Store. 
    // This is saved from FB cloud functions on login
    let authToken = getstate().auth.estoken
      
    // Fetch from elasticsearch
    fetch(queryURL, 
    {
      "credentials":"include",
      "headers":{
        "authorization": authToken, 
        "cache-control":"no-cache",
        "pragma":"no-cache",
        "upgrade-insecure-requests":"1"
      },
      "body":null,
      "method":"GET",
      "mode":"cors"
    })
    .then((response) => response.json())
    .then((res => {

      /* Push queried data to products */
      let docs = res.hits.hits;
      let search_results_total = res.hits.total;
      ref.products = [];

      docs.forEach(doc => {
        let productData = doc._source;
        productData.id = doc._id;
        ref.products.push(productData)
      })

      // dispatch to storeafter formatting the result data
      dispatch({
        type: SEARCH_PRODUCT,
        payload: ref.products,
        search_results_total
      })
      resolve(res)
    }))
    .catch(error => {
      dispatch({
        type: PRODUCT_ERROR, error
      })
      reject(error)
    });
  
  })
}

// Next steps:
// 1 - Capture image from camera / camera roll
//   a - create image blob
//   b - push imageblobs to array
//   c - format array for use on react-redux-firebase uploadFiles() // Or use Firebase .put
// 2 - Send to firebase/storage
// 3 - then send firebase-storage/photo-url to dbProductsOnLabelImage on firebaseFunction
// receive callback with labels

// createImageBlob creates blob from images uri
createImageBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      xhr.response._data.name = new Date().getTime() + "-media.jpg";
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log("createImageBlob | Generating blob error: " + e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  })
}

prepareImagesBlob = (photoData) => {
  return new Promise((resolve, reject) => {
    const imagesBlob = [];

    photoData.map((image, index) => {      
      
      createImageBlob(image.uri)
        .then((blob)=>{
          imagesBlob.push(blob)
          
          if (photoData.length == imagesBlob.length){
            resolve (imagesBlob)
          }
        })
        .catch(err => {
          reject(err)
        })
  });
  })
}

export const storeProductImages = (photoData) => (dispatch, getState, {getFirebase}) =>{
  return new Promise((resolve, reject) => {
        
    const filesPath = 'products/';    
    const options = {
      name: (file) => `${Date.now()}-media.jpg`
    }

    prepareImagesBlob(photoData)
      .then((arrImageBlob)=>{
        console.log('Uploading photos', arrImageBlob)
        getFirebase().uploadFiles(filesPath, arrImageBlob, filesPath, options)
          .then((snapshot)=>{
            console.log('Success photos: ', snapshot)
            return resolve(snapshot.uploadTaskSnapshot);
          })
          .catch(err => {
            return reject(err)
          })
      })
  })
}

export const annotateImage = (imageFile) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    console.log("annotateImage called")

    //const imageFile = 'https://cdn1.medicalnewstoday.com/content/images/articles/324/324190/shot-of-a-dog.jpg'
    const fbfunction = getFirebase().functions().httpsCallable('dbProductsOnLabelImage')
    
    fbfunction({imageFile: imageFile})
      .then((result) => {
        imageAnnotations = result.data.imageAnnotations[6];
        
        console.log(imageAnnotations)
      })
      .catch(function(error) {
        // Getting the Error details.
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.log("annotateImage Error: ", message)

        dispatch({
          type: PRODUCT_ERROR, error
        });

      });
  }
}