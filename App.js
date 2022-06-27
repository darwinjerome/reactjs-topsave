import React, {Component} from 'react';
import Root from './src/Root';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
// import { useFonts, Rubik300_Light, Rubik400_Regular, Rubik500_Medium, Rubik700_Bold,Rubik900_Black } from '@expo-google-fonts/rubik';

// Redux setup
import { Provider } from 'react-redux';
import store from './src/store';

import {decode, encode} from 'base-64';
// import { fonts } from 'react-native-elements/dist/config';

export default class App extends Component {
	
	constructor(props) {
    super(props);
    this.state = { fontsLoaded: false };
	}

	async _loadFontsAsync() {
    await Font.loadAsync({
			'rubik-light': require('./src/assets/fonts/Rubik-Light.ttf'),
			'rubik-regular': require('./src/assets/fonts/Rubik-Regular.ttf'),
			'rubik-medium': require('./src/assets/fonts/Rubik-Medium.ttf'),
			'rubikbold': {
				uri: require('./src/assets/fonts/Rubik-Bold.ttf'),
				display: Font.FontDisplay.FALLBACK
			},
			'rubik-black': require('./src/assets/fonts/Rubik-Black.ttf'),
		}).then( res=>{
			console.log("FONTS LOADED");
			this.setState({ fontsLoaded: true})
		});
    
  }

	componentDidMount() {
		
		if (!global.btoa) { global.btoa = encode };
		if (!global.atob) { global.atob = decode };
		
		this._loadFontsAsync();
  }

	render() {
		console.log(this.state.fontsLoaded);
		if (this.state.fontsLoaded) {
			return (
				<Provider store={store}>
					<Root />
				</Provider>
			)  
		}else{
			return <AppLoading />;
		}	
	}
}