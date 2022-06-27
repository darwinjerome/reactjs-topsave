import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

class Logo extends Component {
  render() {
    const { size, style } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={ () => this.props.navigation.navigate("AppHome")}>
          <Text style={[styles.logo, {fontSize: size}, style]}> TOPSAVE  </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  logo: { 
    color: '#707070', 
    fontFamily: 'rubikbold', 
  },
})

export default withNavigation(Logo)