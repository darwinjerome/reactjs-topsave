import React, { Component } from 'react';
import { Dimensions, Image, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window')

class ImageTile extends Component {

  renderCamera(){
    let { redirectToCamera, columnSize } = this.props;
    let size = width/columnSize;

    return (
      <TouchableOpacity
        style={{ width: size, height: size }}
        onPress={ ()=>redirectToCamera() }>
        <View style={styles.button}>
          <SimpleLineIcons name="camera" size={40} color="#8E8E93" />
          <Text>Take photo</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    let { item, index, selected, selectImage, columnSize } = this.props;
    if (!item) return null;

    if (item=="camera") return this.renderCamera();

    return (
      <TouchableOpacity
        underlayColor='transparent'
        onPress={() => selectImage(index)}
      >
       <View style={styles.container}>
        { selected ? 
          <MaterialCommunityIcons
            style={styles.icon}
            name='check'
            color='#4BB3FF'
            size={60}
          /> : null }

        <Image
          style={{
            width: width/columnSize, 
            height: width/columnSize,
            opacity: selected ? 0.5 : 1
          }}
          source={{uri: item}}
        />
        </View>
      </TouchableOpacity>
    )
  }
}
export default ImageTile;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', 
    alignItems: 'center'
  },
  icon: {
    position: 'absolute', 
    zIndex: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: '#8E8E93',
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100%'
  }
})