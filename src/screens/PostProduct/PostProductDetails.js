import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, FlatList } from 'react-native';
import { Image, Text, Button, Icon } from 'react-native-elements'
import MainHeader from '../../components/MainHeader';
import { connect } from 'react-redux';

class PostItemDetails extends Component {

  keyExtractor = (item, index) => {
    return item.id.toString();
  }

  renderImageTile = ({item, index}) => {
    return(
      <Image
        source={{ uri: item.uri }}
        style={ styles.imageholder }
      />
    )
  }

  render() {
    const { photoData } = this.props;
    const subtitle = "Our AI suggested the title and category that match the photos you’ve chosen. You can always change this."

    return (
      <View style={styles.container}>
        <MainHeader navigation={this.props.navigation} isBack isSearchIcon title="Product Details" subtitle={subtitle}/> 
        <ScrollView style={styles.mainscroll}>
          <FlatList
            style={styles.photoscroll}
            data={photoData}
            renderItem={this.renderImageTile}
            keyExtractor={this.keyExtractor}
            horizontal
          />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1  
  },
  mainscroll: {
    paddingHorizontal: 20 
  },
  photoscroll: {
    marginTop: 10,
  },
  imageholder: {
    borderWidth: 2,
    borderColor: '#8E8E93',
    marginHorizontal: 2,
    width: 100,
    height: 100
  }
})

const mapStateToProps = (state) => {
  return {
    photoData: state.products.isPosting.item_images,
  }
}

export default connect(mapStateToProps, null)(PostItemDetails);