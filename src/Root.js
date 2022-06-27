import React, { Component } from 'react';

// For routing between pages
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Screens for Authentication
import ScreenLoading from './screens/Loading';
import ScreenSignUp from './screens/SignUp';
import ScreenLogin from './screens/Login';

// Screens for main App
import AppDrawerNavigator from './screens/drawers/main';

// creates navigator for main App screens such as Home, Profile, Settings, etc.
// const AppStackNavigator = createStackNavigator({ 
//   Home: {
//     screen: ScreenHome
//   },
// });

// create navigator for Authentication screens
const AuthStackNavigator = createStackNavigator({
  Login: {
    screen: ScreenLogin
  },
  SignUp: {
    screen: ScreenSignUp
  },
})

const AppSwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: ScreenLoading,
    Auth: AuthStackNavigator, 
    App: AppDrawerNavigator, 
  }
)

// create the container showcasing different navigator stacks including loading page.
const AppContainer =  createAppContainer(AppSwitchNavigator);

// Display or return the AppContainer
export default class Root extends Component {
  render() {
    return <AppContainer />;
  }
}