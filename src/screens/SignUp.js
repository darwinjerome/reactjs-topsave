import React, { Component } from 'react'
import { StyleSheet, View, LayoutAnimation, UIManager } from 'react-native'
import {Input, Button, Text } from 'react-native-elements';
import { signUp } from '../actions/authActions';
import { connect } from 'react-redux';
import firebase from '../utils/firebase';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class SignUp extends Component {
  constructor(props){
		super(props);
	  
    this.state = { 
      firstName: '',
      lastName: '',
      email: '', 
      password: '',      
      isLoading: false,
      isFistNameValid: true,
      isLastNameValid: true,
      isEmailValid: true,
      isPasswordValid: true,
      nameErrorMessage: 'Please enter your name',
      emailErrorMessage: 'Please provide a valid email address',
      passwordErrorMessage: 'Please enter at least 8 characters',
      
    }
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  handleSignUp = (newUser) => {
    //const { email, password, passwordConfirmation } = this.state;
    this.setState({ isLoading: true });

    LayoutAnimation.easeInEaseOut();

    const fname = newUser.firstName
    const lname = newUser.lastName
    const email = newUser.email
    const password = newUser.password
      
    if (fname.length == 0 || lname.length == 0 || !this.validateEmail(email) || password.length < 8) {
      this.setState({
        isLoading: false,
        isFistNameValid: fname.length > 0 || this.firstNameInput.shake(),
        isLastNameValid: lname.length > 0 || this.lastNameInput.shake(),
        isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
        isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
      })

    }else{
      this.props.signUp(this.state)
      // // Register user and then update displayName
      // firebase.auth().createUserWithEmailAndPassword(email, password)
      // .then((user) => {
      //     var user = firebase.auth().currentUser;
        
      //     user.updateProfile({
      //       displayName: name,
      //       //photoURL: "https://example.com/jane-q-user/profile.jpg"
      //     }).then(function() {
      //       // Profile updated successfully!
      //       var displayName = user.displayName;
            
      //     }).catch(function(error) {
      //       // An error happened.
      //       console.log(error)
      //     });
      //   })
      // .catch((error) => {
      //   // Handle Errors here.
      //   var errorCode = error.code;

      //   if (errorCode == 'auth/email-already-in-use') {
      //     this.setState({
      //       emailErrorMessage: "The email address is already in use",
      //       isEmailValid: false,
      //       isLoading: false,
      //     })
      //     this.emailInput.shake();
      //   }else if(errorCode == 'auth/invalid-email'){
      //     this.setState({
      //       emailErrorMessage: "Please provide a valid email address",
      //       isEmailValid: false,
      //       isLoading: false,
      //     })
      //     this.emailInput.shake();
      //   }
      // }); 
    }
  }


  // FIX THIS COMPONENDID UPDATE

  // Check if authError has been updated and show display error
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
      
      if (this.props.authError.type && this.props.authError.code=='auth/email-already-in-use'){
        
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

  handleLogin = () => {
    this.props.navigation.navigate('Login');
  }

  onChange = (e) => {
    return (text) => {
      this.setState({ [e]:text })
    }
  }

  render() {

    return (
      <View style={theme.container}>
        <Text h3>Sign Up</Text>

        <Input style={{marginBottom:150}}
          placeholder='First name'
          shake={true}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={{ marginLeft: 10 }}
          returnKeyType="next"

          value={this.state.firstName}
          ref={input => (this.firstNameInput = input)}
          onSubmitEditing={() => this.lastNameInput.focus()}
          onChangeText={this.onChange('firstName')}
          errorMessage={
            this.state.isFistNameValid ? null : this.state.nameErrorMessage
          }
        />

        <Input style={{marginBottom:150}}
          placeholder='Last name'
          shake={true}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={{ marginLeft: 10 }}
          returnKeyType="next"

          value={this.state.lastName}
          ref={input => (this.lastNameInput = input)}
          onSubmitEditing={() => this.emailInput.focus()}
          onChangeText={this.onChange('lastName')}
          errorMessage={
            this.state.isLastNameValid ? null : this.state.nameErrorMessage
          }
        />
        <Input style={{marginBottom:150}}
          placeholder='Email'
          shake={true}
          keyboardAppearance="light"
          autoFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          inputStyle={{ marginLeft: 10 }}
          
          value={this.state.email}
          onChangeText={this.onChange('email')}
          ref={input => (this.emailInput = input)}
          onSubmitEditing={() => this.passwordInput.focus()}
          onChangeText={email => this.setState({ email })}
          errorMessage={
            this.state.isEmailValid ? null : this.state.emailErrorMessage
          }
        />
        <Input style={{marginBottom:120}}
          placeholder='Password'
          secureTextEntry={true}
          shake={true}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={{ marginLeft: 10 }}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          
          ref={input => (this.passwordInput = input)}
          onSubmitEditing={ () => this.handleSignUp(this.state.name, this.state.email, this.state.password)}
          onChangeText={this.onChange('password')}
          errorMessage={
            this.state.isPasswordValid ? null : this.state.passwordErrorMessage
          }
          returnKeyType="go"
        />
 
        <Button containerStyle={{marginTop:20, width:'90%'}}
          title="Create Account"
          type="outline"          
          buttonStyle={{borderRadius:20}}
          loading={this.state.isLoading}
          disabled={this.state.isLoading}
          onPress = {() => this.handleSignUp(this.state)}
        >
        </Button>
        <Button containerStyle={{marginTop:20, width:'90%'}}
          title="Sign In"
          type="clear"    
          buttonStyle={{borderRadius:20}}
          disabled={this.state.isLoading}
          onPress = {() => this.handleLogin()}
        >
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})

const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (newUser) => dispatch(signUp(newUser))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);