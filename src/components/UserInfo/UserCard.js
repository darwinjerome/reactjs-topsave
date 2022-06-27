import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Rating } from 'react-native-elements'
import DisplayAvatar from './DisplayAvatar';

import { connect } from 'react-redux'

class UserCard extends Component {
  
  handlePress = () => {
    let user = this.props.user;
    console.log(user.userid)
  }

  displaySmall = () => {

    const { profile } = this.props

    return (<View style={stylesSmall.profile}>
      <DisplayAvatar size="large" />
      <View style={stylesSmall.profileContent}>
        <Text style={stylesSmall.profile_h1}>Hello, { profile.firstName } </Text>
        <Text style={stylesSmall.profile_email}>{ profile.email }</Text>
      </View> 
    </View>)

  }

  displayBig = () => {

    let user = this.props.user;

    // Convert timestamp from firestore into a readable date and display only the year
    let epochmilliseconds = user.usersince.seconds *1000;
    let currentDate = new Date(epochmilliseconds);
    let usersince = currentDate.getFullYear();

    return (<TouchableOpacity onPress={() => this.handlePress()}>
    <View style={styles.vendor}>
      <DisplayAvatar size={110} />
      <View style={styles.vendordetails}>
        <Text style={styles.vendorname}>{ user.username.userfname } { user.username.userlname }</Text>
        <Text style={styles.vendortext}>Since { usersince }</Text>
        <Text style={styles.vendortext}>{ user.userverified ? 'Verified' : null }</Text>
        <Text style={styles.vendortext}>Ranking { user.userrankings }</Text>
        <View style={styles.vendorrating}>
          <Text style={styles.vendortext}>Ratings </Text>
          <Rating
            type='custom'
            ratingBackgroundColor='#8E8E93'
            ratingColor='#FFBA00'
            ratingTextColor='transparent'
            imageSize={16}
            readonly
            startingValue={ user.userratings } 
            style={ styles.stars }
            tintColor = '#EFEFEF' />              
          </View>
      </View>
    </View>
    </TouchableOpacity>)
  }

  render() {

    let display;

    if(this.props.type == 'small'){
      display = this.displaySmall()
    }else{
      display = this.displayBig()
    }

    return (
      <View>{display}</View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.firebase.profile
  }
}

export default connect(mapStateToProps)(UserCard)


const styles = StyleSheet.create({
  vendor: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#EFEFEF',
    height: 140,
    padding: 20,
    marginTop: 40,
    marginBottom: 60,
    alignSelf: 'stretch',
  },
  vendordetails: {
    paddingLeft: 20,
    alignItems: 'stretch',
  },
  vendorname :{
    fontFamily: 'rubik-medium',
    fontSize: 20,
    color: '#505050',
    marginBottom: 8,
  },
  vendortext :{
    fontFamily: 'rubik-light',
    fontSize: 14,
    color: '#505050',
    marginBottom: 2,
  },  
  vendorrating :{
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    backgroundColor: '#EFEFEF',
   
  }
})


const stylesSmall = StyleSheet.create({
  profile: {    
    marginTop: 20,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    
    backgroundColor: 'white',
    shadowColor: '#CACAD0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,  
    elevation: 1,
  },
  profileContent: {
    paddingLeft: 10,
    paddingTop: 10,
  },
  profile_h1:{
    fontSize: 22,
    fontFamily: 'rubik-medium',
    color: '#505050',
  },
  profile_email:{
    fontSize: 12,
    fontFamily: 'rubik-light',
    color: '#8E8E93',
  }
})