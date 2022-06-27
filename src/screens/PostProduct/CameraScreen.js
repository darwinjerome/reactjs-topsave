import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, StatusBar, CameraRoll, Platform } from 'react-native'
import { withNavigation } from 'react-navigation';
import { Text, Icon } from 'react-native-elements';
import { Camera, Permissions, FileSystem } from 'expo';

class CameraScreen extends Component {

  constructor(props){
    super(props)

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      image: null,
      photos: []
    };
  }

  componentDidMount() {
    this.getCameraPermission();
  }

  async getCameraPermission(){
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
    }
  };

  handleMountError = ({ message }) => console.log(message);

  onPictureSaved = async photo => {
    // await FileSystem.moveAsync({
    //   from: photo.uri,
    //   to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`,
    // });
    // this.setState({ newPhotos: true });

    if (Platform.OS === 'android') {
      // put android version here
    }else{
      await CameraRoll.saveToCameraRoll(photo.uri, "photo")
        .then((photourl)=>{
          this.setState({
            file: photourl,
          })
          //redirect to CameraRollScreen with the latest photo
          //console.log('Success! Photo added to camera roll!', photourl)
          //this.props.navigation.navigate("PostProductDetails", {photoData});
        })
    }

    //console.log(photo)
  }

  backbutton() {
    return(
        <View style={ styles.backbuttoncontainer }>
          <TouchableOpacity 
            style={ styles.backbutton }
            onPress={ () => this.props.navigation.goBack() }>
            <Icon
              name="arrow-back"
              size={28}
              color="#8E8E93"
            />
          </TouchableOpacity>
        </View> 
    )
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          { this.backbutton() }
          <Text>No access to camera</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar hidden={true} />
          <Camera 
            ref={ref => { this.camera = ref }}
            style={ styles.camera } 
            type={this.state.type}
            onMountError={this.handleMountError}
          >

            { this.backbutton() }
            <View style={ styles.buttoncontainer }>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Icon 
                  type='material'
                  name='cached'
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.camerabutton}
                onPress={ this.takePicture }
              >
                <Icon 
                  type='material'
                  name='photo-camera'
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.hiddenbutton}
                disabled
              >
                <Icon 
                  type='material'
                  name='insert-photo'
                  containerStyle={{opacity:0}}
                />
              </TouchableOpacity>                  
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  camera:{
    flex:1,
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  backbuttoncontainer: {
    flex:0.1,
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  backbutton: {
    width: 30, 
  },
  buttoncontainer: {
    flex:0.90,
    paddingHorizontal: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  button: {
    backgroundColor:'rgba(75, 179, 255, 1)',
    height: 60, 
    width:60, 
    borderRadius:30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camerabutton: {
    backgroundColor:'rgba(75, 179, 255, 1)',
    height: 80, 
    width:80, 
    borderRadius:40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenbutton: {
    height: 60, 
    width:60, 
    borderRadius:30,
    opacity: 0,
  }
})

export default withNavigation(CameraScreen);