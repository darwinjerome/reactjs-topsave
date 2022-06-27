import React, { Component } from 'react';
import { StyleSheet, Text, View, CameraRoll, FlatList, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import { FileSystem } from 'expo';
import ImageTile from './ImageTile';

const { width } = Dimensions.get('window')

class ImageBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: ["camera"],
      selected: {},
      after: null,
      has_next_page: true
    }
  }

  componentDidMount() {
    this.getPhotos()
  }

  selectImage = (index) => {
    let newSelected = {...this.state.selected};
    if (newSelected[index]) {
      delete newSelected[index];
    } else {
      newSelected[index] = true
    }

    // Select image if not more than the props.max
    if (Object.keys(newSelected).length > this.props.max) return;
    if (!newSelected) newSelected = {};

    // setState on newSelected photo and then prepare callback
    this.setState({ selected: newSelected }, 
      () => {
        this.prepareCallback();
      })
  }

  getPhotos = () => {
    let params = { first: 50, mimeTypes: ['image/jpeg'] };
    if (this.state.after) params.after = this.state.after
    if (!this.state.has_next_page) return
    CameraRoll
      .getPhotos(params)
      .then(this.processPhotos)
  }

  processPhotos = async (r) => {

    if (this.state.after === r.page_info.end_cursor) return;
    let uris = r.edges.map(i=> i.node).map(i=> i.image).map(i=>i.uri)

    this.setState({
      photos: [...this.state.photos, ...uris],
      after: r.page_info.end_cursor,
      has_next_page: r.page_info.has_next_page
    });
  }

  getItemLayout = (data, index) => {
    let { columnSize } = this.props;
    let length = width/columnSize;
    return { length, offset: length * index, index }
  }

  prepareCallback() {
    let { selected, photos } = this.state;
    let selectedPhotos = photos.filter((item, index) => {
      return(selected[index])
    });
    let files = selectedPhotos.map(i => FileSystem.getInfoAsync(i, {md5: true, uri: true}))
    
    let callbackResult = Promise
      .all(files)
      .then(imageData=> {
        return imageData.map((data, i) => {
          // update URI with selectedPhotos[i]
          data.uri = selectedPhotos[i];
          return {
            id: i,
            ...data}
        })
      })
      
    // Save callbackResult (photo list)
    // and then call this.props.callback on parent
    this.props.callback(callbackResult)
  }

  redirectToCamera = () =>{
    this.props.navigation.navigate("PostProductCamera")
  }

  renderImageTile = ({item, index}) => {
    let selected = this.state.selected[index] ? true : false
    let {columnSize} = this.props;
    
    return(
      <ImageTile
        item={item}
        index={index}
        selected={selected}
        selectImage={this.selectImage}
        redirectToCamera={()=>this.redirectToCamera()}
        columnSize={columnSize}
      />
    )
  }
  renderImages() {
    let {columnSize} = this.props;

    return(
      <FlatList
        data={this.state.photos}
        numColumns={columnSize}
        renderItem={this.renderImageTile}
        keyExtractor={(_,index) => index}
        onEndReached={()=> {this.getPhotos()}}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text>Loading...</Text>}
        initialNumToRender={24}
        getItemLayout={this.getItemLayout}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderImages()}
      </View>
    );
  }
}

export default withNavigation(ImageBrowser);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10
  },
})