import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { withNavigation } from 'react-navigation';
import ImageBrowser from '../../components/ImageBrowser/ImageBrowser';
import MainHeader from '../../components/MainHeader';
import { connect } from 'react-redux';
import { storeProductImages } from '../../actions/productActions';

class ProductCapture extends Component {

  constructor(props){
    super(props)

    this.state = {
      photos: [],
      maxSelect: 5
    };
  }
  
  // This callback is being called everytime the user
  // select or deselect a photo from ImageBrowser
  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      this.setState({ photos })
    }).catch((e) => console.log(e))
  }

  postProductDetails = () => {
    // Save selected photos to redux-store
    // before going to the PostProductDetails page
    let photoData = this.state.photos;
    
    this.props.storeProductImages(photoData)
    .then((result)=>{
      console.log("uploadUrl Success: ", result)
      //this.props.navigation.navigate("PostProductDetails");
    })
    .catch((e)=>{
      console.log(e);
    })

    // photoData.map(async(image) => {
      // try {
      //   if (image) {
      //     uploadUrl = await this.props.storeProductImages(image.uri);
      //     console.log("uploadUrl " + uploadUrl)
      //     this.props.navigation.navigate("PostProductDetails");
      //   }
      // } catch (e) {
      //   console.log(e);
      //   alert('Upload failed, sorry :(', e);
      // } finally {
      //   //this.setState({ uploading: false });
      // }
    // })
  }

  render() {
    const subtitle = "Add your item photos. You can add up to " + this.state.maxSelect + " photos to feature in your product listing";

    return(
      <View style={styles.container}>
        <MainHeader navigation={this.props.navigation} 
          isBack 
          title="Photos" 
          subtitle={subtitle} 
          hideAvatar 
          rightCustomButton={this.postProductDetails}/>
        <ImageBrowser max={this.state.maxSelect} callback={this.imageBrowserCallback} columnSize={3}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
})

const mapDispatchToProps = (dispatch) => {
  return {
    storeProductImages: (photoData) => { return dispatch(storeProductImages(photoData)) }
  };
}

export default connect(null, mapDispatchToProps)(withNavigation(ProductCapture));