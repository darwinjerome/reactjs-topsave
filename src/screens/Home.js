import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import MainHeader from '../components/MainHeader';
import FeedProducts from '../components/FeedProducts'
import FloatingButton from '../components/FloatingButton';

class Home extends Component {

  render() {
    return (
      <View style={styles.container}>
        <MainHeader navigation={this.props.navigation} showSearch />      
        <FeedProducts navigation={this.props.navigation} />
        <FloatingButton />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent'
  },
})

export default Home;