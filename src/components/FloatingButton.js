import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';
import ActionButton from 'react-native-circular-action-menu';
import { withNavigation } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { createProduct, updateAllProduct, annotateImage } from '../actions/productActions';
import * as Font from 'expo-font';



class FloatingButton extends Component {

  createProduct = () => {
    this.props.createProduct();
  }

  render() {
    return (
      <View style={styles.mainButton} >
      <ActionButton 
          buttonColor="rgba(75, 179, 255, 1)"
          position="right"
          bgColor='transparent'
          radius={100}          
          btnOutRange='rgba(75, 179, 255, 1)'>

          <ActionButton.Item 
            size={50} 
            buttonColor='#4BB3FF' 
            title="New Task" 
            onPress={() => { this.props.annotateImage() }}>
            <Icon name="store" color='#ffffff' type='material' style={styles.actionButtonIcon} />            
          </ActionButton.Item>          

          <ActionButton.Item
            size={50} 
            buttonColor='#4BB3FF' 
            title="Notifications" 
            onPress={() => { }}>
            <Icon name="forum" color='#ffffff' type='material-community' style={styles.actionButtonIcon} />
          </ActionButton.Item>

          <ActionButton.Item 
            size={50}
            buttonColor='#4BB3FF' 
            title="All Tasks" 
            onPress={() => { this.props.navigation.navigate('PostProductCameraRoll') }}>
            <Icon name="add-shopping-cart" color='#ffffff' type='material' style={styles.actionButtonIcon} />
          </ActionButton.Item>
          
        </ActionButton></View>
    );
  }

}

const styles = StyleSheet.create({
  mainButton: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    bottom: 26,
    right: 26,

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,  
    elevation: 1,
    zIndex: 9,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    createProduct: () => { dispatch(createProduct()) }, 
    updateAllProduct: () => { dispatch(updateAllProduct()) },
    annotateImage: () => dispatch(annotateImage())
  };
}

export default connect(null, mapDispatchToProps)(withNavigation(FloatingButton));