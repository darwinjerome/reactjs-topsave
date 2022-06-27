import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import LogoutButton from '../../components/LogoutButton';
import UserCard from '../../components/UserInfo/UserCard';

// App screens
import ScreenHome from '../Home';
import ScreenSettings from '../Settings';
import ScreenProductDetail from '../ProductDetail';
import ScreenSearch from '../Search';
import ScreenSearchResults from '../SearchResults';
import ScreenCamera from '../PostProduct/CameraScreen';
import ScreenCameraRoll from '../PostProduct/CameraRollScreen';
import ScreenPostProductDetails from '../PostProduct/PostProductDetails';

const CustomDrawerComponent = (props) => (
  
  <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
    
    {/* Display usercard component on top of drawer */}
    <UserCard type='small' />

    {/* Display links */}
    <ScrollView style={styles.text}>
      <DrawerItems {...props} contentOptions />      
    </ScrollView>
    
    {/* Logout Component */}
    <View style={styles.text}>
      <LogoutButton />  
    </View>
    
  </SafeAreaView>
)


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: 'rubik-regular',
    fontSize: 0,
  }
})

/* Custom transition configuration for Stack Navigator */
/* This enables custom transition (ie fade, slide) to be set via props on this.props.navigate */ 
const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        default: SlideFromRight(index, position, width),
        collapseExpand: CollapseExpand(index, position),
        fadeIn: FadeIn(index, position),

        
      }[transition];
    },
  }
}

/* Custom screen transition animations */
let SlideFromRight = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0]
  })
  const slideFromRight = { transform: [{ translateX }] }
  return slideFromRight
};

let CollapseExpand = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });

  const scaleY = position.interpolate({
    inputRange,
    outputRange: ([0, 1, 1]),
  });

  return {
    opacity,
    transform: [
      { scaleY }
    ]
  };
};

let FadeIn = (index, position) => {
  const sceneRange = [index - 1, index];
  const outputOpacity = [0, 1];
  const transition = position.interpolate({
    inputRange: sceneRange,
    outputRange: outputOpacity,
  });

  return {
    opacity: transition
  }
}

/* Create main screen navigator */
/* Add screens here */
const HomeStackNavigator = createStackNavigator(
  {
    AppHome: { screen: ScreenHome },
    Product: { screen: ScreenProductDetail },
    Search: { screen: ScreenSearch },
    SearchResults: { screen: ScreenSearchResults },
    PostProductCameraRoll: { screen: ScreenCameraRoll },
    PostProductCamera: { screen: ScreenCamera },
    PostProductDetails: { screen: ScreenPostProductDetails },
  },
  {
    initialRouteName: 'AppHome',
    headerMode: 'none',
    //mode: Platform.OS === "ios" ? "modal" : "card",
    // transitionConfig: TransitionConfiguration, //->deprecated
    ...TransitionPresets.SlideFromRightIOS,
  },
);

// Create a sidebar menu on the main screen
export default AppDrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: HomeStackNavigator },
    "My Orders": { screen: "<View><View />" },
    "My Liked Items": { screen: "<View><View />" },
    Settings: { screen: ScreenSettings },
    Help: { screen: "<View><View />" },
    Terms: { screen: "<View><View />" },
  }, 
  { 
    contentComponent: CustomDrawerComponent,
    contentOptions: {
      activeTintColor: '#505050',
      itemsContainerStyle: {
        marginVertical: 30,
      },
      inactiveBackgroundColor :'#ffffff',
      activeBackgroundColor :'#EFEFEF',
      labelStyle: {
        fontSize: 16,
        fontFamily: 'rubik-light',
        color: '#8E8E93',
      }
    }
  }
);
