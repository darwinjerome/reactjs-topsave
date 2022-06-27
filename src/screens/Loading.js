import React, { Component } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { onAuthStateChanged, getElasticSearchToken } from '../actions/authActions';
import PropTypes from 'prop-types';

import firebase from '../utils/firebase'

class Loading extends Component {
	constructor(props){
		super(props);

		// on app load, get the elastic search token
		this.props.getElasticSearchToken()
	}

	componentDidUpdate(prevProps) {		
		// If ES token exists, then check for authenticated user by adding the loadApp observer
		// Authenticated user redirects to home, if no user proceed to loginScreen. 
		if(prevProps.estoken != this.props.estoken){
			firebase.auth().onAuthStateChanged(this.loadApp)
		}
	}

	// Observers if there is authenticated user and redirects to login or home
	loadApp = async(user) => {
		this.props.navigation.navigate(user ? 'App' : 'Auth')
	}

	//Renders any loading animation or screen
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>waiting for something awesome</Text>
				<ActivityIndicator size="large" color="#CACAD0" />
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 16,
		color: '#CACAD0',
		marginBottom: 20,
	}
})

Loading.propTypes = {
	onAuthStateChanged: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
	return{
		userprofile: state.firebase.profile,
		estoken: state.auth.estoken
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onAuthStateChanged: (user) => dispatch(onAuthStateChanged(user)),
		getElasticSearchToken: () => dispatch(getElasticSearchToken())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);