import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MainHeader from '../components/MainHeader';
import FeedProducts from '../components/FeedProducts';
import FloatingButton from '../components/FloatingButton';

class SearchResults extends Component{

  render(){
    const { navigation } = this.props;
    const keyword = navigation.getParam('keyword', '');

    return(
      <View style={styles.container}>
        <MainHeader keyword={keyword} navigation={this.props.navigation} isBack showSearch />        
        <FeedProducts keyword={keyword} navigation={this.props.navigation} isFilter />
        <FloatingButton />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
})

export default SearchResults;