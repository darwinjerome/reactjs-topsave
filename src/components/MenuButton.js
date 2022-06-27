import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

class MenuButton extends Component {
  render(){
    return(
      <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
        <View style={styles.line}></View>
        <View style={styles.line2}></View>
        <View style={styles.line}></View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  menuIcon: {
    zIndex: 20,
    position: 'absolute',
    top: 40,
    left: 20,
  },
  line: {
    width: 26,
    height: 2,
    backgroundColor: '#707070',
    marginTop: 5,
    marginBottom: 0,
  },
  line2: {
    width: 16,
    height: 2,
    backgroundColor: '#707070',
    marginTop: 5,
    marginBottom: 0,
  }
})
  
export default MenuButton;