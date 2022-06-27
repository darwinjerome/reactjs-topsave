import React from 'react';
import { StyleSheet, View, LayoutAnimation, 
  UIManager, Modal, ActivityIndicator } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import Logo from '../components/Common/Logo';
import { connect } from 'react-redux';
import { signIn } from '../actions/authActions';
import { DismissKeyboard } from '../components/Common/DismissKeyboard'; // Dismiss keyboard when pressed anywhere without any feedback
import * as Facebook from 'expo-facebook'; 

// firebase
import firebase, { FACEBOOK_APP_ID } from '../utils/firebase';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      email: 'darwinjerome+1@ymail.com',
      password: 'macbeth7',
      isLoading: false,
      emailErrorMessage: null,
      passwordErrorMessage: null
    }
  }

// Check if authError has been updated and show custom error messages
componentDidUpdate(prevProps) {

  if(prevProps.authError != this.props.authError){
    
    if(this.props.authError){

      if (this.props.authError.type && this.props.authError.type=='userpassword'){
      
        this.setState({
          isLoading: false,
          emailErrorMessage: null,
          passwordErrorMessage: this.props.authError.message
        }, () => this.passwordInput.shake() )
      }
      
      if (this.props.authError.type && this.props.authError.type=='userid'){
        
        this.setState({
          isLoading: false,
          emailErrorMessage: this.props.authError.message,
          passwordErrorMessage: null
        }, () => this.emailInput.shake() )
      }  

    }else{
      return null;
    }
    
  }
} 

  handleLogin = (email, password) => {
    LayoutAnimation.easeInEaseOut();

    // show loading screen
    this.setState({ isLoading: true })

    // call signIn action with the credetians (state.email, state.password)
    this.props.signIn(this.state)
  }

  async handleLoginWithFacebook() {

    // Init Facebook
    await Facebook.initializeAsync(FACEBOOK_APP_ID);

    const {
      type,
      token,
    } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
      permissions: ['public_profile'],
    });
    
    if(type === 'success'){

      // show loading screen
      this.setState({ isLoading: true })

      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      firebase.auth().signInWithCredential(credential)
      .then((userCredential) => {
        
      })
      .catch((error) => {
        // Handle errors
        console.log(error)
      })
    }
  }
  
  handleSignUp = () => {
    this.props.navigation.navigate('SignUp');
  }


  render() {
    return (
      <DismissKeyboard> 
      <View style = {theme.container}>
        <Logo size = {40} style = {{marginBottom: 50}} />
        <Input style = {theme.inpuText}
          ref = {(input) => { this.emailInput = input }}
          errorMessage = {this.state.emailErrorMessage}
          errorStyle = {theme.errorStyle}
          placeholder = 'Email'
          shake = {true}
          autoCapitalize = "none"
          autoCorrect = {false}
          onChangeText = {email => this.setState({ email })}
          value = {this.state.email}
          onSubmitEditing = {() => this.passwordInput.focus()}
          returnKeyType = "next"
          showLoading = {true}
          rightIcon = {
            this.state.isLoading ?
            <ActivityIndicator size = "small" color = "#CACAD0" /> : null
          }
        />
        <Input style = {theme.inputText}
          ref = {(input) => { this.passwordInput = input }}
          errorMessage = {this.state.passwordErrorMessage}
          errorStyle = {theme.errorStyle}
          placeholder = 'Password'
          secureTextEntry = {true}
          shake = {true}
          autoCapitalize = "none"
          autoCorrect = {false}
          onChangeText = {password => this.setState({ password })}
          value = {this.state.password}
          onSubmitEditing = {() => this.handleLogin(this.state.email, this.state.password)}
          returnKeyType = "go"
          rightIcon = {
            this.state.isLoading ?
            <ActivityIndicator size = "small" color = "#CACAD0" /> : null
          }
        />
        <Button containerStyle={theme.buttonContainer}
          title="Login"
          type="outline"          
          buttonStyle={theme.buttonDefault}
          onPress = {() => this.handleLogin(this.state.email, this.state.password)}
        >
        </Button>
        <Button containerStyle={theme.buttonContainer}
          title="Sign up"
          type="outline"
          buttonStyle={theme.buttonDefault}
          onPress = {() => this.handleSignUp()}
        >
        </Button>
        <Button containerStyle={{marginTop:20, width:'90%', backgroundColor:'#ffffff'}}
          title="Facebook Login"
          type="solid"
          onPress = {() => this.handleLoginWithFacebook()}
          buttonStyle={{
            backgroundColor: '#3b5998',
            borderWidth: 2,
            borderColor: '#3b5998',
            borderRadius: 30,
          }}
        >
        </Button>
      </View>
      </DismissKeyboard>
    );
  }
}

const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inputText:{
    borderBottomWidth: 0
  },
  buttonContainer:{
    marginTop:20, 
    width:'90%'
  },
  buttonDefault:{
    borderRadius:20,
  },
  errormessage: {
    backgroundColor: '#FBCEC8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5%',
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  errorStyle: {
    color: '#FF7C6E',
    padding: 10,
    margin: 0
  }
});

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError
  }
  
}
const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (credential) => dispatch(signIn(credential))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);