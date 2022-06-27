import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainHeader from '../components/MainHeader';

class Settings extends Component{

  render(){

    const { navigation } = this.props;
    const keyword = navigation.getParam('keyword', '');

    return(
      <View style={styles.container}>
        <MainHeader navigation={this.props.navigation} />
        
        <View style={styles.content}>
          <Text>Settings: { keyword }</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  content: {
    marginTop: 15,
    alignItems: 'center',
  },
})


export default Settings;
